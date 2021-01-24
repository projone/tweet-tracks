// declare global variables


// get 'playlist' from localStorage if available 


// get user location with navigator.geolocation.getCurrentPosition()


// twitter authentication and retrieval of trending topics


// render twitter trends to DOM


// function to search and return songs from musixmatch api


// api call to music service to find media for returned songs
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
        return result
    });
};


// save result to local storage


// event listeners