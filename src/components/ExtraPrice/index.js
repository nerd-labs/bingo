import React from 'react';

import useConfig from '../../hooks/useConfig';

import styles from './ExtraPrice.module.css';

export default function ExtraPrice({ text }) {
    return (
        <div className={styles.grid}>
            <div className={styles.title}>
                <div className={styles.titleInner}>
                    Doe prijs
                </div>
            </div>
            <div className={styles.gridInner}>
                { text }
            </div>
        </div>
    );
}

