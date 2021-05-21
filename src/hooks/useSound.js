import { Howl, Howler } from 'howler';

import {
    useState,
    useRef,
    useEffect,
    useCallback,
} from 'react';

export default function useSound(src, customOptions) {
    const defaultOptions = {
        volume: 1,
        playbackRate: 1,
        soundEnabled: true,
        interrupt: false,
    };

    const options = {
        ...defaultOptions,
        ...customOptions,
    };

    const {
        volume,
        playbackRate,
        soundEnabled,
        interrupt,
        onload,
        ...delegated
    } = options;

    const isMounted = useRef(false);
    const soundId = useRef();

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(null);

    const [sound, setSound] = useState(null);

    function handleLoad() {
        if (typeof onload === 'function') {
            onload.call(this);
        }

        if (isMounted.current) {
            setDuration(this.duration() * 1000);
        }
    }

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;

            const newSound = new Howl({
                src: [src],
                volume,
                rate: playbackRate,
                onload: handleLoad,
                ...delegated,
            });

            setSound(newSound);
        }

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (sound) {
            setSound(
                new Howl({
                    src: [src],
                    volume,
                    onload: handleLoad,
                    ...delegated,
                }),
            );
        }
    }, [JSON.stringify(src)]);

    useEffect(() => {
        if (sound) {
            sound.volume(volume);
            sound.rate(playbackRate);
        }
    }, [volume, playbackRate]);

    const play = useCallback(
        (opts = {}) => {
            if (!sound || (!soundEnabled && !opts.forceSoundEnabled)) {
                return;
            }

            if (interrupt) {
                sound.stop();
            }

            if (opts.playbackRate) {
                sound.rate(opts.playbackRate);
            }

            const id = sound.play();

            soundId.current = id;

            if (isMounted.current) {
                sound.once('end', () => {
                    // If sound is not looping
                    if (!sound.playing()) {
                        setIsPlaying(false);
                    }
                });
            }

            if (isMounted.current) {
                setIsPlaying(true);
            }
        }, [sound, soundEnabled, interrupt],
    );

    const stop = useCallback(
        (id) => {
            if (!sound) {
                return;
            }
            sound.stop(id);

            soundId.current = null;

            if (isMounted.current) {
                setIsPlaying(false);
            }
        }, [sound],
    );

    const pause = useCallback(
        (id) => {
            if (!sound) {
                return;
            }
            sound.pause(id);

            if (isMounted.current) {
                setIsPlaying(false);
            }
        }, [sound],
    );

    const mute = useCallback((muted, allSounds) => {
        Howler.mute(muted, allSounds ? null : soundId.current);
    }, []);

    const returnedValue = [
        play,
        {
            sound,
            stop,
            pause,
            isPlaying,
            duration,
            mute,
        },
    ];

    return returnedValue;
}

export {
    useSound,
};
