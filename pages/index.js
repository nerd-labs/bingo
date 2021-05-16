import styles from '../styles/Home.module.css'
import {useEffect, useState} from 'react';
import { firebase } from '../src/initFirebase';

import Balls from '../src/components/Balls';
import Bingo from '../src/components/Bingo';
import ExtraPrice from '../src/components/ExtraPrice';
import Grid from '../src/components/Grid';

const db = firebase.database();

export default function Home() {
    const [range, setRange] = useState();
    const [balls, setBalls] = useState([]);

    useEffect(() => {
        const ref = db.ref('priceRanks');

        ref.on("value", (snapshot) => {
            const activeRange = Object.entries(snapshot.val()).find(([key, obj]) => obj.active && key);
            setRange(activeRange ? activeRange[1] : null);
        });

        return () => {
            ref.off();
        };
    }, [])

    useEffect(() => {
        const ref = db.ref('balls');

        ref.on("value", (snapshot) => {
            setBalls(snapshot.val());
        });

        return () => {
            ref.off();
        };
    }, [])

    return (
        <>
            <div className={styles.page}>
                <div className={styles.grid}>
                    <Grid title={range ? range.name : 'No active game'} />
                </div>
                <div className={styles.balls}>
                    <Balls balls={balls} />
                </div>
                <div className={styles.logo}>
                    logo
                </div>
                <div className={styles.bingo}>
                    <Bingo />
                </div>
                <div className={styles.extraPrice}>
                    <ExtraPrice />
                </div>
            </div>
        </>
    )
}

