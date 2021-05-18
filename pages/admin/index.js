import React, {useState, useEffect, useRef} from 'react';

import Shape from '../../src/components/Shape';

import styles from '../../styles/Admin.module.css'
import { firebase } from '../../src/initFirebase';
import useConfig from '../../src/hooks/useConfig';
import useLogs from '../../src/hooks/useLogs';

const db = firebase.database();

export default function Admin() {
    const [value, setValue] = useState('');
    const [ballValue, setBallValue] = useState('');
    const [priceRanks, setPriceRanks] = useState();
    const [users, setUsers] = useState();
    const [balls, setBalls] = useState();
    const [bingo, setBingo] = useState([]);
    const [shapes, setShapes] = useState([]);

    const config = useConfig();
    const [logs, addLog] = useLogs();

    const priceRanksRef = useRef(db.ref('priceRanks'));
    const usersRef = useRef(db.ref('users'));
    const ballsRef = useRef(db.ref('balls'));
    const bingoRef = useRef(db.ref('bingo'));
    const shapesRef = useRef(db.ref('shapes'));

    function toDate(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    function toDigits(number, digits) {
        const str = number.toString();
        return str.length >= (digits || 2) ? str : `0${str}`;
    }

    function getTime(timestamp) {
        const date = new Date(timestamp);

        const time = [date.getHours(), date.getMinutes(), date.getSeconds()]
            .map(v => toDigits(v))
            .join(':');

        return [time, toDigits(date.getMilliseconds(), 3)].join('.');
    }

    useEffect(() => {
        priceRanksRef.current.on("value", (snapshot) => {
            setPriceRanks(snapshot.val());
        });

        return () => {
            priceRanksRef.current.off();
        };
    }, [])

    useEffect(() => {
        bingoRef.current.on("value", (snapshot) => {
            const value = snapshot.val();
            if (value) setBingo(Object.values(value).sort((a, b) => a.bingo - b.bingo));
            else setBingo([]);
        });

        return () => {
            bingoRef.current.off();
        };
    }, [])

    useEffect(() => {
        usersRef.current.on("value", (snapshot) => {
            setUsers(snapshot.val());
        });

        return () => {
            usersRef.current.off();
        };
    }, [])

    useEffect(() => {
        ballsRef.current.on("value", (snapshot) => {
            setBalls(snapshot.val());
        });

        return () => {
            ballsRef.current.off();
        };
    }, [])

    useEffect(() => {
        shapesRef.current.on("value", (snapshot) => {
            setShapes(snapshot.val());
        });

        return () => {
            shapesRef.current.off();
        };
    }, [])

    function accept() {
        bingoRef.current.remove();
    }

    function decline(key) {
        const bingoKey = db.ref(`bingo/${key}`);
        bingoKey.remove();
    }

    function shapeClicked(index) {
        shapesRef.current.update({
            [index]: false
        });

        addLog(`Admin enabled shape ${index + 1}`);
    }

    return (
        <main className={styles.admin}>
            <div className={styles.content}>
                { priceRanks && (
                    <div className={styles.formBlock}>
                        <h1 className={styles.title}>Set active price rank</h1>

                        <form>
                            {
                                Object.keys(priceRanks)?.map((key) => (
                                    <label key={key}>
                                        <input 
                                            type="radio" 
                                            checked={priceRanks[key].active}
                                            value={key} 
                                            name="price-rank" 
                                            onChange={(e) => {
                                                Object.keys(priceRanks).forEach((k) => {
                                                    priceRanksRef.current.child(k)
                                                        .update({ 
                                                            active: k === e.target.value 
                                                        });
                                                });

                                                ballsRef.current.remove();
                                            }}
                                        /> 
                                        {priceRanks[key].name}
                                    </label>
                                ))
                            }
                        </form> 
                    </div>
                )}


                <div className={styles.formBlock}>
                    <h1 className={styles.title}> Add new ball</h1>
                    <form onSubmit={(e) => {
                        e.preventDefault();

                        const newBallRef = ballsRef.current.push();

                        newBallRef.set({
                            value: ballValue,
                            key: newBallRef.key,
                        });

                        setBallValue('')
                    }}>
                        <input className={styles.input} name="range" value={ballValue} onChange={(e) => setBallValue(e.target.value)} />

                        <button type="submit" className={styles.button}>Add new ball</button>
                    </form>
                </div>

                { balls && (
                    <div className={styles.formBlock}>
                        <h1 className={styles.title}>Balls</h1>

                        <div>
                            {
                                Object.keys(balls).map((key) => (
                                    <div key={key}>
                                        {balls[key].value}
                                    </div>
                                ))
                            }
                        </div> 
                    </div>
                )}

                { users && (
                    <div className={styles.formBlock}>
                        <h1 className={styles.title}>Online users</h1>

                        <div>
                            {
                                Object.keys(users)?.map((key) => (
                                    <div key={key}>
                                        {users[key].name}
                                    </div>
                                ))
                            }
                        </div> 
                    </div>
                )}

                { bingo[0] && (
                    <div className={styles.formBlock}>
                        <h1 className={styles.title}>User with bingo</h1>

                        <div>
                            {bingo[0].name} { toDate(bingo[0].bingo) }
                            <button onClick={() => accept()}>Accept</button>
                            <button onClick={() => decline(bingo[0].key)}>Decline</button>
                        </div> 
                    </div>
                )}

                { shapes && (
                    <div className={styles.formBlock}>
                        <h1 className={styles.title}>Shapes</h1>

                        <div className={styles.shapes}>
                            { config && config.rounds && config.rounds[0].map((r, i) => (
                                <Shape key={i} shape={r} disabled={!shapes[i]} onClick={() => shapeClicked(i)} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.logs}>
                { logs && (
                    <>
                        <h1 className={styles.title}>Logs</h1>

                        <div className={styles.logsContent}>
                            {
                                Object.keys(logs)?.map((key) => (
                                    <div key={key} className={styles.logLine}>
                                        <span className={styles.logTime}>
                                            { getTime(logs[key].time) }
                                        </span>
                                        { logs[key].text }
                                    </div>
                                ))
                            }
                        </div>
                    </>
                )}
            </div>

        </main>
    );
}
