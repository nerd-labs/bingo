import React, {useEffect, useRef, useState} from 'react';
import { firebase } from '../../initFirebase';

import styles from './Balls.module.css';

const db = firebase.database();

export default function Balls() {

    const innerRef = useRef();
    const ballsRef = useRef(db.ref('balls'));

    const [balls, setBalls] = useState([]);

    useEffect(() => {
        ballsRef.current.on("value", (snapshot) => {
            const value = snapshot.val();

            if (value) {
                setBalls(Object.values(value).reverse());
            } else setBalls([]);
        });

        return () => {
            ballsRef.current.off();
        }
    }, []);

    return (
        <div className={styles.balls}>
            <div className={styles.ballsInner} ref={innerRef}>
                { balls && balls.map((ball, index) => (
                    <div key={ball.key} className={styles.ball} style={{ '--top': `${5 + (45 * index)}px` }}>
                            {ball.value}
                        </div>
                    ))}
            </div>
        </div>
    );
}
