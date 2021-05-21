import React, {useState, useEffect, useRef} from 'react';
import classNames from 'classnames';

import Shape, { SHAPES } from '../../src/components/Shape';

import styles from '../../styles/Admin.module.css'
import { firebase } from '../../src/initFirebase';
import useConfig from '../../src/hooks/useConfig';
import useLogs from '../../src/hooks/useLogs';

const db = firebase.database();

export default function Admin() {
    const MAX_RANKS = 4;
    const MAX_ROUNDS = 3;

    const [ballValue, setBallValue] = useState('');
    const [priceRanks, setPriceRanks] = useState();
    const [users, setUsers] = useState([]);
    const [balls, setBalls] = useState([]);
    const [bingo, setBingo] = useState([]);
    const [shapes, setShapes] = useState([]);

    const config = useConfig();
    const [logs, addLog] = useLogs();

    const ranksRef = useRef(db.ref('ranks'));
    const usersRef = useRef(db.ref('users'));
    const ballsRef = useRef(db.ref('balls'));
    const bingoRef = useRef(db.ref('bingo'));
    const shapesRef = useRef(db.ref('shapess'));

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
            const value = snapshot.val();
            if (value) setUsers(Object.values(value));
        });

        return () => {
            usersRef.current.off();
        };
    }, [])

    useEffect(() => {
        ballsRef.current.on("value", (snapshot) => {
            const value = snapshot.val();
            if (value) setBalls(Object.values(value).sort((a, b) => a.value - b.value));
        });

        return () => {
            ballsRef.current.off();
        };
    }, [])

    useEffect(() => {
        shapesRef.current.on("value", (snapshot) => {
            const value = snapshot.val();
            if (value) {
                setShapes(value.map(v => ({
                    ...v,
                    users: v.users ? Object.values(v.users).sort((a, b) => a.time - b.time) : undefined,
                })));
            } else {
                setShapes([]);
            }
        });

        return () => {
            shapesRef.current.off();
        };
    }, [])

    function accept(bingo) {
        bingoRef.current.remove();

        addLog(`Admin heeft de bingo van ${bingo.name} aanvaard!`);
    }

    function decline(bingo) {
        const bingoKey = db.ref(`bingo/${bingo.key}`);
        bingoKey.remove();

        addLog(`Admin heeft de bingo van ${bingo.name} geweigerd`);
    }

    function acceptShape(index, user) {
        shapesRef.current.child(index).set({
            enabled: false,
        });

        addLog(`Admin heeft vorm ${index + 1} van ${user.name} aanvaard!`);
    }

    function declineShape(index, user) {
        const userKey = shapesRef.current.child(`${index}/users/${user.key}`);
        userKey.remove();

        addLog(`Admin heeft vorm ${index + 1} van ${user.name} geweigerd`);
    }

    function submitNumber(e) {
        e.preventDefault();

        if (balls && Object.values(balls).some(b => b.value === ballValue)) {
            return alert(`De bal met nummer ${ballValue} is al reeds getrokken!`);
        }

        const confirmed = confirm(`Wil je nummer ${ballValue} toevoegen?`);
        if (!confirmed) return;

        const newBallRef = ballsRef.current.push();
        newBallRef.set({
            value: ballValue,
            key: newBallRef.key,
        });

        setBallValue('')
    }

    function clearShapes() {
        shapesRef.current.remove();

        const newShapes = [];

        for (let i = 0; i < 6; i++) {
            newShapes.push({
                enabled: true,
            });
        }

        shapesRef.current.set(newShapes);
    }

    function changeActiveRound() {
        const confirmed = confirm('Ben je zeker?');
        if (!confirmed) return;

        ballsRef.current.remove();
        clearShapes();

        if (config.activeRange.round < 3) {
            db.ref(`ranks/${config.activeRange.rank}`).update({
                round: config.activeRange.round + 1,
            });
        } else {
            db.ref(`ranks/${config.activeRange.rank}`).update({
                active: false,
            });

            db.ref(`ranks/${config.activeRange.rank + 1}`).update({
                round: 1,
                active: true,
            });
        }
    }

    return (
        <main className={styles.admin}>
            <div className={styles.formBlock}>
                <h1 className={styles.title}>Families met bingo</h1>

                { bingo[0] && (
                    <div>
                        <p> {bingo[0].name} - { toDate(bingo[0].bingo) }</p>
                        <button className={styles.button} onClick={() => accept(bingo[0])}>Correct</button>
                        <button className={classNames(styles.button, styles.buttonDecline)} onClick={() => decline(bingo[0])}>Foutief</button>
                    </div> 
                )}
            </div>

            <div className={styles.formBlock}>
                <h1 className={styles.title}>Figuren</h1>

                { shapes.length && (
                    <div className={styles.shapes}>
                        { config?.activeRange && [...Array(6).keys()].map((r, i) => (
                            <>
                                <Shape 
                                    key={i} 
                                    shape={SHAPES[`SHAPE_${config.activeRange.rank}_${config.activeRange.round}_${i + 1}`]} 
                                    disabled={shapes[i].enabled} 
                                />

                                <div>
                                    { shapes[i].users && 
                                    <>
                                        <div> {shapes[i].users[0].name} - { toDate(shapes[i].users[0].time) }</div>
                                        <button 
                                            className={styles.button} 
                                            onClick={() => acceptShape(i, shapes[i].users[0])}
                                        >
                                            Correct
                                        </button>
                                        <button 
                                            className={classNames(styles.button, styles.buttonDecline)} 
                                            onClick={() => declineShape(i, shapes[i].users[0])}
                                        >
                                            Foutief
                                        </button>
                                    </>
                                    }
                                </div>
                            </>
                        ))}
                    </div>
                )}
            </div>

            <div className={classNames(styles.formBlock, styles.ranks)}>
                <h1 className={styles.title}>Actieve rang / ronde</h1>

                { priceRanks && (
                    <>
                        <p className={styles.activeRound}>
                            {config.activeRange && config.activeRange.label} 
                            {config.activeRange && config.activeRange.round && ` - Ronde ${config.activeRange.round}`} 
                        </p>

                        { config.activeRange.rank < MAX_RANKS && (
                            <button 
                                className={styles.button} 
                                onClick={changeActiveRound}
                            >
                                Start nieuwe {config.activeRange.round < MAX_ROUNDS ? 'ronde' : 'rang'}
                            </button>
                        )}
                    </>
                )}
            </div>

            <div className={styles.balls}>
                <div className={styles.formBlock}>
                    <h1 className={styles.title}>Getrokken Ballen</h1>

                    <form onSubmit={submitNumber}>
                        <input 
                            className={styles.input} 
                            name="range" 
                            value={ballValue} 
                            onChange={(e) => setBallValue(e.target.value)} 
                        />

                        <button type="submit" className={styles.button}>Toevoegen</button>
                    </form>

                    <div className={styles.drawBalls}>
                        {
                            balls.map((ball) => (
                                <div key={ball.key}>
                                    {ball.value}
                                </div>
                            ))
                        }
                    </div> 
                </div>
            </div>

            <div className={styles.users}>
                <h1 className={styles.title}>Online families ({users.length})</h1>

                <div className={styles.gridContent}>
                    {
                        users.map((user) => (
                            <div key={user.key} className={styles.line}>
                                {user.name}
                            </div>
                        ))
                    }
                </div> 
            </div>

            <div className={styles.logs}>
                <h1 className={styles.title}>Logs</h1>

                <div className={styles.gridContent}>
                    {
                        logs.map((log) => (
                            <div key={log.key} className={styles.line}>
                                <span className={styles.logTime}>
                                    { getTime(log.time) }
                                </span>
                                { log.text }
                            </div>
                        ))
                    }
                </div>
            </div>
        </main>
    );
}
