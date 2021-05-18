import { useEffect, useState } from 'react';

import { firebase } from '../initFirebase';
import config from '../config';

const db = firebase.database();

export default function useConfig() {
    const [levelConfig, setLevelConfig] = useState();

    useEffect(() => {
        const ref = db.ref('priceRanks');

        ref.on("value", (snapshot) => {
            const activeRange = Object.values(snapshot.val()).find((obj) => obj.active);

            let rang = null;

            if (activeRange) {
                switch(activeRange.name) {
                    case 'Rang 1':
                        rang = 'level1';
                        break;
                    case 'Rang 2':
                        rang = 'level2';
                        break;
                    case 'Rang 3':
                        rang = 'level3';
                        break;
                    case 'Super Jackpot':
                        rang = 'superJackpot';
                        break;
                    default:
                        break;
                }
            }

            if (config[rang]) setLevelConfig(config[rang]);
            else setLevelConfig([]);
        });

        return () => {
            ref.off();
        };
    }, [])

    return levelConfig;
}
