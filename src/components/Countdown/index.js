import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { firebase } from '../../initFirebase';

import useSound from '../../hooks/useSound';

import styles from './Countdown.module.css';

function getTime(date, currentDate) {
    const cDate = currentDate || new Date();
    const diffTime = Math.max((date.getTime() - cDate.getTime()), 0);

    const minutes = Math.floor(diffTime / 60000);
    const seconds = Math.floor((diffTime % 60000) / 1000);

    return {
        minutes,
        seconds,
    };
}

function doubleDigit(value) {
    const valueString = value.toString();
    const valuesArray = valueString.split('');

    if (valuesArray.length === 1) valuesArray.unshift('0');

    return valuesArray;
}

function Number({ value }) {
    return (
        <div className={styles.number}>
            <div className={styles.numberInner}>
                { value }
            </div>
        </div>
    );
}

const db = firebase.database();

export default function Countdown({ onEnd }) {
    const countdownRef = useRef(db.ref('countdown'));

    const FLASH_TIME = 10;

    const [drawTime, setDrawTime] = useState();
    const [time, setTime] = useState();
    const [isFlashing, setIsFlashing] = useState(false);

    const [playCountdown] = useSound('/countdown.mp3');

    const nextDrawDate = useRef();
    const interval = useRef();

    useEffect(() => {
        countdownRef.current.on('value', (snapshot) => {
            setDrawTime(snapshot.val());
        });

        return () => countdownRef.current.off();
    }, []);

    useEffect(() => {
        if (!drawTime) return undefined;

        // calculate the next full second
        const now = Date.now();
        const nextSecond = Math.ceil(Date.now() / 1000) * 1000;
        const millisecondsDiff = nextSecond - now;

        // wait for the next second to start the countdown
        const correctSecondsTimeout = setTimeout(() => {
            nextDrawDate.current = new Date(drawTime);
            setTime(getTime(nextDrawDate.current));

            interval.current = window.setInterval(() => {
                if (nextDrawDate.current) setTime(getTime(nextDrawDate.current));
            }, 1000);
        }, millisecondsDiff);

        return () => {
            window.clearTimeout(correctSecondsTimeout);
            window.clearInterval(interval.current);
        };
    }, [drawTime]);

    useEffect(() => {
        if (!time || time.minutes !== 0) return;

        if (time.seconds === 0) {
            if (onEnd) onEnd();
            setIsFlashing(false);
            window.clearInterval(interval.current);
            return;
        }

        if (!isFlashing && time.seconds <= FLASH_TIME) {
            if (time.seconds === FLASH_TIME) playCountdown();
            setIsFlashing(true);
        }
    }, [time]);

    if (!time) return null;

    return (
        <div
            className={classNames(
                styles.countdown,
                { [styles.flash]: isFlashing },
            )}
        >
            <Number value={doubleDigit(time.minutes)[0]} />
            <Number value={doubleDigit(time.minutes)[1]} />
            <div>:</div>
            <Number value={doubleDigit(time.seconds)[0]} />
            <Number value={doubleDigit(time.seconds)[1]} />
        </div>
    );
}
