import React, {useState, useEffect, useRef} from 'react';

import styles from '../../styles/Admin.module.css'
import { firebase } from '../../src/initFirebase';

const db = firebase.database();

export default function Admin() {
    const [value, setValue] = useState('');
    const [ballValue, setBallValue] = useState('');
    const [priceRanks, setPriceRanks] = useState();
    const [users, setUsers] = useState();
    const [balls, setBalls] = useState();
    const [bingo, setBingo] = useState([]);

    const priceRanksRef = useRef(db.ref('priceRanks'));
    const usersRef = useRef(db.ref('users'));
    const ballsRef = useRef(db.ref('balls'));
    const bingoRef = useRef(db.ref('bingo'));

    function toDate(timestamp) {
        return new Date(timestamp).toLocaleString();
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

    return (
        <main className={styles.admin}>
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

            { bingo && bingo.length && (
                <div className={styles.formBlock}>
                    <h1 className={styles.title}>User with bingo</h1>

                    <div>
                        {bingo[0].name} { toDate(bingo[0].bingo) }
                    </div> 
                </div>
            )}
        </main>
    );
}
