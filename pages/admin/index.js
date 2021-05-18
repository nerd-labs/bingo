import React, {useState, useEffect, useRef} from 'react';

import styles from '../../styles/Admin.module.css'
import { firebase } from '../../src/initFirebase';

import useConfig from '../../src/hooks/useConfig';

const db = firebase.database();

export default function Admin() {
    const [ballValue, setBallValue] = useState('');
    const [priceRanks, setPriceRanks] = useState();
    const [users, setUsers] = useState();
    const [balls, setBalls] = useState();
    const [bingo, setBingo] = useState([]);

    const config = useConfig();

    const ranksRef = useRef(db.ref('ranks'));
    const usersRef = useRef(db.ref('users'));
    const ballsRef = useRef(db.ref('balls'));
    const bingoRef = useRef(db.ref('bingo'));

    function toDate(timestamp) {
        return new Date(timestamp).toLocaleString();
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

    function accept() {
        bingoRef.current.remove();
    }

    function decline(key) {
        const bingoKey = db.ref(`bingo/${key}`);
        bingoKey.remove();
    }

    return (
        <main className={styles.admin}>
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
                    }}>Start new {config.activeRange.round < 3 ? 'round' : 'range'}</button>
                    }
                </div>
            )}


            <div className={styles.formBlock}>
                <h1 className={styles.title}> Add new ball</h1>
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
                        <button className={styles.button} onClick={() => accept()}>Accept</button>
                        <button className={styles.button} onClick={() => decline(bingo[0].key)}>Decline</button>
                    </div> 
                </div>
            )}
        </main>
    );
}
