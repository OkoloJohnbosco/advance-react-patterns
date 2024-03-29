import React, { Component, useEffect, useLayoutEffect, useState } from 'react';
import styles from './index.css';
import mojs from 'mo-js';

const initialState = {
    count: 0,
    countTotal: 267,
    isClicked: false,
};
/**
 * Custom Hook for animation
 */

const useClapAnimation = ({ clapRef, clapCountRef, clapTotalRef }) => {
    const [animationTimeline, setAnimationTimeline] = useState(
        () => new mojs.Timeline()
    );
    const tlDuration = 300;

    useLayoutEffect(() => {
        if (!clapRef || !clapCountRef || !clapTotalRef) return;
        const scaleButton = new mojs.Html({
            el: clapRef,
            duration: tlDuration,
            scale: { 1.3: 1 },
            easing: mojs.easing.ease.out,
        });

        const countTotalAnimation = new mojs.Html({
            el: clapTotalRef,
            opacity: { 0: 1 },
            delay: (3 * tlDuration) / 2,
            duration: tlDuration,
            y: { 0: -3 },
        });

        const countAnimation = new mojs.Html({
            el: clapCountRef,
            opacity: { 0: 1 },
            duration: tlDuration,
            y: { 0: -30 },
        }).then({
            opacity: { 1: 0 },
            delay: tlDuration / 2,
            y: -80,
        });

        const burstAnimation = new mojs.Burst({
            radius: { 30: 75 },
            count: 10,
            angle: 25,
            parent: clapRef,
            children: {
                duration: 600,
                // property map - maps over children with mod function
                shape: ['circle', 'polygon'],
                // property map - maps over children with mod function
                fill: ['#27ae60', '#27ae60', '#27ae60'],
                radius: { 4: 0 },
                angle: 90,
                // rand string - generates random value for every child rand( min, max )
                // degreeShift: 'rand(-60, 360)',
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
                // stagger string( start, step ) for every child
                delay: 30,
                speed: 0.2,
            },
        });

        const triangleAnimation = new mojs.Burst({
            parent: clapRef,
            radius: { 50: 95 },
            count: 5,
            angle: 30,
            children: {
                shape: 'polygon',
                duration: tlDuration * 3,
                radius: { 6: 2 },
                stroke: 'rgba(211,54,0,0.5)',
                strokeWidth: 2,
                angle: 90,
                delay: 30,
                speed: 0.2,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
            },
        }).then({
            children: {
                delay: 90,
                radius: { 2: 0 },
            },
        });

        if (typeof clapRef === 'string') {
            const clap = document.getElementById(clapRef);
            clap.style.transform = 'scale(1.1)';
        }
        if (clapRef.style) {
            clapRef.style.transform = 'scale(1.1)';
        }

        const newAnimation = animationTimeline.add([
            scaleButton,
            countTotalAnimation,
            countAnimation,
            triangleAnimation,
            burstAnimation,
        ]);
        setAnimationTimeline(newAnimation);
    }, [clapRef, clapCountRef, clapTotalRef]);

    return animationTimeline;
};

/**
 * End of HOC
 */

const MediumClapContext = React.createContext();
const useMediumClapContext = () => React.useContext(MediumClapContext);

const MediumClap = ({ children, onClap, style: userStyles = {}, className }) => {
    const [{ clapRef, clapCountRef, clapTotalRef }, setRefsState] =
        React.useState({});

    const setRef = React.useCallback((node) => {
        if (node) {
            setRefsState((prevRefState) => ({
                ...prevRefState,
                [node.dataset.refkey]: node,
            }));
        }
    }, []);

    const animationTimeline = useClapAnimation({
        clapRef,
        clapCountRef,
        clapTotalRef,
    });
    const MAXIMUM_USER_CLAP = 50;
    const [clapState, setClapState] = React.useState(initialState);
    const { count } = clapState;
    const handleCountUpdate = () => {
        animationTimeline.replay();
        setClapState((prevState) => ({
            isClicked: true,
            count: Math.min(++prevState.count, MAXIMUM_USER_CLAP),
            countTotal: Math.min(
                ++prevState.countTotal,
                MAXIMUM_USER_CLAP + initialState.countTotal
            ),
        }));
    };

    const componentJustMounted = React.useRef(true);
    React.useEffect(() => {
        if (!componentJustMounted.current) {
            onClap && onClap(clapState);
        }
        componentJustMounted.current = false;
    }, [count]);

    const memoizedValue = React.useMemo(
        () => ({
            ...clapState,
            setRef,
        }),
        [clapState]
    );
    const classNames = [styles.clap, className].join(" ").trim()
    return (
        <MediumClapContext.Provider value={memoizedValue}>
            <button
                id="clap"
                ref={setRef}
                data-refkey="clapRef"
                className={classNames}
                onClick={handleCountUpdate}
                style={userStyles}
            >
                {children}
            </button>
        </MediumClapContext.Provider>
    );
};

const ClapCount = ({ style: userStyles = {} }, className) => {
    const { count, setRef } = useMediumClapContext();
    const classNames = [styles.count, className].join(" ").trim()

    return (
        <span
            className={classNames}
            ref={setRef}
            data-refkey="clapCountRef"
            style={userStyles}
        >
            +{count}
        </span>
    );
};

const ClapIcon = ({ style: userStyles = {}, className }) => {
    const { isClicked } = useMediumClapContext();

    const classNames = [`${styles.icon} ${isClicked && styles.checked}`, className].join(" ").trim()

    return (
        <span>
            <svg
                id="clapIcon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-549 338 100.1 125"
                className={classNames}
                style={userStyles}
            // style={{ color: "red", fill: "teal" }}
            >
                <path d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z" />
                <path d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9" />
            </svg>
        </span>
    )
}

const ClapTotal = ({ style: userStyles = {} }) => {
    const { countTotal, setRef } = useMediumClapContext();

    return (
        <span
            className={styles.total}
            ref={setRef}
            data-refkey="clapTotalRef"
            style={userStyles}
        >
            {countTotal}
        </span>
    );
};

MediumClap.ClapCount = ClapCount;
MediumClap.ClapIcon = ClapIcon;
MediumClap.ClapTotal = ClapTotal;
/**
 * Useage
 */

const Usage = () => {
    const [count, setCount] = React.useState(0);
    const handleClap = (clapState) => {
        setCount(clapState.count);
    };

    return (
        <div style={{ width: '100%' }}>
            <MediumClap onClap={handleClap} style={{ border: "1px solid teal" }}>
                <MediumClap.ClapIcon />
                <MediumClap.ClapCount style={{ background: "black", color: "#fff" }} />
                <MediumClap.ClapTotal />
            </MediumClap>
            {!!count && (
                <div style={{ paddingTop: '30px' }}>You have clapped {count} times</div>
            )}
        </div>
    );
};
export default Usage;
