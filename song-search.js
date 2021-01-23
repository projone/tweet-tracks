/* 

Twitter API Key:
nLlSrkQQ7qj9EUBX2X901hafh

Twitter Secret Key:
aDtTs30fDFSZ28UudVcEssdwjDcZvih8CuLdcO4EYpkoOPMMqM

Bearer Token:
AAAAAAAAAAAAAAAAAAAAAJIdMAEAAAAAsS6hDFF7SfmOgkqd8Z6lGcLanxI%3DqQpcJ2413kj5QxZ360Lc6kRBX5wIZ8ug9ty98L8vf51UwYYfa9



musixmatch api key
b25dc0cb4ca787de37dc0e3f1137fe5f

musixmatch base url
https://api.musixmatch.com/ws/1.1/

http://api.musixmatch.com/ws/1.1/track.search?apikey=b25dc0cb4ca787de37dc0e3f1137fe5f&q_lyrics=butterfly

songTitle = response.message.body.track_list[0].track_name
artistName = response.message.body.track_list[0].artist_name

more concise:

songObj = response.message.body.track_list[0]

songName = songObj.track_name
artistName = songObj.artist_name

*/

/* Fetch call Version 1.0 */

// add logic to remove 'karaoke' and 'instrumental'

// remove anything between and including parenthesis:       string.replace(/ *\([^)]*\) */g, "")


function findSong() {
  event.preventDefault();
  var searchTerm = document.querySelector('#searchTerm').value;
  fetch(
    'https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.search?apikey=b25dc0cb4ca787de37dc0e3f1137fe5f&f_has_lyrics&q_lyrics=' + searchTerm + '&f_lyrics_language=en&s_track_rating'
  ).then(function(response) {
     return response.json();
   })
   .then(function(response) {
     console.log(response);
     var songObj = response.message.body.track_list[0].track; // returns the first track in an array of tracks '[0]'
     var songName = songObj.track_name;
     var artistName = songObj.artist_name;
     console.log(songName, artistName);
     var results = document.querySelector('.results')
     var result = document.createElement('p');
     result.textContent = songName + ' ' + artistName;
     results.appendChild(result); 
     
   });
};


document.querySelector('.btn').addEventListener('click', findSong);