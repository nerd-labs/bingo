import React from 'react';
import classNames from 'classnames';

import styles from './Box.module.css';

export default function Box({ url, big, children, style }) {
    return (
        <a
            href={url}
            target="_blank"
            style={style}
            className={classNames(styles.outer, { [styles.big]: big })}
        >
            <div className={styles.inner}>{children}</div>
            {big && <span className={styles.bigText}>Big prize!</span>}
        </a>
    );
}
