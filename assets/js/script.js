/* GLOBAL VARIABLES */
// holds the current url 
var savedUrl=[];
var playlist = [];
var apiKey = 'AIzaSyAxnLvO9fU3ahdMfivmsavDwE4qCwhzBgE';
var trendList = [];
var nowPlaying = { date: '' , trend: '', song: '' , link: ''};
const CITY = 0;
const COUNTRY = 1;

// get 'playlist' from localStorage if available 
var loadPlaylist = function(){
    var data = window.localStorage.getItem('playlist');
    if (data){
        playList = JSON.parse(data);
    } else if (!data) {
        playlist = [];
    }
};


/* GET TRENDS FROM TRENDS24.IN  */

// gets the city trends page with string url
var getCity = function (string) {
	
    $.get('https://cors-anywhere.herokuapp.com/https://trends24.in' +string, function(response) {
		// Gets the current location name. 
		console.log(response);
        var currentLocation = $(response).find('#app-bar-toggle').first().text();
		console.log(currentLocation);
		// print the location name
		$("#city-name").text(currentLocation);
		
		// List of parsed trend list
		var parsedTrendList = []; // To global???

		// List of raw trend list
		var trendList = [];  // redundant if in global declarations???

		// Before print, remove previous trends
		$("#trending-ul").empty();

		// prints 10 trending terms to parsedTrend array
		for (var i = 1; i < 11; i++) {
			var trend = $(response).find('#trend-list > div:nth-child(1) > ol > li:nth-child(' + i +') > a').text();
			
			// parse the trend
			parsedTrend = parseTrends(trend);
            console.log(parsedTrend);
			
			// collects the trend list
			parsedTrendList.push(parsedTrend);
			trendList.push(trend);
            console.log(trendList)
			// print to HTML
			createTrendListHTML(trend);
		};

		// Before print, remove previous city
		$("#city").empty();
		
		// number of available locations
		var locationLength = $(response).find('.suggested-locations__list li').length;
		
		$("#city").append("<option id=''>...</option>");
		// prints the drop down list of locations
		for (var i = 1; i <= locationLength; i++) {

			// location name
			var location = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').text();
			
			// location url
			var locationUrl = $(response).find('.suggested-locations__list li:nth-child('+ i+') > a').attr('href');
			
			// print to HTML
			createLocationHTML(location, locationUrl,CITY);
		}

		// by default, print the searched-trend by the most popular trend
		$("#searched-trend").text("Top Trending Topic");

	});
}


/* retrieval of trending twitter topics <<<  SHAWN'S CODE 
var getTrends = function(city, country){
    $.get('https://cors-anywhere.herokuapp.com/https://trends24.in/' + country + '/'+ city +'/', function(response) {  
        trendList = [];
        for (var i = 1; i < 11; i++) {
            var trend = $(response).find('#trend-list > div:nth-child(1) > ol > li:nth-child(' + i +') > a').text();
            console.log(trend);
            trendList.push(trend)
        };
        console.log(trendList);
    });
};


// render twitter trends to DOM
var renderTrends = function() {
    var trendListEl = document.querySelector('#trending ul');
    trendListEl.innerHTML = "";
    for (var i = 0; i < trendList.length; i++) {
        var listItem = document.createElement('li');
        listItem.className = 'list-item tag-list';
        listItem.textContent = trendList[i];
        trendListEl.appendChild(listItem);
    };
    console.log(trendListEl.innerHTML);
}

*/

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


/* LOCATIONS CODE */
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

// save location to localStorage
var saveCurrentLocation = function () {
  localStorage.setItem("currentLocation", JSON.stringify(savedUrl));
};

// loads location from localStorage
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

// renders the drop-down list of locations
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
	$("#city").append("<option id=''>...</option>");
};

// dynamic changes to city droplist
$("#country").change(function (event) {

	// get the country url
	var selectedCountryUrl = $("#country option:selected").attr('id');

	// print the city droplist with the country url above
	$.get('https://cors-anywhere.herokuapp.com/https://trends24.in/' + selectedCountryUrl, function(response) {
		// remove previous city lists
		$("#city").empty();
		
		// number of available locations
		var locationLength = $(response).find('.suggested-locations__list li').length;
		
		$("#city").append("<option id=''>...</option>");
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

/* YOUTUBE SEARCH API & RENDER TO DOM */

//render YouTube video to the DOM
var renderMedia = function(youTubeId){
    var ytDiv = document.querySelector('#youtube-video');
    ytDiv.innerHTML = '<iframe src="https://www.youtube.com/embed/' + youTubeId + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}

// api call to music service (YouTube or Spotify) to find media for returned songs
var fetchYoutube = function(term) {
    fetch(
        'https://www.googleapis.com/youtube/v3/search'
        + '?part=snippet&maxResults=25'
        + '&q=' + term
        + '&key=' + apiKey
    )
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var youTubeId = response.items[0].id.videoId;
        var youTubeBaseUrl = 'https://www.youtube.com/watch?v='
        var result = youTubeBaseUrl + youTubeId;
        nowPlaying.link = result;
        console.log(result);
        renderMedia(youTubeId);
        
    })
}

/* SEARCH FOR SONGS WITH A TREND TERM */
// function to search and return songs from musixmatch api
function findSong(term) {
    var searchTerm = parseTrends(term);
    console.log(searchTerm);
    nowPlaying.trend = searchTerm;
    fetch(
        'https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.search?apikey=b25dc0cb4ca787de37dc0e3f1137fe5f&f_has_lyrics&q_lyrics=' + searchTerm + '&f_lyrics_language=en&s_track_rating'
    ).then(function(response) {
        return response.json();
    })
    .then(function(response) {
        // returns the first track in an array of tracks '[0]'
        var songObj = response.message.body.track_list[0].track; 
        var songName = songObj.track_name;
        var artistName = songObj.artist_name;
        console.log(songName, artistName);
        var result = songName + " song by " + artistName;
        nowPlaying.song = result;
        console.log(result);
        //fetchYoutube(result);
    }).catch(function(error) {
        console.log("We couldn't find a song with that term in it. Please try again!");
    });;
};
                                             



/* PLAYLIST MANAGEMENT */
// save playlist to local storage
var savePlaylist = function() {
    window.localStorage.setItem('playlist', JSON.stringify(playlist));
}


// save item to playlist & update localStorage
var resultToPlaylist = function() {
    var date = moment();
    nowPlaying.date = date.format('dd/mm/yyyy');
    playlist.push(nowPlaying);
    savePlaylist();
}


/* EVENT LISTENERS/HANDLERS */

/* event listeners <<< change to jquery!!!
document.querySelector('#trending ul').addEventListener('click', function(){
    var searchTerm = this.closest('.tag-list').textContent;
    nowPlaying.trend = searchTerm;
    var song = findSong(searchTerm);
});
*/


// event handler for selecting locations
$("#city-form").submit(function (event) {
	// disable refresh
	event.preventDefault();

	// grab the url
	var selectedCountry = $("#country option:selected").attr('id');
	var selectedCity = $("#city option:selected").attr('id');

	// check if city is selected
	if (selectedCity === '') {
		getCity(selectedCountry);
		savedUrl[0] = selectedCountry;
	} 
	else {
		getCity(selectedCity);
		savedUrl[0] = selectedCity;
	}
	saveCurrentLocation();

});


// event handler for selecting trending topics
$("#trending").on("click", function(event){

	// prints the clicked trending topics
	$("#searched-trend").text( event.target.id);
    var songTerm = event.target.id;
    findSong(songTerm);
});

// this function should be only called once when the website is loaded
var pageLoad = function () {

	// loads the data from localStorage to the global array variable, 'savedUrl'
	loadCurrentLocation();

	// print the country droplist
	createCountryHTML();

	// prints the page
	// argument: string url
	getCity(savedUrl[0]);
};


// call this function when the website is loaded
pageLoad();