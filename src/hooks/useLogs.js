import { useRef, useEffect, useState } from 'react';

import { firebase } from '../initFirebase';

import useSound from './useSound';

const db = firebase.database();

export default function useConfig() {
    const [logs, setLogs] = useState([]);
    const [playSound] = useSound('/deurbel.wav');

    const logsRef = useRef(db.ref('logs'));

    function addLog(text, config) {
        const newLog = logsRef.current.push();

        newLog.set({
            text,
            highlight: !!config?.highlight,
            sound: !!config?.sound,
            time: Date.now(),
            key: newLog.key,
        });
    }

    useEffect(() => {
        logsRef.current.on("value", (snapshot) => {
            const value = snapshot.val();
            if (value) {
                const reversedLogs = Object.values(value).reverse();
                setLogs(reversedLogs);

                if (reversedLogs[0].sound) {
                    playSound();
                }
            }
        });

        return () => {
            logsRef.current.off();
        };
    }, [])

    return [logs, addLog];
}
