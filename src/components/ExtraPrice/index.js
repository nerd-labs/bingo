import React from 'react';

import useConfig from '../../hooks/useConfig';

import styles from './ExtraPrice.module.css';

export default function ExtraPrice() {
    const config = useConfig();

    if (!config || !config.levelConfig || !config.levelConfig.extraQuestion) return null;

    return (
        <div className={styles.grid}>
            <div className={styles.title}>
                <div className={styles.titleInner}>
                    Doe prijs
                </div>
            </div>
            <div className={styles.gridInner}>
                { config.levelConfig.extraQuestion }
            </div>
        </div>
    );
}

