import firebase from 'firebase';
import React, { Component } from 'react';
import Slide from './Slide';
import SheetFetcher from './SheetFetcher';
import UserAuth from './UserAuth';
import SlideSelector from './SlideSelector';
import TableCreator from './TableCreator';
import Journey from './Journey';
import _ from "lodash";

const FULL_RELOAD_INTERVAL    = 60 * 60 * 60 * 1000;
const SLIDE_TIMEOUT = 
  {
    collab: 45 * 1000,
    default: 15 * 1000
  };

const SLIDES = [
  {
    name: 'Projects',
    collab: 'projects',
    img: 'project.png'
  },
  {
    name: "G1 Enem",
    datastudioSrc: "https://datastudio.google.com/embed/org/cysPzmPFRzuPW6vWIxtGAQ/reporting/0B0XnfuW1UlB1QzJ2RkVrZ3oyZTg/page/VgD",
    img: 'g1.png'
  },
  {
    name: "OC Site",
    datastudioSrc: "https://datastudio.google.com/embed/reporting/0B0XnfuW1UlB1dlFZbkFxLVpxdEU/page/VgD",
    img: 'oc.png'
  },
  {
    name: "Futura Site",
    datastudioSrc: "https://datastudio.google.com/embed/reporting/1Ze46ba1LEagkpyshEvy2ulnAodmwv8yt/page/VgD",
    img: 'futura.jpg'
  },
  {
    name: "FWC Coca-Cola",
    datastudioSrc: "https://datastudio.google.com/embed/reporting/1W_NEZhqY3JpwQU_1dZAtaJArtGkRCGVa/page/AHrD",
    img: 'coca.png'
  },
  {
    name: "Tecnomagia",
    journey: "tecno",
    img: 'tecno.jpg'
  },
  {
    name: "Rota das Carreiras",
    journey: "rota",
    img: 'rota.jpg'
  }
]
const slidesLength = SLIDES.length;

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

  createSlideTimeout(slideIndex) {
    if (slideIndex === 0) {
      return setTimeout(() => {
        DB.ref('currentSlideIndex').set(slideIndex + 1);        
      }, SLIDE_TIMEOUT.collab);
    }
    else if(slideIndex < slidesLength - 1){
      return setTimeout(() => {
        DB.ref('currentSlideIndex').set(slideIndex + 1);        
      }, SLIDE_TIMEOUT.default);
    }
    else{
      return setTimeout(() => {
        DB.ref('currentSlideIndex').set(0);
      }, SLIDE_TIMEOUT.default);
    }
  }

  componentDidMount() {
    DB.ref('currentSlideIndex').on('value', (snapshot) => {
      clearTimeout(this.slideTimeout);
      this.slideTimeout = this.createSlideTimeout(snapshot.val());
      this.setState({ currentSlideIndex: snapshot.val() || 0 });
    });
  }

  onSlideSelectorItemClick(ev) {
    console.log(_.map(SLIDES, 'name').indexOf(ev.target.alt));
    let targetIndex = _.map(SLIDES, 'name').indexOf(ev.target.alt);
    //let targetIndex = [].indexOf.call(ev.target.parentNode.children, ev.target);
    DB.ref('currentSlideIndex').set(targetIndex);
  }
  
  handleAuth(isAuth) {
    this.setState({isAuth: isAuth});
    window.localStorage.setItem('isAuth', isAuth);
 }


  renderSlide(slide, index) {
    if (slide.spreadsheet) {
      return(
        <Slide key={slide.spreadsheet} isActive={this.state.currentSlideIndex === index} duration={SLIDE_TIMEOUT.default}>
          <SheetFetcher gapi={this.state.gapi} key={slide.name} spreadsheet={slide.spreadsheet} />
        </Slide>
      )
    } 
    else if (slide.datastudioSrc) {
      return(
        <Slide key={slide.datastudioSrc} isActive={this.state.currentSlideIndex === index} duration={SLIDE_TIMEOUT.default}>
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
        <Slide key={slide.collab} isActive={this.state.currentSlideIndex === index} duration={SLIDE_TIMEOUT.collab}>
          <TableCreator key={slide.name} url='https://powerful-spire-68577.herokuapp.com/api' pollInterval={5400000}/>
        </Slide>
      )
    }
    else if(slide.journey === "tecno"){
      return(
        <Slide key={slide.journey} isActive={this.state.currentSlideIndex === index} duration={SLIDE_TIMEOUT.default}>
          <Journey name={slide.name} url='https://powerful-spire-68577.herokuapp.com/api/tecno' pollInterval={5400000}/>        
        </Slide>
      )
    }
    else if(slide.journey === "rota"){
      return(
        <Slide key={slide.journey} isActive={this.state.currentSlideIndex === index} duration={SLIDE_TIMEOUT.default}>
        <Journey name={slide.name} url='https://powerful-spire-68577.herokuapp.com/api/rota' pollInterval={5400000}/>        
        </Slide>
      )
    }
  }
  
  renderAuthenticated(){
    return(
      <div>
        {/*<SlideSelector slides={SLIDES} onItemClick={this.onSlideSelectorItemClick} />*/}
        <SlideSelector slides={SLIDES} onItemClick={this.onSlideSelectorItemClick} />
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
