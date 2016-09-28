var bodyParser = require('body-parser')
var axios = require('axios')

var Buses = {

	getBusStopName:function(busStopNumber){
		console.log('hi')
			return axios.get('https://data.dublinked.ie/cgi-bin/rtpi/busstopinformation?stopid='+ busStopNumber +'&format=json');
	},
	getBuses:function(busStopNumber){
		 return axios.get('http://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid='+ busStopNumber +'&format=json');
	}


}

module.exports = Buses;