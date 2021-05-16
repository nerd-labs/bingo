import React from 'react';

import styles from './Button.module.css';

export default function Button({ text, onClick, type, className }) {
    return (
        <button className={`${className} ${styles.button}`} onClick={onClick} type={type}>
            { text }
        </button>
    );
}
