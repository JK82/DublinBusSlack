var express = require('express');
var bodyParser = require('body-parser')
var axios = require('axios')

var app = express();

app.use(bodyParser());

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3001!');
});

'//'

app.post('/', function (req, res) {
	var busStopNumber = req.body.text;
	var busStopName = '';
	var busStopEmoji = ':busstop:';
	var busEmoji = 'bus';
	var messageForSlack = '';

	axios.get('https://data.dublinked.ie/cgi-bin/rtpi/busstopinformation?stopid='+ busStopNumber +'&format=json')
	  .then(function (response) {
	  		busStopName = response.data.results[0].shortname;
	  		axios.get('http://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid='+ busStopNumber +'&format=json')
				.then(function (response) {
					messageForSlack = 'Heres the buses due at ' + busStopEmoji + ' ' + busStopName + '/n';
					response.data.results.map(function(bus){
						messageForSlack += busEmoji + ' #' + bus.route + ' in ' + bus.departureduetime + ' minutes';
					})
					res.send(messageForSlack);
				})
				.catch(function (error) {
					console.log(error);
				});
	    
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
});
