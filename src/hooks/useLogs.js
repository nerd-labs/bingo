import { useRef, useEffect, useState } from 'react';

import { firebase } from '../initFirebase';

const db = firebase.database();

export default function useConfig() {
    const [logs, setLogs] = useState([]);

    const logsRef = useRef(db.ref('logs'));

    function addLog(text, highlight) {
        const newLog = logsRef.current.push();

        newLog.set({
            text,
            highlight: !!highlight,
            time: Date.now(),
            key: newLog.key,
        });
    }

    useEffect(() => {
        logsRef.current.on("value", (snapshot) => {
            const value = snapshot.val();
            if (value) setLogs(Object.values(value).reverse());
        });

        return () => {
            logsRef.current.off();
        };
    }, [])

    return [logs, addLog];
}
