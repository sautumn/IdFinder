import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http'

import './main.html';
import token from './accessToken.json';

var lat, long, data;

Template.latlong.events({
	//event selection
	'click button': function(event) {
		//prevent default submits
		event.preventDefault();

		// Get value from form element using jQuery id
		lat = $('#latitude').val();
		long = $('#longitude').val();

		request();

		//clear form
		$('#latitude').val('');
		$('#longitude').val('');
	}
});


//ajax request to get nearby locations based on lat and long
var request = function() { return $.get('https://api.instagram.com/v1/locations/search', {
		access_token: token['access_token'],
		lat: lat,
		lng: long
	},
	function(elem) {
		$('#list').val('');
		//get the data array from the get request object
		console.log(elem['data']);
		//call the getObj on the data array to append the name and id to the page
		getObj(elem['data']);
	}, 'jsonp');
};


var getObj = function(input) {
	var result = '';

	for (var i = 0, length = input.length; i < length; i++) {
		result = result.concat('<li>' + input[i]['name'] + ' : ' + input[i]['id'] + ' : ' + '<a href="https://www.instagram.com/explore/locations/' + input[i]['id'] + '">Instagram Link</a>' + '</li>');
	} 
	console.log(result);

	$('#list').append(result);
}

