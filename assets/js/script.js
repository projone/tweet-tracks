// declare global variables
var playlist = [];
var trendList = [];
var nowPlaying = { date: '' , trend: '', song: '' , link: ''};

// get 'playlist' from localStorage if available 
var loadPlaylist = function(){
    var data = window.localStorage.getItem('playlist');
    if (data){
        playList = JSON.parse(data);
    } else if (!data) {
        playlist = [];
    }
};

// get user location with navigator.geolocation.getCurrentPosition()
/* function getLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var coords = [lat, lng];
        return coords;
    });
};
*/

// retrieval of trending twitter topics

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

// function to search and return songs from musixmatch api
function findSong(searchTerm) {
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
        var result = songName + " by " + artistName;
        nowPlaying.song = result
        return result
    });
};
                                             
// api call to music service (YouTube or Spotify) to find media for returned songs
// AMELIA'S API KEY
var apiKey = 'AIzaSyAxnLvO9fU3ahdMfivmsavDwE4qCwhzBgE';

//var searchBtn = document.getElementById("search");
//var searchTerm = document.querySelector("#searchTerm").value;


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
        console.log(response);
    })
}

//searchBtn.addEventListener("click", fetchYoutube);
/* render YouTube video to the DOM
var renderMedia = function(youTubeLink){
    var mediaEl = '';
    var ytDiv = document.querySelector('.youtube-video');
    ytDiv.appendChild(mediaEl);
}
*/

// save playlist to local storage
var savePlaylist = function() {
    window.localStorage.setItem('playlist', JSON.stringify(playlist));
}
    
// save item to playlist & update localStorage
var ResultToPlaylist = function() {
    var date = moment();
    nowPlaying.date = date.format('dd/mm/yyyy');
    playlist.push(nowPlaying);
    savePlaylist();
}

// event listeners
document.querySelector('#trending ul').addEventListener('click', function(){
    var searchTerm = this.closest('.tag-list').textContent;
    nowPlaying.trend = searchTerm;
    var song = findSong(searchTerm);
    // searchYT(song);
});