import styles from '../styles/Home.module.css'
import {useEffect, useState} from 'react';
import { firebase } from '../src/initFirebase';

const db = firebase.database();

export default function Home() {
    const [range, setRange] = useState();
    const [balls, setBalls] = useState([]);

    useEffect(() => {
        const ref = db.ref('ranges');

        ref.on("value", (snapshot) => {
            const activeRange = Object.entries(snapshot.val()).find(([key, obj]) => obj.active && key);
            setRange(activeRange ? activeRange[0] : null);
        });

        return () => {
            ref.off();
        };
    }, [])

    useEffect(() => {
        const ref = db.ref('balls');

        ref.on("value", (snapshot) => {
            setBalls(snapshot.val());
        });

        return () => {
            ref.off();
        };
    }, [])

    console.log(Object.values(balls));

    return (
        <div className={styles.container}>

            { !range 
                ? <p>No active range is set</p>
                : <p>Active range {range}</p>
            }

            <h1>Balls</h1>
            { Object.values(balls).map((ball) => (
                <p>{ball.value}</p>
            ))}

        </div>
    )
}

