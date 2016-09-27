var express = require('express');
var bodyParser = require('body-parser')
var axios = require('axios')

var app = express();

app.use(bodyParser());

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3001!');
});

app.post('/', function (req, res) {
	var busStopNumber = req.body.text;
	axios.get('http://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid='+ busStopNumber +'&format=json')
	  .then(function (response) {
	  	console.log('HI JOHN')
	  	console.log(simpleStringify(response))
	  	console.log(simpleStringify(response.results))
	    res.send(simpleStringify(response.results))
	  })
	  .catch(function (error) {
	  	console.log('HI SELINA')
	    console.log(error);
	  });
    //res.send(req);
});

function simpleStringify (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};