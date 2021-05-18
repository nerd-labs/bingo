import React from 'react';
import classNames from 'classnames';

import styles from './Shape.module.css';

export const SHAPES = {
    A: [2, 3, 4, 6, 10, 11, 12, 14, 15, 16, 20, 21, 25],
    B: [2, 3, 4, 7, 10, 12, 14, 17, 20, 22, 23, 24],
    C: [1, 2, 3, 4, 5, 6, 11, 16, 21, 22, 23, 24, 25],
    E: [1, 2, 3, 4, 6, 11, 12, 16, 21, 22, 23, 24],
    G: [1, 2, 3, 4, 5, 6, 11, 14, 15, 16, 20, 21, 22, 23, 24, 25],
    I: [1, 2, 3, 4, 5, 8, 18, 21, 22, 23, 24, 25],
    J: [2, 3, 4, 5, 10, 15, 17, 20, 23, 24],
    M: [1, 2, 4, 5, 6, 8, 10, 11, 15, 16, 20, 21, 25],
    N: [1, 5, 6, 7, 10, 11, 15, 16, 19, 20, 21, 25],
    O: [2, 3, 4, 6, 10, 11, 15, 16, 20, 22, 23, 24],
    P: [1, 2, 3, 4, 5, 6, 10, 11, 12, 14, 15, 16, 21],
    R: [1, 2, 3, 6, 9, 11, 12, 16, 18, 21, 24],
    S: [1, 2, 3, 4, 5, 6, 11, 12, 14, 15, 20, 21, 22, 23, 24, 25],
    T: [1, 2, 3, 4, 5, 8, 18, 23],
    U: [1, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25],
    V: [1, 5, 6, 10, 11, 15, 17, 19, 23],
    PLUS: [3, 8, 11, 12, 14, 15, 18, 23],
    LOGO: [1, 2, 4, 5, 6, 10, 16, 20, 21, 22, 24, 25],
}

export default function Shape({ disabled, shape, onClick }) {
    const bulls = [...Array(25)].map((_v, i) => i + 1);

    function onShapeClick() {
        if (!disabled) onClick();
    }

    return (
        <div className={classNames(styles.shape, { [styles.disabled]: disabled })} onClick={onShapeClick}>
            { bulls.map((i) => (
                <span 
                    key={i} 
                    className={classNames(styles.bullet, { [styles.active]: shape.includes(i)})}
                ></span>
            ))}
        </div>
    );
}
