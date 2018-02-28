import React from 'react';
import classNames from 'classnames';

class SlideSelector extends React.Component {
  render() {
    return (
      <div className={classNames('slide-selector', {active: typeof(window.ontouchstart) !== 'undefined'})}>
        {
          this.props.slides.map((slide) => {
            return(
              <div key={slide} className="item" onClick={this.props.onItemClick}>{slide}</div>
            )
          })
        }
      </div>
    );
  }
}

export default SlideSelector;
