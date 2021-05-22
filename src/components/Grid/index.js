import React, { useMemo } from 'react';

import useConfig from '../../hooks/useConfig';
import Box from '../Box';

import styles from './Grid.module.css';

export default function Grid() {
    const config = useConfig();

    const prizes = useMemo(() => {
        let newPrizes = [];

        if (config?.levelConfig?.prizes) {
            newPrizes = config.levelConfig.prizes;

            newPrizes = newPrizes.map((prize, index) => {
                return {
                    ...prize,
                    date: `${index}-${Date.now()}`,
                };
            });
        }

        return shuffle(newPrizes);
    }, [config.levelConfig, config.activeRange]);

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

    return (
        <div className={styles.grid}>
            <div className={styles.title}>
                <div className={styles.titleInner}>
                        {!!config.activeRange && config.activeRange.label} 
                        {!!config.activeRange && config.activeRange.rank !== 3 && ` - Ronde ${config.activeRange.round}`} 
                </div>
            </div>
            <div className={styles.gridInner}>
                {!!prizes && prizes.map((item, i) => (
                    <Box
                        big={item.big}
                        key={`${item.date}`}
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

