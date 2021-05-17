import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { firebase } from '../src/initFirebase';

import Balls from '../src/components/Balls';
import Button from '../src/components/Button';
import ExtraPrice from '../src/components/ExtraPrice';
import Grid from '../src/components/Grid';
import Shape, { SHAPES } from '../src/components/Shape';

const db = firebase.database();

export default function Home() {
    const router = useRouter()
    const [range, setRange] = useState();
    const [balls, setBalls] = useState([]);
    const [user, setUser] = useState();

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
                    <div className={styles.bingoWrapper}>
                        <div className={styles.shapes}>
                            <Shape shape={SHAPES.LOGO} />
                            <Shape shape={SHAPES.E} />
                            <Shape shape={SHAPES.U} />
                            <Shape shape={SHAPES.R} />
                            <Shape shape={SHAPES.I} />
                        </div>
                        <Button text='BINGO' />
                    </div>
                </div>
                <div className={styles.extraPrice}>
                    <ExtraPrice />
                </div>
            </div>
        </>
    )
}

