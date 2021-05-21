import React, {useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/router'
import { firebase } from '../src/initFirebase';

import Button from '../src/components/Button';

import styles from './Index.module.css';

const db = firebase.database();

function Welcome() {
    const router = useRouter()

    const [hasActiveGame, setHasActiveGame] = useState(false);
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');

    const ranksRef = useRef(db.ref('ranks'));
    const usersRef = useRef(db.ref('users'));

    const [userId, setUserId] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('bingo.euri.com');
        }
    });

    useEffect(() => {
        if (hasActiveGame && user && !isLoading) return router.push('/game');
    }, [hasActiveGame]);

    useEffect(() => {
        async function getUser() {
            if (!userId) return;

            const snapshot = await usersRef.current.child(userId).once('value');
            const value = snapshot.val();

            if (!value) {
                return;
            }

            setUser(value);
        }

        getUser();
    }, [userId]);

    useEffect(() => {
        ranksRef.current.on('value', (snapshot) => {
            const value = snapshot.val();

            setHasActiveGame(value?.some((rank) => rank.active));
        });
    }, []);

    useEffect(() => {
        if (user && !name) setName(user.name);
    }, [user]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 4000);
    }, []);

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

        if (hasActiveGame) router.push('/game');
    }

    return (
        <div className={styles.welcome}>
            <img src="/logo.png" className={styles.logoImage} alt="logo" />

            <div className={styles.content}>
                { isLoading && <h1 className={styles.loading}>Spel aan het laden....</h1> }

                { user && !isLoading && (
                    <div className={styles.noActiveGame}>
                        <h1>Welkom {user?.name}</h1>
                        <p>Nog even geduld! We starten zo dadelijk!</p>
                    </div>
                )}

                { !user && !isLoading && (
                    <form onSubmit={addUser}>
                        <p className={styles.label}>Naam: </p>
                        <div className={styles.title}>
                            <input className={styles.titleInner} value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>

                        <Button className={styles.button}  text='Verstuur' type="submit" onClick={addUser} />
                    </form>
                )}

            </div>
        </div>
    );
}

export default Welcome;
