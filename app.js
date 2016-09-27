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
	    res.send(simpleStringify(response.data.results[0].origin))
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
});
