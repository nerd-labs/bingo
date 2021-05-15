import React from 'react';

import styles from './ExtraPrice.module.css';

export default function ExtraPrice() {
    return (
        <div className={styles.grid}>
            <div className={styles.title}>
                <div className={styles.titleInner}>
                    Doe prijs
                </div>
            </div>
            <div className={styles.gridInner}>
                PRICE
            </div>
        </div>
    );
}

