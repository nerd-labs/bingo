import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import { firebase } from '../../src/initFirebase';

import Button from '../../src/components/Button';

import styles from './Welcome.module.css';

const db = firebase.database();

function Welcome() {
    const router = useRouter()
    const [name, setName] = useState('');
    const [user, setUser] = useState('');

    const [userId, setUserId] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('bingo.euri.com');
        }
    });

    useEffect(() => {
        async function getUser() {
            const us = db.ref(`users/${userId}`);
            const snapshot = await us.once('value');
            const value = snapshot.val();

            if (!value) {
                return;
            }

            setUser(value);
        }
        
        getUser();
    }, []);

    useEffect(() => {
        if (user && !name) setName(user.name);
    }, [user]);

    async function addUser(e) {
        e.preventDefault();

        if (user) {
            db.ref(`users/${userId}`).update({ name });
        } else {
            const usersRef = db.ref('users');
            const newUser = usersRef.push();

            newUser.set({
                name,
                key: newUser.key,
            });

            localStorage.setItem('bingo.euri.com', newUser.key);
            setUserId(newUser.key);
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
