'use strict'

var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    cors = require('cors');

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

var app = express();
var router = express.Router();
var port = process.env.PORT || 5000;

var now = moment();
var yesterday = moment(now).subtract(1, 'd').format('YYYY-MM-DD');
var dayLimit = moment(now).add(10, 'd').format('YYYY-MM-DD');
var range = moment.range(yesterday, dayLimit);

function sortMethod(array) {
    var changed = true;
    var len_control = array.length - 1;
    while (len_control > 0 && changed) {
        changed = false;
        for (let i = 0; i < len_control; i++) {
            
            if (parseInt(array[i].due_on) > parseInt(array[i+1].due_on)) {
                changed = true;
                var temp = array[i];
            
                array[i] = array[i+1];
            
                array[i+1] = temp;
                
            }
        }    
        len_control -= 1;
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.options('/', cors());
router.get('/', cors(), (req, res, next) => {
    request({

        url: 'https://app.activecollab.com/165186/api/v1/reports/run?type=AssignmentFilter&label_filter=selected_MILESTONE,CHECKPOINT',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
            'X-Angie-AuthApiToken': '25-5MPhyypK1AUyNhdhDMXqwSfYxVddRtqTqgiVGFVX'
        },
        json: true

    }, (err, response, body) => {

        if(!err && response.statusCode === 200){

            let ids = [];
            let assignments = body.all.assignments;
            let projects = [];
            let taskName = [];
            let due_on = [];
            let completed_by;

            for(var id in assignments){
                ids.push(id);
            }
            for(var i in ids){
                var _id = ids[i].toString();
                let timeStamp = assignments[_id].due_on;
                var temp_due_on = moment(timeStamp * 1000).format('YYYY-MM-DD');
                completed_by = assignments[_id].completed_by_id;
                /* console.log('yesterday:   ' + yesterday);
                console.log('temp_due_on: ' + temp_due_on);
                console.log('dayLimit:    ' + dayLimit); */

                taskName.push(assignments[_id].name);

                //if(moment(temp_due_on).isAfter(yesterday)){ ||| range.contains(moment(temp_due_on)) pra um range específico
                if(completed_by == null){
                    due_on[i] = moment(temp_due_on).format('DDD');
                    
                    projects.push({
                        project: assignments[_id].project,
                        task: taskName[i],
                        due_on: due_on[i]
                    });
                }
            }

            sortMethod(projects);
            res.send(projects);
        }

        else{
            console.log(err);
            response.send(err);
        }

    });
});

app.use('/api', router);

try {
    app.listen(port, () => console.log('Working on: ' + port));
} catch (error) {
    console.console.log('====================================');
    console.log(error);
    console.log('====================================');
}


//864000000 10 dias em miliseconds
//86400