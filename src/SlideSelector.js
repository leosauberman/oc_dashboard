import React from 'react';
import classNames from 'classnames';

class SlideSelector extends React.Component {
  render() {
    let slides = [];
    for(var i in this.props.slides){
      slides[i] = {
        name: this.props.slides[i].name,
        img: this.props.slides[i].img
      }
    }
    
    return (
      <div className={classNames('slide-selector', {active: typeof(window.ontouchstart) !== 'undefined'})}>
        {
          slides.map((slides) => {
            return(
              <div key={slides.name} className="item" onClick={this.props.onItemClick}>
                <img src={slides.img} alt={slides.name}/>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default SlideSelector;
