import React from 'react';
import moment from 'moment-es6';

class Silence extends React.Component{
    
    constructor() {
        super()
        this.state = {
            time: moment().format("HH:mm:ss"),
            isSilence: false
        }
        this.countingSecond = this.countingSecond.bind(this);
        this.silenceTime = this.silenceTime.bind(this);
    }
    countingSecond() {
        this.setState({
            time: moment().format("HH:mm:ss")
        });
    }
    
    componentWillMount() {
        setInterval(this.countingSecond, 1000);
    }
    componentDidMount(){
        this.silenceTime();
    }

    silenceTime() {
        if(moment().isBetween(moment("11:00", "HH:mm"), moment("12:30", "HH:mm")) || moment().isBetween(moment("50", "mm"), moment("00", "mm"))){
            this.setState({
                isSilence: true
            })
        }
    }

    render() {
        if(this.state.isSilence){
            return (
                <div>
                    <h1 style={{color: "red", fontSize: "14em", padding: "10% 10% 0 10%", margin: "0 15%"}}>{this.state.time}</h1>
                    <h2 style={{color: "white", fontSize: "14em", margin: "2% 20% 0"}}> SILÊNCIO!!</h2>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h1 style={{color: "green", fontSize: "14em", padding: "10% 10% 0 10%", margin: "0 15%"}}>{this.state.time}</h1>
                    <h2 style={{color: "white", fontSize: "8em", marginLeft: "10%"}}>FALE COM MODERAÇÃO</h2>
                </div>
            )
        }
        
    }
}

export default Silence;

/* constructor(props){
        super(props);
        this.updateTime = this.updateTime.bind(this);
    }

    updateTime() {
        now = moment().format("HH:mm:ss");
    }

    render() {
        return(
            <h1 style={{color: "white", fontSize: "4em", margin: "10% 33% 0"}}>{now}</h1>
        )
    } */