import React from 'react';
import classNames from 'classnames';

import styles from './Shape.module.css';

export const SHAPES = {
    SHAPE_1_1_1: [1, 5, 21, 25],
    SHAPE_1_1_2: [7, 9, 17, 19],
    SHAPE_1_1_3: [11, 12, 14, 15],
    SHAPE_1_1_4: [3, 8, 18, 23],
    SHAPE_1_1_5: [1, 7, 19, 25],
    SHAPE_1_1_6: [1, 2, 6, 7],

    SHAPE_1_2_1: [3, 11, 15, 23],
    SHAPE_1_2_2: [5, 9, 17, 21],
    SHAPE_1_2_3: [2, 4, 22, 24],
    SHAPE_1_2_4: [6, 10, 16, 20],
    SHAPE_1_2_5: [3, 8, 18, 23],
    SHAPE_1_2_6: [19, 20, 24, 25],

    SHAPE_2_1_1: [11, 12, 14, 15],
    SHAPE_2_1_2: [1, 6, 11, 16, 21],
    SHAPE_2_1_3: [5, 10, 15, 20, 25],
    SHAPE_2_1_4: [2, 4, 7, 9, 18, 23],
    SHAPE_2_1_5: [8, 12, 14, 18],
    SHAPE_2_1_6: [16, 17, 21, 22],

    SHAPE_2_2_1: [3, 8, 18, 23],
    SHAPE_2_2_2: [6, 7, 19, 20],
    SHAPE_2_2_3: [9, 10, 16, 17],
    SHAPE_2_2_4: [2, 7, 19, 24],
    SHAPE_2_2_5: [4, 9, 17, 22],
    SHAPE_2_2_6: [4, 5, 9, 10],

    SHAPE_3_1_1: [8, 9, 14, 21],
    SHAPE_3_1_2: [5, 12, 17, 18],
    SHAPE_3_1_3: [1, 5, 21, 25],
    SHAPE_3_1_4: [3, 11, 15, 23],
    SHAPE_3_1_5: [2, 3, 23, 24],
    SHAPE_3_1_6: [10, 11, 15, 16],

    SHAPE_3_2_1: [2, 4, 7, 9, 18, 23],
    SHAPE_3_2_2: [10, 11, 15, 20],
    SHAPE_3_2_3: [16, 17, 21, 22],
    SHAPE_3_2_4: [19, 20, 24, 25],
    SHAPE_3_2_5: [3, 8, 12, 14],
    SHAPE_3_2_6: [1, 7, 19, 25],

    SHAPE_4_1_1: [1, 7, 19, 25],
    SHAPE_4_1_2: [5, 9, 17, 21],
    SHAPE_4_1_3: [3, 8, 18, 23],
    SHAPE_4_1_4: [11, 12, 14, 15],
    SHAPE_4_1_5: [6, 7, 19, 20],
    SHAPE_4_1_6: [9, 10, 16, 17],
}

export default function Shape({ disabled, shape, onClick }) {
    const bulls = [...Array(25)].map((_v, i) => i + 1);

    function onShapeClick() {
        if (!disabled) onClick();
    }

    console.log(shape);

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
