// AMELIA'S API KEY
var apiKey = 'AIzaSyAxnLvO9fU3ahdMfivmsavDwE4qCwhzBgE';

var searchBtn = document.getElementById("search");
var searchTerm = document.querySelector("#searchTerm").value;


var fetchYoutube = function() {
    fetch(
        'https://www.googleapis.com/youtube/v3/search'
        + '?part=snippet&maxResults=25'
        + '&q=' + searchTerm
        + '&key=' + apiKey
    )
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log(response);
    })
}

searchBtn.addEventListener("click", fetchYoutube);