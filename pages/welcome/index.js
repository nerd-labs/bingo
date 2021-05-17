import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import { firebase } from '../../src/initFirebase';

import Button from '../../src/components/Button';

import styles from './Welcome.module.css';

const db = firebase.database();

function Welcome() {
    const router = useRouter()
    const [name, setName] = useState();
    const [user, setUser] = useState('');

    useEffect(() => {
        async function getIp() {
            const response = await fetch('https://api.ipify.org/?format=json');
            const { ip } = await response.json();

            db.ref('users').orderByChild('ip').equalTo(ip).on('value', (snapshot) => {
                const us = snapshot.val();

                if (!us) {
                    return;
                }

                setUser(us);
            });
        }
        
        getIp();
    }, []);

    useEffect(() => {
        if (user && !name) setName(Object.values(user)[0].name);
    }, [user]);

    async function addUser(e) {
        e.preventDefault();

        const response = await fetch('https://api.ipify.org/?format=json');
        const { ip } = await response.json();

        if (user) {
            db.ref(`users/${Object.keys(user)[0]}`).set({ name, ip });
        } else {
            const usersRef = db.ref('users');

            usersRef.push({
                name,
                ip,
            });
        }

        router.push('/');
    }

    return (
        <form className={styles.welcome} onSubmit={addUser}>
            <p className={styles.label}>Naam: </p>
            <div className={styles.title}>
                <input className={styles.titleInner} value={name} 
                    onChange={(e) => setName(e.target.value)}/>
            </div>

            <Button className={styles.button}  text='Verstuur' type="submit" onClick={addUser} />
        </form>
    );
}

export default Welcome;
