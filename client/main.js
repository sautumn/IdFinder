import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http'

import './main.html';
import token from './accessToken.json';

var lat, long, data;

//ajax request to get nearby locations based on lat and long from codeAddress fn
var request = function() { return $.get('https://api.instagram.com/v1/locations/search', {
		access_token: token['access_token'],
		lat: lat,
		lng: long
	},
	function(elem) {
		$('#list').val('');

		//call the getObj on the data array to append the name and id to the page
		getObj(elem['data']);
	}, 'jsonp');
};

//takes in ig api call get result and goes over the array items and appends them to the page
var getObj = function(input) {
	var result = '';
	for (var i = 0, length = input.length; i < length; i++) {
		//build list of nearby places from instagram api
		result = result.concat('<li>' + input[i]['name'] + ' : ' + input[i]['id'] + ' : ' + '<a href="https://www.instagram.com/explore/locations/' + input[i]['id'] + '">Instagram Link</a>' + '</li>');
	}
	//add result from instagram api to page, id - list
	$('#list').append(result);
}

Template.googlemaps.events({
	//event selection
	'click #getCords': function(event) {
		//prevent default submits
		event.preventDefault();
		//call google api fn to get lat/long from address
		codeAddress();
	}
});

//init google api map call, retrieves address and autocomplete
var initialize = function() {
	var address = (document.getElementById('my-address'));
	var autocomplete = new google.maps.places.Autocomplete(address);
	autocomplete.setTypes(['geocode']);
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			return;
		}
		var address = '';
		if (place.address_components) {
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			].join(' ');
		}
	});
}

//retrieves lat and long and calls the GET request to use lat and long to get nearby places
var codeAddress = function() {
	geocoder = new google.maps.Geocoder();
	var address = document.getElementById("my-address").value;
	geocoder.geocode({
		'address': address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			lat = results[0].geometry.location.lat();
			long = results[0].geometry.location.lng();

			//call the GET to retrieve data from instagram api
			request();

		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

//sets up init on page load
google.maps.event.addDomListener(window, 'load', initialize);
