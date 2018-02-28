import firebase from 'firebase';
import React from 'react';
import classNames from 'classnames';

var config = {
    apiKey: "AIzaSyDDEOnD0wFrZaymaxsG8WrQ_6_WpEz5Ruk",
    authDomain: "agile-coral-183820.firebaseapp.com",
    databaseURL: "https://agile-coral-183820.firebaseio.com",
    projectId: "agile-coral-183820",
    storageBucket: "agile-coral-183820.appspot.com",
    messagingSenderId: "140736458087"
  };
firebase.initializeApp(config);

const DB = firebase.database();
var key;

DB.ref('masterKey').on('value', function(snapshot) {
    key = snapshot.val();
});


class UserAuth extends React.Component {
  
  constructor(props){
    super(props);
  
    this.handleAuthChange = this.handleAuthChange.bind(this);
    this.handleAuthSubmit = this.handleAuthSubmit.bind(this);
    
    this.state = {
      password: '',
      isSubmited: false
    };
  }
  
  handleAuthChange(event){
    let isSubmited;
    if(event.target.value.length === 0){
      isSubmited = false;
    }
    else{
      isSubmited = this.state.isSubmited;
    }
    this.setState({password: event.target.value, isSubmited: isSubmited});
  }
  
  handleAuthSubmit(event){
    event.preventDefault();
    this.props.handleAuth(this.state.password === key);
    this.setState({isSubmited: true});
  }
  
  render() {
    var isErrorMsgActive = this.state.password && this.state.password.length && this.state.isSubmited;
    return (
      <div className="user-auth">
        <h1>OC Dashboard</h1>
        <form onSubmit={this.handleAuthSubmit}>
          <input type="password" value={this.state.password} onChange={this.handleAuthChange} placeholder='Digite a Senha' />
          <p className={classNames('error-msg', {isActive: isErrorMsgActive})}>Senha Incorreta</p>
        </form>
      </div>
    );
  }
}

export default UserAuth;
