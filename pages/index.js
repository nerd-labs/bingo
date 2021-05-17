import styles from '../styles/Home.module.css'
import {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/router'
import { firebase } from '../src/initFirebase';

import Balls from '../src/components/Balls';
import AnimatedText from '../src/components/AnimatedText';
import Button from '../src/components/Button';
import ExtraPrice from '../src/components/ExtraPrice';
import Grid from '../src/components/Grid';

const db = firebase.database();

export default function Home() {
    const router = useRouter()
    const [range, setRange] = useState();
    const [balls, setBalls] = useState([]);
    const [hasBingo, setHasBingo] = useState(false);
    const [user, setUser] = useState();

    const usersRef = useRef(db.ref('users'));
    const bingoRef = useRef(db.ref('bingo'));

    const [userId] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('bingo.euri.com');
        }
    });

    useEffect(() => {
        bingoRef.current.on('child_added', () => {
            setHasBingo(true);
        });

        return () => {
            bingoRef.current.off();
        };
    }, [])

    useEffect(() => {
        async function getIp() {
            const us = db.ref(`users/${userId}`);
            const snapshot = await us.once('value');
            const value = snapshot.val();


            if (!value) {
                router.push('/welcome');
                return;
            }

            setUser(value);
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

    function bingo() {
        const newBingo = bingoRef.current.push();
        newBingo.set({
            userId: userId,
            name: user.name,
            bingo: Date.now(),
            key: newBingo.key,
        });
    }

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
                    <img src="/logo.png" className={styles.logoImage} alt="logo" />

                    { hasBingo && <h1>BINGO!!!!</h1> }
                </div>
                <div className={styles.bingo}>
                    <Button text='BINGO' onClick={() => bingo() } />
                </div>
                <div className={styles.extraPrice}>
                    <ExtraPrice />
                </div>
            </div>

            <AnimatedText className={styles.bingoAnimation} text="bingo" />
        </>
    )
}
