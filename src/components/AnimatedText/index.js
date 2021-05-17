import React from 'react';

import styles from './AnimatedText.module.css';

export default function AnimatedText({ className, text }) {
    const BASE_TIME = 150;

    const split = text.split('');

    return (
        <div className={className}>
            { split.map((s, i) => (
                <span 
                    key={i}
                    className={styles.letter}
                    style={{ animationDelay: `${BASE_TIME * i + 1}ms` }}
                >{s}</span>
            ))}
        </div>
    );
}
