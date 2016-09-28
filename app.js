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
	var busEmoji = ':bus:';
	var messageForSlack = '';
	var weather = 'Check out the weather ';

	axios.get('https://data.dublinked.ie/cgi-bin/rtpi/busstopinformation?stopid='+ busStopNumber +'&format=json')
	  .then(function (response) {
	  		busStopName = response.data.results[0].shortname;
	  		axios.get('https://api.darksky.net/forecast/09324a44567189a816d083eabbc01184/'+ response.data.results[0].latitude + ',' + response.data.results[0].longitude)
				  .then(function (response) {
				  	switch(response.data.currently.icon){
				  		case 'clear-day':
				  				weather = ':sunny:'
				  			break;
				  		case 'clear-night':
				  				weather += ':full_moon:'
				  			break;
				  		case 'rain':
				  				weather += ':rain_cloud:'
				  			break;
				  		case 'snow':
				  				weather += ':snow_cloud:'
				  			break;
				  		case 'sleet':
				  				weather += ':snow_cloud:'
				  			break;
				  		case 'wind':
				  				weather += ':dash:'
				  			break;
				  		case 'fog':
				  				weather += ':fog:'
				  			break;
				  		case 'cloudy':
				  				weather += ':cloud:'
				  			break;
				  		case 'partly-cloudy':
				  				weather += ':mostly_sunny:'
				  			break;
				  		case 'partly-cloudy-night':
				  				weather += '::crescent_moon::'
				  			break
				  		default:
				  			''
				  	}
				  	weather += ' ' + response.data.currently.summary;
				    axios.get('http://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid='+ busStopNumber +'&format=json')
							.then(function (response) {
								messageForSlack = "Hey " + req.body.user_name + " Here's the buses due at " + busStopEmoji + ' ' + busStopName + '\n';
								response.data.results.map(function(bus){
									messageForSlack += busEmoji + ' #' + bus.route + ' in ' + bus.departureduetime + ' minutes\n';
								})
								messageForSlack += '\n' + weather;
								res.send({text:messageForSlack});
							})
							.catch(function (error) {
								console.log(error);
							});
				  })
				  .catch(function (error) {
				    console.log(error);
				  });

	  		
	    
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
});
