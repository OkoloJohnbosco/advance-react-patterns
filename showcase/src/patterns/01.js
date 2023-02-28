import React, { Component, useState } from "react";
import styles from "./index.css";
import mojs from 'mo-js'

const initialState = {
  count: 0,
  countTotal: 267,
  isClicked: false
}
/**
 * Higher Order Component
 */

const withClapAnimation = (WrappedComponent) => {
  class WithClapAnimation extends Component {
    animationTimeline = new mojs.Timeline()
    state = {
      animationTimeline: this.animationTimeline
    }

    componentDidMount() {
      const tlDuration = 300;

      const scaleButton = new mojs.Html({
        el: "#clap",
        duration: tlDuration,
        scale: { 1.3: 1 },
        easing: mojs.easing.ease.out,
      })

      const countTotalAnimation = new mojs.Html({
        el: "#clapCountTotal",
        opacity: { 0: 1 },
        delay: (3 * tlDuration) / 2,
        duration: tlDuration,
        y: { 0: -3 }
      })

      const countAnimation = new mojs.Html({
        el: "#count",
        opacity: { 0: 1 },
        duration: tlDuration,
        y: { 0: -30 }
      }).then({
        opacity: { 1: 0 },
        delay: tlDuration / 2,
        y: -80
      })

      const burstAnimation = new mojs.Burst({
        radius: { 30: 75 },
        count: 10,

        // onComplete() {
        //   console.log('completed');
        // },
        angle: 25,
        parent: "#clap",
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
          speed: 0.2
        }
      });

      const triangleAnimation = new mojs.Burst({
        parent: "#clap",
        radius: { 50: 95 },
        count: 5,
        angle: 30,
        children: {
          shape: 'polygon',
          duration: tlDuration * 3,
          radius: { 6: 2 },
          stroke: "rgba(211,54,0,0.5)",
          strokeWidth: 2,
          angle: 90,
          delay: 30,
          speed: 0.2,
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
        }
      }).then({
        children: {
          delay: 90,
          radius: { 2: 0 }
        }
      })
      // const count = document.getElementById("count")
      // count.style.opacity = '0'

      const clap = document.getElementById("clap")
      clap.style.transform = 'scale(1.1)'

      const newAnimation = this.animationTimeline.add([scaleButton, countTotalAnimation, countAnimation, triangleAnimation, burstAnimation])
      this.setState({ animationTimeline: newAnimation })
    }

    animate = () => {

    }
    render() {
      return <WrappedComponent {...this.props} animationTimeline={this.state.animationTimeline} />
    }
  }
  return WithClapAnimation
}


/**
 * End of HOC
 */
const MediumClap = ({ animationTimeline }) => {
  const MAXIMUM_USER_CLAP = 50;
  const [clapState, setClapState] = React.useState(initialState)
  const { count, countTotal, isClicked } = clapState;

  const handleCountUpdate = () => {
    animationTimeline.replay()
    setClapState(prevState => ({
      isClicked: true,
      count: Math.min(++prevState.count, MAXIMUM_USER_CLAP),
      countTotal: Math.min(++prevState.countTotal, MAXIMUM_USER_CLAP + initialState.countTotal)
    }))
  }

  return (
    <button id="clap" className={styles.clap} onClick={handleCountUpdate}>
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={count} />
      <ClapTotal countTotal={countTotal} />
    </button>
  );
};

const ClapCount = ({ count }) => (
  <span className={styles.count} id="count">+{count}</span>
);

const ClapIcon = ({ isClicked }) => (
  <span>
    <svg
      id='clapIcon'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='-549 338 100.1 125'
      className={`${styles.icon} ${isClicked && styles.checked}`}
    // style={{ color: "red", fill: "teal" }}
    >
      <path d='M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z' />
      <path d='M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9' />
    </svg>
  </span>
);

const ClapTotal = ({ countTotal }) => (
  <span className={styles.total} id="clapCountTotal">{countTotal}</span>
);

/**
 * Useage
 */

const Usage = () => {
  const AnimatedMediumClap = withClapAnimation(MediumClap)

  return <AnimatedMediumClap />
}

export default Usage;
