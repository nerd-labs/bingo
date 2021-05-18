import React, {useState, useEffect, useRef} from 'react';

import Shape from '../../src/components/Shape';

import styles from '../../styles/Admin.module.css'
import { firebase } from '../../src/initFirebase';
import useConfig from '../../src/hooks/useConfig';
import useLogs from '../../src/hooks/useLogs';

const db = firebase.database();

export default function Admin() {
    const [ballValue, setBallValue] = useState('');
    const [priceRanks, setPriceRanks] = useState();
    const [users, setUsers] = useState();
    const [balls, setBalls] = useState();
    const [bingo, setBingo] = useState([]);
    const [shapes, setShapes] = useState([]);

    const config = useConfig();
    const [logs, addLog] = useLogs();

    const ranksRef = useRef(db.ref('ranks'));
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
        ranksRef.current.on("value", (snapshot) => {
            setPriceRanks(snapshot.val());
        });

        return () => {
            ranksRef.current.off();
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
                        <h1 className={styles.title}>Active price rank</h1>

                        <p>
                            {config.activeRange && config.activeRange.label} 
                            {config.activeRange && config.activeRange.round && ` - Ronde ${config.activeRange.round}`} 
                        </p>

                        { config.activeRange.rank < 4 && <button className={styles.button} onClick={() => {
                            const confirmmed = confirm("Ben je zeker?");
                            if (!confirmmed) return;

                            ballsRef.current.remove();

                            if (config.activeRange.round < 3) {
                                db.ref(`ranks/${config.activeRange.rank}`).update({
                                    round: config.activeRange.round + 1,
                                });
                            } else {
                                db.ref(`ranks/${config.activeRange.rank}`).update({
                                    active: false,
                                });

                                db.ref(`ranks/${config.activeRange.rank + 1}`).update({
                                    round: config.activeRange.rank === 3 ? false : 1,
                                    active: true,
                                });
                            }
                        }}>Start nieuwe {config.activeRange.round < 3 ? 'ronde' : 'rang'}</button>
                        }
                    </div>
                )}


                <div className={styles.formBlock}>
                    <h1 className={styles.title}>Voeg nieuw nummer toe</h1>
                    <form onSubmit={(e) => {
                        e.preventDefault();

                        if (balls && Object.values(balls).some(b => b.value === ballValue)) return alert(`De bal met nummer ${ballValue} is al reeds getrokken!`);

                        const confirmmed = confirm(`Wil je nummer ${ballValue} toevoegen?`);
                        if (!confirmmed) return;

                        const newBallRef = ballsRef.current.push();
                        newBallRef.set({
                            value: ballValue,
                            key: newBallRef.key,
                        });
                        setBallValue('')
                    }}>
                        <input className={styles.input} name="range" value={ballValue} onChange={(e) => {
                            setBallValue(e.target.value)
                        }} />
                        <button type="submit" className={styles.button}>Toevoegen</button>
                    </form>
                </div>

                { balls && (
                    <div className={styles.formBlock}>
                        <h1 className={styles.title}>Ballen</h1>

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
                        <h1 className={styles.title}>Online families</h1>

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
                        <h1 className={styles.title}>Families met bingo</h1>

                        <div>
                            {bingo[0].name} { toDate(bingo[0].bingo) }
                            <button className={styles.button} onClick={() => accept()}>Accepteer</button>
                            <button className={styles.button} onClick={() => decline(bingo[0].key)}>Wijger</button>
                        </div> 
                    </div>
                )}

                { shapes && (
                    <div className={styles.formBlock}>
                        <h1 className={styles.title}>Figuren</h1>

                        <div className={styles.shapes}>
                            { config && config.levelConfig && config.levelConfig.rounds && config.levelConfig.rounds[0].map((r, i) => (
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
