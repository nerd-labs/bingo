import styles from '../styles/Home.module.css'
import {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/router'
import { firebase } from '../src/initFirebase';

import Balls from '../src/components/Balls';
import Button from '../src/components/Button';
import ExtraPrice from '../src/components/ExtraPrice';
import Grid from '../src/components/Grid';

const db = firebase.database();

export default function Home() {
    const router = useRouter()
    const [range, setRange] = useState();
    const [balls, setBalls] = useState([]);
    const [user, setUser] = useState();

    const initNewGame = useRef(true);

    useEffect(() => {
        async function getIp() {
            const response = await fetch('https://api.ipify.org/?format=json');
            const { ip } = await response.json();

            db.ref('users').orderByChild('ip').equalTo(ip).on('value', (snapshot) => {
                const user = snapshot.val();

                if (!user) {
                    router.push('welcome');
                    return;
                }

                setUser(Object.values(user)[0]);
            });
        }
        
        getIp();
    }, []);

    useEffect(() => {
        const ref = db.ref('priceRanks');

        ref.on("value", (snapshot) => {
            const activeRange = Object.entries(snapshot.val()).find(([key, obj]) => obj.active && key);
            setRange(activeRange ? activeRange[1] : null);

            initNewGame.current = true;
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

    if (!user) return null;

    return (
        <>
            <div className={styles.page}>
                <h1 className={styles.fam}>Welkom: { user.name }</h1>
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
                    <Button text='BINGO' />
                </div>
                <div className={styles.extraPrice}>
                    <ExtraPrice />
                </div>
            </div>
        </>
    )
}

