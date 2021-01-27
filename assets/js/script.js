// declare global variables
var playlist = [];
var apiKey = 'AIzaSyAxnLvO9fU3ahdMfivmsavDwE4qCwhzBgE';

// get 'playlist' from localStorage if available 
var loadPlaylist = function(){
    var data = window.localStorage.getItem('playlist');
    if (data){
        playList = JSON.parse(data);
    } else if (!data) {
        playlist = [];
    }
};

// twitter authentication and retrieval of trending topics
var getTrends = funciton(){
    $.get('https://cors-anywhere.herokuapp.com/https://trends24.in/canada/toronto/', function(response) {
        var trendList = [];
        for (var i = 1; i < 11; i++) {
            var trend = $(response).find('#trend-list > div:nth-child(1) > ol > li:nth-child(' + i +') > a').text();
            console.log(trend);
            trendList.push(trend)
        };
        console.log(trendList);
    });
}


// render twitter trends to DOM


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
        var result = songName + " " + artistName;
        fetchYoutube(result);
    });
};
                                             
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
        console.log(response);
    })
}

// save playlist to local storage
var savePlaylist = function() {
    window.localStorage.setItem('playlist', JSON.stringify(playlist));
}
    
// save item to playlist & update localStorage
var ResultToPlaylist = function(trend, mediaLink) {
    var date = moment();
    var entry = {
        'date': date.format('dd/mm/yyyy'),
        'trend': trend,
        'link': mediaLink
    };
    playlist.push(entry);
    savePlaylist();
}

// event listeners
