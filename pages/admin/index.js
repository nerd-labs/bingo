import React, {useState, useEffect, useRef} from 'react';

import styles from '../../styles/Admin.module.css'
import { firebase } from '../../src/initFirebase';

const db = firebase.database();

export default function PriceRank() {
    const [value, setValue] = useState();
    const [ballValue, setBallValue] = useState();
    const [priceRanks, setPriceRanks] = useState();

    const priceRanksRef = useRef(db.ref('priceRanks'));
    const ballsRef = useRef(db.ref('balls'));

    useEffect(() => {
        priceRanksRef.current.on("value", (snapshot) => {
            setPriceRanks(snapshot.val());
        });

        return () => {
            priceRanksRef.current.off();
        };
    }, [])

    return (
        <main className={styles.admin}>
            <div className={styles.formBlock}>
                <h1 className={styles.title}>Add new price rank</h1>
                <form onSubmit={(e) => {
                    e.preventDefault();

                    const newPriceRankRef = priceRanksRef.current.push();

                    newPriceRankRef.set({
                        name: value,
                        active: false,
                    });

                    setValue(null);
                }}>
                    <input className={styles.input} name="rank" value={value} onChange={(e) => setValue(e.target.value)} />

                    <button type="submit" className={styles.button}>Add new price rank</button>
                </form>
            </div>

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

                    setBallValue(null)
                }}>
                    <input className={styles.input} name="range" value={ballValue} onChange={(e) => setBallValue(e.target.value)} />

                    <button type="submit" className={styles.button}>Add new ball</button>
                </form>
            </div>
        </main>
    );
}
