import styles from '../styles/Home.module.css'
import classNames from 'classnames';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/router'
import { firebase } from '../src/initFirebase';

import useConfig from '../src/hooks/useConfig';
import useLogs from '../src/hooks/useLogs';

import Balls from '../src/components/Balls';
import Bingo from '../src/components/Bingo';
import Button from '../src/components/Button';
import ExtraPrice from '../src/components/ExtraPrice';
import Grid from '../src/components/Grid';
import Shape, { SHAPES }from '../src/components/Shape';

const db = firebase.database();

export default function Home() {
    const router = useRouter()
    const [hasBingo, setHasBingo] = useState(false);
    const [clickedBingo, setClickedBingo] = useState(false);
    const [user, setUser] = useState();
    const [pickedShapes, setPickedShapes] = useState([]);

    const config = useConfig();
    const [, addLog] = useLogs();

    const bingoRef = useRef(db.ref('bingo'));
    const shapesRef = useRef(db.ref('shapes'));

    const hasExtraPrice = useMemo(() => config.levelConfig.extraQuestion, [config.levelConfig.extraQuestion]);

    const [userId] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('bingo.euri.com');
        }
    });

    useEffect(() => {
        bingoRef.current.on('child_added', () => {
            setHasBingo(true);
        });

        bingoRef.current.on('child_removed', (snapshot) => {
            if (snapshot.val().id === user.key) {
                setClickedBingo(false);
            }
        });

        bingoRef.current.on('value', (snapshot) => {
            if (!snapshot.val()) {
                setHasBingo(false);
                setClickedBingo(false);
            }
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
        shapesRef.current.on('value', (snapshot) => {
            setPickedShapes(snapshot.val());
        });

        return () => {
            shapesRef.current.off();
        };
    }, []);

    function bingo() {
        const newBingo = bingoRef.current.push();
        newBingo.set({
            userId: userId,
            name: user.name,
            bingo: Date.now(),
            key: newBingo.key,
        });

        addLog(`${user.name} clicked bingo!`);
        setClickedBingo(true);
    }

    function shapeClicked(index) {
        shapesRef.current.update({
            [index]: true
        });

        addLog(`${user.name} clicked shape ${index + 1}`);
    }

    if (!user) return null;

    return (
        <>
            <div className={classNames(
                styles.page,
                {
                    [styles.hasExtraPrice]: hasExtraPrice,
                    [styles.clickedBingo]: clickedBingo,
                }
            )}>
                <h1 className={styles.fam}>Welkom: { user.name }</h1>
                <div className={styles.grid}>
                    <Grid />
                </div>
                <div className={styles.balls}>
                    <Balls />
                </div>
                <div className={styles.logo}>
                    <img src="/logo.png" className={styles.logoImage} alt="logo" />
                </div>
                <div className={styles.qrCode}>
                    Proficiat! Scan deze QR-Code en stuur jouw bingo kaart door via Whatsapp!
                    <img src="./qr.png" alt="qr code" />
                </div>


                { !clickedBingo && (
                    <div className={styles.bingo}>
                        <div className={styles.bingoWrapper}>
                            <div className={styles.shapes}>
                                { config.activeRange.rank && [...Array(6).keys()].map((r, i) => {
                                    const { rank, round } = config.activeRange;
                                    const shape = SHAPES[`SHAPE_${rank}_${round}_${i + 1}`];

                                    return shape &&<Shape key={i} shape={shape} disabled={pickedShapes[i]} onClick={() => shapeClicked(i)} />
                                })}
                            </div>
                            <Button text='BINGO' onClick={() => bingo() } />
                        </div>
                    </div>
                )}

                <div className={styles.extraPrice}>
                    { hasExtraPrice && (
                        <ExtraPrice text={config.levelConfig.extraQuestion} /> 
                    )}
                </div>
            </div>

            { hasBingo && <Bingo /> }
        </>
    )
}
