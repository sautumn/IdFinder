import { Meteor } from 'meteor/meteor';
import { cheerio } from 'meteor/mrt:cheerio';


Meteor.startup(function() {

	var promise = new Promise( (resolve, reject) => {
		//Get request to scrape the site
		HTTP.call('GET', 'https://www.instagram.com/explore/locations/265262816/', function(error, response) {
			resolve(response.content);
		})
	});

	Meteor.methods({
		getURL: function() {
			return promise;
		}
	})
});

