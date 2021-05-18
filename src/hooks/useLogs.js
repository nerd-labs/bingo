import { useRef, useEffect, useState } from 'react';

import { firebase } from '../initFirebase';
import config from '../config';

const db = firebase.database();

export default function useConfig() {
    const [logs, setLogs] = useState();

    const logsRef = useRef(db.ref('logs'));

    function addLog(text) {
        logsRef.current.push({
            text,
            time: Date.now(),
        });
    }

    useEffect(() => {
        logsRef.current.on("value", (snapshot) => {
            setLogs(snapshot.val());
        });

        return () => {
            logsRef.current.off();
        };
    }, [])

    return [logs, addLog];
}
