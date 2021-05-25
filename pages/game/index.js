import styles from './Game.module.css'

import classNames from 'classnames';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/router'
import { firebase } from '../../src/initFirebase';

import useConfig from '../../src/hooks/useConfig';
import useLogs from '../../src/hooks/useLogs';

import Balls from '../../src/components/Balls';
import Bingo from '../../src/components/Bingo';
import Button from '../../src/components/Button';
import ExtraPrice from '../../src/components/ExtraPrice';
import Grid from '../../src/components/Grid';
import Countdown from '../../src/components/Countdown';
import Shape, { SHAPES }from '../../src/components/Shape';
import useSound from '../../src/hooks/useSound';

const db = firebase.database();

export default function Home() {
    const router = useRouter()
    const [hasShape, setHasShape] = useState(false);
    const [hasBingo, setHasBingo] = useState(false);
    const [clickedBingo, setClickedBingo] = useState(false);
    const [clickedShape, setClickedShape] = useState(false);
    const [user, setUser] = useState();
    const [pickedShapes, setPickedShapes] = useState([]);

    const [playWinner] = useSound('./winnaar.mp3')
    const [playFigureWinner] = useSound('./figuur.mp3')

    const config = useConfig();
    const [, addLog] = useLogs();

    const bingoRef = useRef(db.ref('bingo'));
    const shapesRef = useRef(db.ref('shapes'));
    const ranksRef = useRef(db.ref('ranks'));
    const usersRef = useRef(db.ref('users'));

    const hasExtraPrice = useMemo(() => config.levelConfig.extraQuestion, [config.levelConfig.extraQuestion]);
    const showCountdown = useMemo(() => config.activeRange.round === 3, [config.activeRange.round]);

    const [userId] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('bingo.euri.com');
        }
    });

    useEffect(() => {
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            event.returnValue = true;
            return true;
        }, { capture: true });

        window.addEventListener('unload', (event) => {
            localStorage.removeItem('bingo.euri.com');
            usersRef.current.child(userId).remove();

            return;
        }, { capture: true });
    }, []);

    useEffect(() => {
        ranksRef.current.on('value', (snapshot) => {
            const value = snapshot.val();

            if (!value?.some((rank) => rank.active)) {
                router.push('/');
                return;
            }
        });
    }, []);

    useEffect(() => {
        bingoRef.current.on('child_added', () => {
            setHasBingo(true)
        });

        bingoRef.current.on('child_removed', (snapshot) => {
            const value = snapshot.val();

            if (snapshot.val().userId === user?.key) {
                setClickedBingo(false);
            }

            if (value.accept) playWinner();
        });

        bingoRef.current.on('value', (snapshot) => {
            const value = snapshot.val();

            if (!value) {
                setHasBingo(false);
                setClickedBingo(false);
                return;
            }

            setClickedBingo(Object.values(value).some((bingo) => bingo.userId === user?.key));
        });

        return () => {
            bingoRef.current.off();
        };
    }, [user])

    useEffect(() => {
        async function getIp() {
            const us = db.ref(`users/${userId}`);
            const snapshot = await us.once('value');
            const value = snapshot.val();


            if (!value) {
                router.push('/');
                return;
            }

            setUser(value);
        }

        getIp();
    }, []);

    useEffect(() => {
        shapesRef.current.on('child_changed', (snapshot) => {
            if (snapshot.val().accept) {
                playFigureWinner();
            }
        });

        shapesRef.current.on('value', (snapshot) => {
            const value = snapshot.val();

            if (!value) {
                setClickedShape(false);
                setHasShape(false);
                return;
            }

            setPickedShapes(value.map(s => !s.enabled));


            setClickedShape(value.some((shape) => {
                return shape.users && Object.values(shape.users).some((u) => u.userId === user?.key);
            }));

            setHasShape(value.some((shape) => shape.enabled && shape.users));
        });

        return () => {
            shapesRef.current.off();
        };
    }, [user]);

    function bingo() {
        const newBingo = bingoRef.current.push();
        newBingo.set({
            userId: userId,
            name: user.name,
            bingo: Date.now(),
            key: newBingo.key,
        });

        addLog(`${user.name} clicked bingo!`, { sound: true });
        setClickedBingo(true);
    }

    function shapeClicked(index) {
        const child = shapesRef.current.child(`${index}/users`);
        const newShape = child.push();

        newShape.set({
            userId,
            name: user.name,
            time: Date.now(),
            key: newShape.key,
        });

        addLog(`${user.name} heeft geklikt op vorm ${index + 1}`, { sound: true });
        setClickedShape(true);
    }

    if (!user) return null;

    return (
        <>
            <div className={classNames(
                styles.page,
                {
                    [styles.hasExtraPrice]: hasExtraPrice,
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

                { showCountdown && (
                    <div className={styles.countdown}>
                        <h1>Pauze</h1>
                        <Countdown /> 
                    </div>
                )}

                { (clickedBingo || clickedShape ) && (
                    <div className={styles.qrCode}>
                        Proficiat! Scan deze QR-Code en stuur jouw bingo kaart door via Whatsapp!
                        <img src="./qr.png" alt="qr code" />
                    </div>
                )}

                { !showCountdown && !clickedBingo && !clickedShape && (
                    <div className={styles.bingo}>
                        <div className={styles.bingoWrapper}>
                            <div className={styles.shapes}>
                                { !!config.activeRange && [...Array(6).keys()].map((r, i) => {
                                    const { rank, round } = config.activeRange;
                                    const shape = SHAPES[`SHAPE_${rank + 1}_${round}_${i + 1}`];

                                    return shape && <Shape key={i} shape={shape} disabled={pickedShapes[i]} onClick={() => shapeClicked(i)} />
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

            { hasShape && <Bingo secondary text={'FIGUUR'} /> }
            { hasBingo && <Bingo text={'BINGO'} /> }
        </>
    )
}
