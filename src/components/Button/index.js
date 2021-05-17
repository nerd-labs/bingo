import React from 'react';
import classNames from 'classnames';

import styles from './Button.module.css';

export default function Button({ text, onClick, type, className }) {
    return (
        <button className={classNames(className, styles.button)} onClick={onClick} type={type}>
            { text }
        </button>
    );
}
