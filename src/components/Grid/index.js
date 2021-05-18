import React, { useState, useEffect } from 'react';

import { firebase } from '../../../src/initFirebase';
import config from '../../config';
import Box from '../Box';

import styles from './Grid.module.css';

const db = firebase.database();

export default function Grid({ title }) {
    const [items, setItems] = useState();

    function shuffle(array) {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }

        return shuffledArray;
    }

    function getNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


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

            if (config[rang]) setItems(shuffle(config[rang].prizes));
            else setItems([]);
        });

        return () => {
            ref.off();
        };
    }, [])

    return (
        <div className={styles.grid}>
            <div className={styles.title}>
                <div className={styles.titleInner}>
                    { title }
                </div>
            </div>
            <div className={styles.gridInner}>
                {items && items.map(item => (
                    <Box
                        big={item.big}
                        key={item.name}
                        url={item.url}
                        style={{ '--delay': `${getNumberBetween(500, 2000)}ms` }}
                    >
                        {item.name}
                    </Box>
                ))}
            </div>
        </div>
    );
}

