// holds the current url 
var savedUrl=[];

const CITY = 0;
const COUNTRY = 1;

// prints the page with string url
var getCity = function (string) {
	$.get('https://cors-anywhere.herokuapp.com/https://trends24.in' +string, function(response) {
		// Gets the current location name. 
		var currentLocation = parseLocation($(response).find('#app-bar-toggle').first().text());
		// print the location name
		$("#city-name").text(currentLocation);
		
		// List of parsed trend list
		var parsedTrendList = [];

		// List of raw trend list
		var trendList = [];

		// Before print, remove previous trends
		$("#trending-ul").empty();

		// prints 10 trending trends
		for (var i = 1; i < 11; i++) {
			var trend = $(response).find('#trend-list > div:nth-child(1) > ol > li:nth-child(' + i +') > a').text();
			
			// parse the trend
			parsedTrend = parseTrends(trend);
			
			// collects the trend list
			parsedTrendList.push(parsedTrend);
			trendList.push(trend);

			// print to HTML
			createTrendListHTML(trend);
		};

		// by default, print the searched-trend by the most popular trend
		$("#searched-trend").text(trendList[0]);

		if (string !== "") {
			// before print, remove previous options of location names
			$("#city").empty();

			// number of available locations
			var locationLength = $(response).find('.suggested-locations__list li').length;
			
			// prints the drop down list of locations
			for (var i = 1; i <= locationLength; i++) {

				// location name
				var location = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').text();
				
				// location url
				var locationUrl = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').attr('href');
				
				// print to HTML
				createLocationHTML(location, locationUrl, CITY);
			}
		}

	});
}

// save to localStorage
var saveCurrentLocation = function () {
  localStorage.setItem("currentLocation", JSON.stringify(savedUrl));
};

// loads from localStorage
var loadCurrentLocation = function () {

	// saved url
	var saved = JSON.parse(localStorage.getItem("currentLocation"));

	// if nothing is saved, empty the variable
	if(!saved) {
		savedUrl = [''];
		return false;
	}

	// loads the saved url
	savedUrl= saved;
};


// prints the drop down list of locations
var createLocationHTML = function (location, locationUrl, cityOrCountry) {
	if (cityOrCountry === CITY) {
		$("#city").append("<option id='" + locationUrl + "'>" + location + "</option>");
	}
	else {
		$("#country").append("<option id='" + locationUrl + "'>" + location + "</option>");
	}
};

var createCountryHTML = function () {
	$.get('https://cors-anywhere.herokuapp.com/https://trends24.in/', function(response) {
		
		$("#country").empty();
		// number of available locations
		var locationLength = $(response).find('.suggested-locations__list li').length;
		
		// prints the drop down list of locations
		for (var i = 1; i <= locationLength; i++) {

			// location name
			var location = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').text();
			
			// location url
			var locationUrl = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').attr('href');
			
			// print to HTML
			createLocationHTML(location, locationUrl,COUNTRY);
		}
	});

};

// prints the trend list
var createTrendListHTML = function (string) {
	$("#trending-ul").append( "<li class='list-item tag-list' id='" +string + "'>" + string + "</li>");
};

// converts the trending topics more readable
// for example, '#OhMyGod' -> 'Oh My God'
var parseTrends = function (string) {
	var result;
	var temp = string;

	// if the string starts with hastag, remove it
	if (string.startsWith('#')) {
		temp = temp.substring(1);
	}

	// check if non alphaneumeric values such as other languages
	if (!temp.match(/^[A-Za-z\d\s\w]+$/)) {
		result = temp;
	}
	else {
		//break the string if all in one word
		var arr = temp.match(/[A-Z][a-z]+/g);

		// joins the broken string
		if(arr) {
			result = arr.join(' ');
		}
		else {
			result = temp;
		}

	}
	return result;
};

// Gets the current location name. 
var parseLocation=function(string) {
	var result;

	// check if the current location name has a whitespace to find out if the current location is a city
	var sIndex = string.indexOf(' ');

	// checks if this is a city
	if (sIndex >= 0) {
		// only grab the city name, not the country 
		result = string.slice(0,sIndex-1);
	}
	// this is a country
	else {
		result = string;
	}
	return result;
};

// event handler for selecting locations
$("#city-form").submit(function (event) {
	// disable refresh
	event.preventDefault();

	// grab the url
	var selectedCity = $("#country option:selected").attr('id');
	
	// print the page with world wide trending topcis
	if (selectedCity === "world-wide"){
		getCity('');
		savedUrl[0] = '';
	} 
	// print the page with desired location trending topics
	else {
		getCity(selectedCity);
		savedUrl[0] = selectedCity;
	}
	// save the current location url
	saveCurrentLocation();
});

$("#country").change(function (event) {
	var selectedCountryUrl = $("#country option:selected").attr('id');

	$.get('https://cors-anywhere.herokuapp.com/https://trends24.in/' + selectedCountryUrl, function(response) {
		$("#city").empty();
		// number of available locations
		var locationLength = $(response).find('.suggested-locations__list li').length;
		
		// prints the drop down list of locations
		for (var i = 1; i <= locationLength; i++) {

			// location name
			var location = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').text();
			
			// location url
			var locationUrl = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').attr('href');
			
			// print to HTML
			createLocationHTML(location, locationUrl,CITY);
		}
	});
});

// event handler for selecting trending topics
$("#trending").on("click", function(event){

	// prints the clicked trending topics
	$("#searched-trend").text( event.target.id);
});


// this function should be only called once when the website is loaded
var pageLoad = function () {

	// loads the data from localStorage to the global array variable, 'savedUrl'
	loadCurrentLocation();

	createCountryHTML();

	// prints the page
	// argument: string url
	getCity(savedUrl[0]);
};


// call this function when the website is loaded
pageLoad();

