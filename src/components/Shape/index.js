import React from 'react';
import classNames from 'classnames';

import styles from './Shape.module.css';

export const SHAPES = {
    E: [1, 2, 3, 4, 5, 6, 11, 12, 13, 16, 21, 22, 23, 24, 25],
    U: [1, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25],
    R: [1, 2, 3, 4, 5, 6, 11, 12, 13, 16, 21, 22, 23, 24, 25],
    I: [1, 2, 3, 4, 5, 6, 11, 12, 13, 16, 21, 22, 23, 24, 25],
    LOGO: [1, 2, 4, 5, 6, 10, 13, 16, 20, 21, 22, 24, 25],
}

export default function Shape({ shape }) {
    const bulls = [...Array(25)].map((_v, i) => i + 1);

    return (
        <div className={styles.shape}>
            { bulls.map((i) => (
                <span 
                    key={i} 
                    className={classNames(styles.bullet, { [styles.active]: shape.includes(i)})}
                ></span>
            ))}
        </div>
    );
}
