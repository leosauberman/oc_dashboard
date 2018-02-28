import firebase from 'firebase';
import React, { Component } from 'react';
import Slide from './Slide';
import SheetFetcher from './SheetFetcher';
import SheetApiAuth from './SheetApiAuth';
import UserAuth from './UserAuth';
import SlideSelector from './SlideSelector';
import _ from 'lodash';
import TableCreator from './TableCreator';

const FULL_RELOAD_INTERVAL = 30 * 60 * 1000;
const SLIDE_TIMEOUT = 30 * 1000;

const SLIDES = [
  {
    name: 'Projects',
    collab: 'projects'
  },
  {
    name: "G1 Enem",
    datastudioSrc: "https://datastudio.google.com/embed/org/cysPzmPFRzuPW6vWIxtGAQ/reporting/0B0XnfuW1UlB1QzJ2RkVrZ3oyZTg/page/VgD",
  },
  {
    name: "OC Site",
    datastudioSrc: "https://datastudio.google.com/embed/reporting/0B0XnfuW1UlB1dlFZbkFxLVpxdEU/page/VgD",
  },
]

// firebase.initializeApp({
//   apiKey: "AIzaSyDDEOnD0wFrZaymaxsG8WrQ_6_WpEz5Ruk",
//   authDomain: "agile-coral-183820.firebaseapp.com",
//   databaseURL: "https://agile-coral-183820.firebaseio.com",
//   projectId: "agile-coral-183820",
//   storageBucket: "agile-coral-183820.appspot.com",
//   messagingSenderId: "140736458087"
// });

const DB = firebase.database();

class App extends Component {
  constructor() {
    super();

    this.slidesLength = 3;

    this.state = {
      currentSlideIndex: 0,
      isUserAuthenticated: false,
      gapi: null,
      invalidPassword: false,
      isAuth: window.localStorage.getItem('isAuth') || false
    };

    this.renderSlide = this.renderSlide.bind(this);
    this.createSlideTimeout = this.createSlideTimeout.bind(this);
    this.onSlideSelectorItemClick.bind(this);

    this.handleAuth = this.handleAuth.bind(this);

    this.slideTimeout = this.createSlideTimeout();
    

    setInterval(() => {
      window.location.reload();
    }, FULL_RELOAD_INTERVAL);
  }

  onSheetApiReady() {
    this.setState({gapi: window.gapi})
  }

  createSlideTimeout() {
    return setTimeout(() => {
      if (this.state.currentSlideIndex === (this.slidesLength - 1)) {
        DB.ref('currentSlideIndex').set(0);
      } else {
        DB.ref('currentSlideIndex').set(this.state.currentSlideIndex + 1);
      }
    }, SLIDE_TIMEOUT);
  }

  componentDidMount() {
    DB.ref('currentSlideIndex').on('value', (snapshot) => {
      clearTimeout(this.slideTimeout);
      this.slideTimeout = this.createSlideTimeout();
      this.setState({ currentSlideIndex: snapshot.val() || 0 });
    });
  }

  onSlideSelectorItemClick(ev) {
    let targetIndex = [].indexOf.call(ev.target.parentNode.children, ev.target);
    DB.ref('currentSlideIndex').set(targetIndex);
  }
  
  handleAuth(isAuth) {
    this.setState({isAuth: isAuth});
    window.localStorage.setItem('isAuth', isAuth);
 }
 


  renderSlide(slide, index) {
    if (slide.spreadsheet) {
      return(
        <Slide key={slide.spreadsheet} isActive={this.state.currentSlideIndex === index} duration={SLIDE_TIMEOUT}>
          <SheetFetcher gapi={this.state.gapi} key={slide.name} spreadsheet={slide.spreadsheet} />
        </Slide>
      )
    } else if (slide.datastudioSrc) {
      return(
        <Slide key={slide.datastudioSrc} isActive={this.state.currentSlideIndex === index} duration={SLIDE_TIMEOUT}>
          <iframe
            src={slide.datastudioSrc}
            title={slide.name}
            width={window.innerWidth}
            height={window.innerHeight}
            frameBorder="0"
          />
        </Slide>
      )
    }
    else if(slide.collab){
      return(
        <Slide key={slide.collab} isActive={this.state.currentSlideIndex === index} duration={SLIDE_TIMEOUT}>
          <TableCreator key={slide.name} url='http://192.168.1.21:3101/api/' pollInterval={1200000}/>
        </Slide>
      )
    }
  }
  
  renderAuthenticated(){
    return(
      <div>
        <SheetApiAuth onReady={this.onSheetApiReady.bind(this)}/>
        <SlideSelector slides={_.map(SLIDES, 'name')} onItemClick={this.onSlideSelectorItemClick} />
        { SLIDES.map((slide, i) => this.renderSlide(slide, i)) }
      </div>
    )
  
  }

  render() {
    return (
      <div className="App">
        { this.state.isAuth 
          ? this.renderAuthenticated()
          : <UserAuth handleAuth={this.handleAuth}/>
        }
      </div>
    );
  }
}

export default App;
