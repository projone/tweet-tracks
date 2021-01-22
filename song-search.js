/* 
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


function findSong() {
  var searchTerm = document.getElementById('searchTerm').value;
  fetch(
    'http://api.musixmatch.com/ws/1.1/track.search?apikey=b25dc0cb4ca787de37dc0e3f1137fe5f&q_lyrics=' + searchTerm
  ).then(function(response) {
     return response.json();
   })
   .then(function(response) {
     var songObj = response.message.body.track_list[0]; // returns the first track in an array of tracks '[0]'
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