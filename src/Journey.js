import React, {Component} from 'react';
import axios from 'axios';
/* import classNames from 'classnames';
 */

let data;
class Journey extends Component{
    constructor(props){
        super(props);
        this.state ={ data: '' };
        this.loadServer = this.loadServer.bind(this);
    }

    loadServer(){
        var config = {
            headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'}
        }
        axios.get(this.props.url, config)
            .then(res => {
                let dataStr = JSON.stringify(res.data).toString();
                this.setState({
                    data: dataStr
                });
                    
                console.log(data);
            })
    }

    componentDidMount(){
        this.loadServer();
        setInterval(this.loadServer, this.props.pollInterval);
    }

    render(){
        if(this.state.data.length > 0){
            data = JSON.parse(this.state.data)
            return(
                <div className="journey">
                    <h1 className="title">{this.props.name}</h1>
                    <h3 className="key">Completude: {data.completion} </h3>
                    <h3 className="key">Novos usuários: {data.newUsers}</h3>
                    <h3 className="key">Total de usuários: {data.totalUsers}</h3>
                    <h3 className="key">Jornadas por usuário: {data.journeysPerUser}</h3>
                    <h3 className="key">Total de Shareables: {data.totalShareables}</h3>
                </div>
            )
        }
        else{
            return(
                <h1>LOADING</h1>
            )
        }
    }
}

export default Journey;