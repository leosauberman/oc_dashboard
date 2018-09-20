import React, {Component} from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import moment from 'moment-es6';
import classNames from 'classnames';
//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
//import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './table.css';

class Project extends Component {
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
                this.setState({ data: JSON.stringify(res.data)});
            })
    }

    componentDidMount(){
        this.loadServer();
        setInterval(this.loadServer, this.props.pollInterval);
    }

    render(){
        let data = [{
            project: "Loading",
            task: "Loading",
            due_on: "Loading",
            assignee: "Loading",
            delayed: null
        }];

        if(this.state.data){
            let temp_data = JSON.parse(this.state.data);
            for(var i in temp_data){
                data[i] = {
                    project: temp_data[i].project,
                    task: temp_data[i].task,
                    due_on: moment(temp_data[i].due_on, 'YYDDDD').format('DD/MM/YY'),
                    assignee: temp_data[i].assignee,
                    delayed: temp_data[i].delayed
                }
            }
        }

        const columns = [
        {
            Header: 'PROJECT',
            accessor: 'project',
            maxWidth: 285
        },
        {
            Header: 'ASSIGNEE',
            accessor: 'assignee',
            maxWidth: 155
        },
        {
            Header: 'TASK',
            accessor: 'task'
        },
        {
              Header: 'DUE ON',
              accessor: 'due_on',
              maxWidth: 160
        },
        {
            Header: 'delayed',
            accessor: 'delayed',
            show: false
        }];

        return(
            <div className={classNames('sheets-wrapper', this.props.type)}>
                <ReactTable
                    className="-striped"
                    data={data} 
                    columns={columns}
                    defaultPageSize={15}
                    getTrProps={(state, rowInfo) => {
                        if(rowInfo !== undefined && rowInfo.row.due_on !== "Loading"){
                            if(rowInfo.row.delayed === 1){
                                return {
                                    style: {
                                        color: 'yellow',
                                        font: 'bold 30px Comfortaa, sans-serif'
                                    }
                                }
                            }
                            else{
                                return {
                                    style: {
                                        color: 'white',
                                        font: 'normal 27px Comfortaa, sans-serif'  
                                    }
                                }
                            }
                            
                        }
                        else{
                            return {}
                        }
                    }}
                />
            </div>
        );
    }
}

export default Project;