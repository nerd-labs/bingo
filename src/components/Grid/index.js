import React, { useState, useEffect } from 'react';

import config from '../../config';
import Box from '../Box';

import styles from './Grid.module.css';

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
        // shuffle ? 
        setItems(shuffle(config.superJackpot));
    }, []);

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
                        style={{ '--delay': `${getNumberBetween(500, 2000)}ms` }}
                    >
                        {item.name}
                    </Box>
                ))}
            </div>
        </div>
    );
}

