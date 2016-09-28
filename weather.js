var bodyParser = require('body-parser')
var axios = require('axios')

var Weather = {

	getWeather:function(latitude,longitude){
		return axios.get('https://api.darksky.net/forecast/09324a44567189a816d083eabbc01184/'+ response.data.results[0].latitude + ',' + response.data.results[0].longitude)
	},
	getEmoji:function(weather){
		var emoji = ''
		switch(weather){
				  		case 'clear-day':
				  				emoji = ':sunny:'
				  			break;
				  		case 'clear-night':
				  				emoji += ':full_moon:'
				  			break;
				  		case 'rain':
				  				emoji += ':rain_cloud:'
				  			break;
				  		case 'snow':
				  				emoji += ':snow_cloud:'
				  			break;
				  		case 'sleet':
				  				emoji += ':snow_cloud:'
				  			break;
				  		case 'wind':
				  				emoji += ':dash:'
				  			break;
				  		case 'fog':
				  				emoji += ':fog:'
				  			break;
				  		case 'cloudy':
				  				emoji += ':cloud:'
				  			break;
				  		case 'partly-cloudy':
				  				emoji += ':mostly_sunny:'
				  			break;
				  		case 'partly-cloudy-night':
				  				emoji += ':crescent_moon:'
				  			break
				  		default:
				  			''
				  	}

		return emoji;
	}
}

module.exports = Weather;