import React from 'react';
import classNames from 'classnames';
import { TweenMax, Power0 } from 'gsap'

class Slide extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.isActive && this.props.isActive) {
      TweenMax.fromTo(this.timerBar, this.props.duration / 1000, {scaleX: 0}, {scaleX: 1, ease: Power0.easeNone})
    }
  }

  render() {
    return (
      <div className={classNames('slide-wrapper', {active: this.props.isActive})}>
        {this.props.children}

        <div ref={timerBar => this.timerBar = timerBar} className='timer-bar'></div>
      </div>
    );
  }
}

export default Slide;
