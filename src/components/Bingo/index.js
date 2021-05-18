import React, { useRef, useState, useEffect } from 'react';

import styles from './Bingo.module.css';

function Bulbs({ bulbs }) {
    if (!bulbs) return null;

    return (
        <>
            {bulbs.map((_v, i) => (
                <div key={i} className={styles.bulb} />
            ))}
        </>
    );
}


export default function Bingo() {
    const BASE_TIME = 150;
    const TEXT = 'bingo';

    const split = TEXT.split('');

    const wrapperRef = useRef();

    const [xBulbs, setXBulbs] = useState([]);
    const [yBulbs, setYBulbs] = useState([]);

    const numberOfRetries = useRef(5);

    const config = {
        size: 10,
        spacing: 15,
        offset: 5
    };

    function getBulbs() {
        window.requestAnimationFrame(() => {
            const { clientWidth, clientHeight } = wrapperRef.current;
            const { offset, size, spacing } = config;

            const nrOfXBulbs = Math.floor(
                (clientWidth - 2 * spacing - 2 * offset) / (size + spacing)
            );
            const nrOfYBulbs = Math.floor(clientHeight / (size + spacing));

            console.log({ clientWidth, clientHeight, nrOfXBulbs, nrOfYBulbs });

            if (
                (nrOfXBulbs === 0 || nrOfYBulbs === 0) &&
                numberOfRetries.current !== 0
            ) {
                numberOfRetries.current -= 1;

                getBulbs();

                return;
            }

            setXBulbs(Array.from(Array(nrOfXBulbs).keys()).map(i => i + 1));
            setYBulbs(Array.from(Array(nrOfYBulbs).keys()).map(i => i + 1));
        });
    }

    useEffect(() => {
        const { offset, size, spacing } = config;

        wrapperRef.current.style.setProperty('--size', `${size}px`);
        wrapperRef.current.style.setProperty('--spacing', `${spacing}px`);
        wrapperRef.current.style.setProperty('--offset', `${offset}px`);
    }, [config]);

    useEffect(() => {
        getBulbs();
    }, []);

    return (
        <div className={styles.bingo}>
            <div ref={wrapperRef} className={styles.bingoInner}>
                <div className={styles.top}>
                    <Bulbs bulbs={xBulbs} />
                </div>

                <div className={styles.bottom}>
                    <Bulbs bulbs={xBulbs} />
                </div>

                <div className={styles.left}>
                    <Bulbs bulbs={yBulbs} />
                </div>

                <div className={styles.right}>
                    <Bulbs bulbs={yBulbs} />
                </div>

                <div>
                    { split.map((s, i) => (
                        <span 
                            key={i}
                            className={styles.letter}
                            style={{ animationDelay: `${BASE_TIME * i + 1}ms` }}
                        >{s}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
