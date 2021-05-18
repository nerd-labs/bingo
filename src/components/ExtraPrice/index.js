import React, { useEffect, useState } from 'react';
import { firebase } from '../../../src/initFirebase';

import config from '../../config';

import styles from './ExtraPrice.module.css';

const db = firebase.database();

export default function ExtraPrice() {
    const [range, setRange] = useState();

    useEffect(() => {
        const ref = db.ref('priceRanks');

        ref.on("value", (snapshot) => {
            const activeRange = Object.values(snapshot.val()).find((obj) => obj.active);

            let rang = null;

            if (activeRange) {
                switch(activeRange.name) {
                    case 'Rang 1':
                        rang = 'level1';
                        break;
                    case 'Rang 2':
                        rang = 'level2';
                        break;
                    case 'Rang 3':
                        rang = 'level3';
                        break;
                    case 'Super Jackpot':
                        rang = 'superJackpot';
                        break;
                    default:
                        break;
                }
            }

            setRange(rang);
        });

        return () => {
            ref.off();
        };
    }, [])

    if (!range || !config[range] || !config[range].extraQuestion) return null;

    return (
        <div className={styles.grid}>
            <div className={styles.title}>
                <div className={styles.titleInner}>
                    Doe prijs
                </div>
            </div>
            <div className={styles.gridInner}>
                { config[range].extraQuestion }
            </div>
        </div>
    );
}

