import React from 'react';

import styles from './Balls.module.css';

export default function Balls({ balls }) {
    return (
        <div className={styles.balls}>
            <div className={styles.ballsInner}>
                { balls && Object.keys(balls).map((key) => (
                    <div key={key} className={styles.ball}>{balls[key].value}</div>
                ))}
            </div>
        </div>
    );
}
