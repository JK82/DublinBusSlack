var express = require('express');
var bodyParser = require('body-parser')
var axios = require('axios')
var nodemailer = require('nodemailer')

var app = express();
app.use(bodyParser());


var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'slackdublinbus@gmail.com',
        pass: 'JohnWasFormedIn1982'
    }
};

var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols


function sendEmailToJohn(team){
  var body = '';
  var subject = '';
  if(team == 'CANCELLED AT LAST MINUTE'){
    body = 'Hello John, somebody got to the install page but cancelled';
    subject = 'Shitofski, close but no cigar';

  }else{
    body = 'Hello John, ' + team + ' have installed SlackDublinBus';
    subject = 'Somebody has installed SlackDublinBus on SLack ✔';
  }
  var mailOptions = {
      from: '" Slack Dublin Bus 🚌" <slackdublinbus@gmail.com>', // sender address
      to: 'johnkeanejnr@gmail.com', // list of receivers
      subject: subject, // Subject line
      text: body, // plaintext body
      html: '<b>Hello John, ' + team + ' have installed SlackDublinBus</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3001!');
});


app.get('/auth', function (req, res) {
  if(req.query.error){
    sendEmailToJohn('CANCELLED AT LAST MINUTE');
    res.redirect('http://slackdublinbus.xyz/#/cancel');
  }else{
    axios.get('https://slack.com/api/oauth.access', {
            params: {
              client_id: '84539294599.84589472165',
              client_secret:'7165aa57021d6e65d5291c5eb358486d',
              code:req.query.code
            }
          })
        .then(function (response) {
            console.log(response.data);
            sendEmailToJohn(response.data.team_name);
            res.redirect('http://slackdublinbus.xyz/#/thanks');
        })
        .catch(function (error) {
            console.log(error);
        });
      }

});

app.post('/bus', function (req, res) {

  if (req.body.text.toLowerCase() == 'help'){
    res.send({text:'👋  Hi! John here to help, I was waiting on your call 🤗 ' + '\n' +
    'All you have to do is send me the following command: /bus <bus number> e.g /bus 45 and this will return all the buses 🚌 due at stop 🚏 45' + '\n' + 'You can narrow it down to the route like this' +
    ' /bus 45 <bus route> like /bus 45 12 . This will return all the #12 buses 🚌 due at stop 🚏 45! Hope this helps 😎'});
  }

	var busAndRouteText = req.body.text.split(" ");
    var routeId = '';
    var busStopNumber = '';
    var busAndRoute = false;
    console.log('HI SELINA: ' + busAndRouteText)
    if(busAndRouteText.length > 1){
    	busStopNumber = busAndRouteText[0];
    	routeId = busAndRouteText[1];
    	busAndRoute = true;
    }else{
    	busStopNumber = req.body.text;
    }
	var busStopName = '';
	var busStopEmoji = ':busstop:';
	var busEmoji = ':bus:';
	var messageForSlack = '';
	var urlToUse = '';
	var weather = 'Check out the weather --> ';
	var urlJustBus = 'http://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid='+ busStopNumber +'&format=json';
	var urlBusAndRoute = 'http://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid='+ busStopNumber +'&routeid=' + routeId + '&format=json';
	if(busAndRoute){
		urlToUse = urlBusAndRoute;
	}else{
		urlToUse = urlJustBus;
	}

	axios.get('https://data.dublinked.ie/cgi-bin/rtpi/busstopinformation?stopid='+ busStopNumber +'&format=json')
	  .then(function (response) {
	  		busStopName = response.data.results[0].shortname;
	  		axios.get('https://api.darksky.net/forecast/09324a44567189a816d083eabbc01184/'+ response.data.results[0].latitude + ',' + response.data.results[0].longitude)
				  .then(function (response) {
				  	switch(response.data.currently.icon){
				  		case 'clear-day':
				  				weather += ':sunny:'
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
				  		case 'partly-cloudy-day':
				  				weather += ':mostly_sunny:'
				  			break;
				  		case 'partly-cloudy-night':
				  				weather += ':crescent_moon:'
				  			break
				  		default:
				  			''
				  	}
				  	weather += ' ' + response.data.currently.summary;
				  	weather += ' :thermometer:' + Math.round(((response.data.currently.apparentTemperature - 32) * .5556))  + '°C - <https://darksky.net|Powered By Dark Sky> ';
				    axios.get(urlToUse)
							.then(function (response) {
								if(busAndRoute)
								{
									messageForSlack = "Hey " + req.body.user_name + " Here's the :bus: #"+ routeId + " buses due at " + busStopEmoji + ' ' + busStopName + '\n';
								}else{
									messageForSlack = "Hey " + req.body.user_name + " Here's the buses due at " + busStopEmoji + ' ' + busStopName + '\n';
								}
								response.data.results.map(function(bus){
									var timeMeasurement = 'minutes';
									var prefix = 'in';
									if(bus.departureduetime == 'Due'){
										timeMeasurement = '';
										prefix = 'is';
									}else if(bus.departureduetime == "1"){
										timeMeasurement = 'minute';
									}
									messageForSlack += busEmoji + ' #' + bus.route + ' ' + prefix + ' ' + bus.departureduetime + ' ' + timeMeasurement +'\n';
								})
								messageForSlack += '\n' + weather;
								res.send({text:messageForSlack});
							})
							.catch(function (error) {
								res.send({text:'Oh Poop :poop:, somedays us bots get out of bed on the wrong side, that or the Dublin Bus API is down...or maybe, just maybe you didn\'t provide valid data'});
							});
				  })
				  .catch(function (error) {
				    res.send({text:'Hot Dog :hotdog:, somthing went wrong with the weather and then done screwed everything else up'});
				  });
	  })
	  .catch(function (error) {
	    res.send({text:'Oh Poop :poop:, somedays us bots get out of bed on the wrong side, that or the Dublin Bus API is down...or maybe, just maybe you didn\'t provide valid data'});
	  });
});
