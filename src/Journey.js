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
            data = JSON.parse(this.state.data);
            let imgCompletPath;
            let imgInitPath;

            if(this.props.name === "Tecnomagia"){
                imgCompletPath = "tecno/" + data.leastCompleted.alias + ".png"; 
                imgInitPath = "tecno/" + data.mostInit.alias + ".png";
                return(
                    <div className="journey">
                        <h1>{this.props.name}</h1>
                        <div className="dashboard">
                            <div className="boxes">
                                <div className="itens">
                                    <div className="box-item">
                                        <div className="text">
                                            Total de usuários
                                        </div>
                                        <div className="box">
                                            {data.totalUsers}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Iniciadas/Usuário
                                        </div>
                                        <div className="box">
                                            {data.journeysPerUser}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Completas/Usuário
                                        </div>
                                        <div className="box">
                                            {data.completedPerUser}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Completude
                                        </div>
                                        <div className="box">
                                            {data.completion}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Novos usuários
                                        </div>
                                        <caption>
                                            (últimos 30 dias)
                                        </caption>
                                        <div className="box" style={{marginTop: 13+"%"}}>
                                            {data.newUsers}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Shareables
                                        </div>
                                        <caption>
                                            (últimos 30 dias)
                                        </caption>
                                        <div className="box" style={{marginTop: 13+"%"}}>
                                            {data.totalShareables}
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="most">
                                <div className="init">
                                    <div className="title">
                                        Mais iniciada: {data.mostInit.name}
                                    </div>
                                    <img src={imgInitPath} alt={data.mostInit.name}/>
                                    <div className="data">
                                        {data.mostInit.rate}
                                    </div>
                                </div>
                                <div className="completion">
                                    <div className="title">
                                        Menor completude: {data.leastCompleted.name}
                                    </div>
                                    <img src={imgCompletPath} alt={data.leastCompleted.name}/>
                                    <div className="data">
                                        {data.leastCompleted.rate}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            else{
                imgCompletPath = "rota/" + data.leastCompleted.alias + ".jpg"; 
                imgInitPath = "rota/" + data.mostInit.alias + ".jpg";
                var initStyle = { 
                    backgroundImage: "url(" + imgInitPath + ")",
                    textAlign: 'center'
                };
                var completStyle = { backgroundImage: "url(" + imgCompletPath + ")"};
                return(
                    <div className="rota">
                        <h1>{this.props.name}</h1>
                        <div className="dashboard">
                            <div className="boxes">
                                <div className="itens">
                                    <div className="box-item">
                                        <div className="text">
                                            Total de usuários
                                        </div>
                                        <div className="box">
                                            {data.totalUsers}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Iniciadas/Usuário
                                        </div>
                                        <div className="box">
                                            {data.journeysPerUser}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Completas/Usuário
                                        </div>
                                        <div className="box">
                                            {data.completedPerUser}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Completude
                                        </div>
                                        <div className="box">
                                            {data.completion}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Novos usuários
                                        </div>
                                        <caption>
                                            (últimos 30 dias)
                                        </caption>
                                        <div className="box" style={{marginTop: 13+"%"}}>
                                            {data.newUsers}
                                        </div>
                                    </div>
                                    <div className="box-item">
                                        <div className="text">
                                            Shareables
                                        </div>
                                        <caption>
                                            (últimos 30 dias)
                                        </caption>
                                        <div className="box" style={{marginTop: 13+"%"}}>
                                            {data.totalShareables}
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="most">
                                <div className="init" style={initStyle}>
                                    <div className="title">
                                        mais iniciada <br/> <b><span>{data.mostInit.name}</span></b>
                                    </div>
                                    <div className="data">
                                        {data.mostInit.rate}
                                    </div>
                                </div>
                                <div className="completion" style={completStyle}>
                                    <div className="title">
                                        menor completude<br/> <b><span>{data.leastCompleted.name}</span></b>
                                    </div>
                                    <div className="data">
                                        {data.leastCompleted.rate}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        else{
            return(
                <h1>LOADING</h1>
            )
        }
    }
}

export default Journey;