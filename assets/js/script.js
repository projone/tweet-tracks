/* GLOBAL VARIABLES */
// holds the current url 
// original cors anywhere url: https://cors-anywhere.herokuapp.com/
// shawn's API AIzaSyCKJtjAkL7b-95OgsumCsg-XTvHtoqppYA
var savedUrl=[];
var playlist = [];
var apiKey = 'AIzaSyCPDGuiXx8MypYqldnR20-0zTfTK3l8Kkk';
var trendList = [];
var nowPlaying = {trend: '', song: '' , link: ''};
const CITY = 0;
const COUNTRY = 1;
var newCount = 0;
var today = moment();
var trendsLoaderEl = document.querySelector("#trendsLoader");
var videoLoaderEl = document.querySelector("#videoLoader");
var expandBtn = document.querySelector("#expand");

/* GET TRENDS FROM TRENDS24.IN  */

// gets the city trends page with string url
var getCity = function (string) {
    trendsLoaderEl.classList.remove("d-none");
	
    $.get('https://boiling-cove-20762.herokuapp.com/https://trends24.in' +string, function(response) {
		// Gets the current location name. 
		//console.log(response);
        var currentLocation = $(response).find('#app-bar-toggle').first().text();
		//console.log(currentLocation);
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
            //console.log(parsedTrend);
			
			// collects the trend list
			parsedTrendList.push(parsedTrend);
			trendList.push(trend);
            //console.log(trendList)
			// print to HTML
			createTrendListHTML(trend);
        };

        // toggle loader icon
        trendsLoaderEl.classList.add("d-none");

		// Before print, remove previous city
		$("#city").empty();

        // number of available locations
		var locationLength = $(response).find('.suggested-locations__list li').length;
		
        $("#city").append("<option id=''>Nationwide</option>");

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

// prints the trend list
var createTrendListHTML = function (string) {
    $("#trending-ul").append("<li class='tag-list'>" + "<a href='#searched-trend' id='" + string + "'>" + string + "</a>" + "</li>");
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
var parseLocation = function(string) {
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
	$.get('https://boiling-cove-20762.herokuapp.com/https://trends24.in/', function(response) {
		
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
	$.get('https://boiling-cove-20762.herokuapp.com/https://trends24.in/' + selectedCountryUrl, function(response) {
		// remove previous city lists
		$("#city").empty();
		
		// number of available locations
		var locationLength = $(response).find('.suggested-locations__list li').length;
		
		$("#city").append("<option id=''>Nationwide</option>");
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
    // toggle loader icon
    videoLoaderEl.classList.add("d-none");
}

// api call to YouTube to find media for returned songs
var fetchYoutube = function(term) {
    // show loader
    videoLoaderEl.classList.remove("d-none");

    fetch(
        'https://www.googleapis.com/youtube/v3/search'
        + '?part=snippet&maxResults=25'
        + '&q=' + term
        + '%20-karaoke&key=' + apiKey
    )
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var youTubeId = response.items[0].id.videoId;
        var youTubeBaseUrl = 'https://www.youtube.com/watch?v='
        var result = youTubeBaseUrl + youTubeId;
        nowPlaying.link = youTubeId;
        renderMedia(youTubeId);
    });
};

/* SEARCH FOR SONGS WITH A TREND TERM */
// function to search and return songs from musixmatch api

function findSong(term) {
    var searchTerm = parseTrends(term);
    nowPlaying.trend = searchTerm;
    fetch(
        'https://boiling-cove-20762.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.search?apikey=b25dc0cb4ca787de37dc0e3f1137fe5f&f_has_lyrics&q_lyrics=' + searchTerm + '&f_lyrics_language=en&s_track_rating&s_artist_rating'
    ).then(function(response) {
        return response.json();
    })
    .then(function(response) {
        for (var i = 0; i < 10; i++){
            if (response.message.body.track_list[i].track.explicit === 0){
                var songObj = response.message.body.track_list[i].track; 
                var songName = songObj.track_name;
                var artistName = songObj.artist_name;
                var formatted = songName + " song by " + artistName;
                var result = formatted.replace(/Karaoke/g, "");
                newCount = i+1;
                //console.log(result);
                nowPlaying.song = result;
                //console.log(result);
                fetchYoutube(result);
                break;
            };    
        };
        
    }).catch(function(error) { 
        $('#youtube-video').html("<p>We couldn't find a song with that term in it. Please try again!</p>");
    });;
};
                                             
var newSong = function(trend){
    fetch(
        'https://boiling-cove-20762.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.search?apikey=b25dc0cb4ca787de37dc0e3f1137fe5f&f_has_lyrics&q_lyrics=' + trend + '&f_lyrics_language=en&s_track_rating&s_artist_rating'
    ).then(function(response) {
        return response.json();
    }).then(function(response) {
        var songObj = response.message.body.track_list[newCount].track;
        var songName = songObj.track_name;
        var artistName = songObj.artist_name;
        var formatted = songName + " song by " + artistName;
        var result = formatted.replace(/Karaoke/g, "");
        console.log(result);
        nowPlaying.song = result;
        console.log(result);
        newCount++;
        fetchYoutube(result);
    });
};



/* PLAYLIST MANAGEMENT */

// get saved playlists from localStorage
var loadSavedPlaylists =function(){
    var data = window.localStorage.getItem('saved-playlists');
    if (data){
        savedPlaylists = JSON.parse(data);
    } else if (!data) {
        savedPlaylists = {};
    }
};

// add playlist to savedPlaylists and save to localStorage
var savePlaylist = function(playlist) {
    var date = today.format('DD/MM/YYYY');
    savedPlaylists[date] = playlist;
    window.localStorage.setItem('saved-playlists', JSON.stringify(savedPlaylists));
}

// save item to current playlist & render to DOM
var resultToPlaylist = function() {
    playlist.push(nowPlaying);
    savePlaylist(playlist);
    renderPlaylist(playlist);
}

// 
var renderSavedPlaylists = function(){
    loadSavedPlaylists();
    $("#playlist-ul").html("");
    // alter to render first the date, then the songs
    var dateKeys = Object.keys(savedPlaylists);
    for (var i =0; i < dateKeys.length; i++) {
        $("#playlist-ul").append( "<li class='list-item playlist-item play-date'id='"+ dateKeys[i] +"'>" + dateKeys[i] + "</li>");
    };
    $("#playlist-ul").off("click");
    $("#playlist-ul").on("click", "li", function(event) {
        var date = event.target.id;
        $('#date').text(date);
        var datePlaylist = savedPlaylists[date];
        renderPlaylist(datePlaylist);
    });
};

// render playlist
var renderPlaylist = function(playlist) {
    $("#playlist-ul").html("");
    for (var i = 0; i < playlist.length; i++) {
        // youtube id daved as data-ytid
        $("#playlist-ul").append( "<li class='list-item playlist-item'><a class='a-light' id='" + playlist[i].link + "' target='_blank'>" + playlist[i].song + "</a></li>");
    };
    $("#playlist-ul").off("click");
    $("#playlist-ul").on("click", "a", function(event) {
        var youTubeId = event.target.id;
        renderMedia(youTubeId);
    });
};

var clearPlaylist = function() {
    savedPlaylists = {};
    window.localStorage.setItem('saved-playlists', JSON.stringify(savedPlaylists));
    renderSavedPlaylists();
    $("#date").text(moment().format('DD/MM/YYYY'));
};


/* EVENT LISTENERS-HANDLERS */


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
$("#trending").on("click", "a", function(event){
    // prints the clicked trending topics
    $("#searched-trend").text(event.target.id);
    // initiates musixmatch search
    var songTerm = event.target.id;
    nowPlaying = {trend: '', song: '' , link: ''};
    findSong(songTerm);
});

// event listener for 'our team' section
// click event for mobile
$("#expand").on("click", function () {
    $(".appear").toggleClass("opacity-0");
})

// event listener for 'add to playlist' button 
$("#add-to-playlist").on("click", resultToPlaylist);

// clear saved playlists
$("#clear-playlist").on("click", clearPlaylist);

// change song event listener
$("#change-song").on("click", function() {
    newSong(nowPlaying.trend);
});

// view older playlists listener
$("#get-saved").on("click", renderSavedPlaylists);



// this function should be only called once when the website is loaded
var pageLoad = function () {
	// loads the data from localStorage to the global array variable, 'savedUrl'
	loadCurrentLocation();

	// print the country droplist
	createCountryHTML();

	// prints the page
	// argument: string url
	getCity(savedUrl[0]);
    
    //set today's date
    $("#date").text(moment().format('DD/MM/YYYY'));
    
    // load any saved playlists from localStorage
    loadSavedPlaylists();
};


// call this function when the website is loaded
pageLoad();
