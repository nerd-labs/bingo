import React, {useState, useEffect, useRef} from 'react';
import { firebase } from '../../src/initFirebase';

const db = firebase.database();

export default function Range() {
    const [value, setValue] = useState();
    const [ballValue, setBallValue] = useState();
    const [ranges, setRanges] = useState();
    const rangesRef = useRef(db.ref('ranges'));

    useEffect(() => {
        rangesRef.current.on("value", (snapshot) => {
            setRanges(snapshot.val());
        });

        return () => {
            rangesRef.current.off();
        };
    }, [])

    return (
        <main>
            <h1> Add new range</h1>
            <form onSubmit={(e) => {
                e.preventDefault();

                const rangesRef = db.ref('ranges');
                const newRangeRef = rangesRef.push();

                newRangeRef.set({
                    name: value,
                    active: false,
                });
            }}>
                <input name="range" value={value} onChange={(e) => setValue(e.target.value)} />

                <button type="submit">Add new range</button>
            </form>

            { ranges && (
                <>
                    <h1>Set active range</h1>

                    <form>
                        {
                            Object.keys(ranges)?.map((key) => (
                                <label key={key}>
                                    <input 
                                        type="radio" 
                                        checked={ranges[key].active}
                                        value={key} 
                                        name="range" 
                                        onChange={(e) => {
                                            Object.keys(ranges).forEach((k) => {
                                                rangesRef.current.child(k).update({ active: k === e.target.value });
                                            });
                                        }}
                                    /> 
                                    {ranges[key].name}
                                </label>
                            ))
                        }
                    </form> 
                </>
            )}

            <h1> Add new ball</h1>
            <form onSubmit={(e) => {
                e.preventDefault();

                const ballsRef = db.ref('balls');
                const newBallRef = ballsRef.push();

                newBallRef.set({
                    value: ballValue,
                });

                setBallValue(null)
            }}>
                <input name="range" value={ballValue} onChange={(e) => setBallValue(e.target.value)} />

                <button type="submit">Add new ball</button>
            </form>
        </main>
    );
}
