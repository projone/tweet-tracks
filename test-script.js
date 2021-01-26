
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}


function onYouTubeApiLoad() {
    gapi.client.setApiKey('rAIzaSyCPDGuiXx8MypYqldnR20-0zTfTK3l8Kkk');
}
 
// search on click
function search() {
    var query = document.getElementById('query').value;
    // JavaScript client  to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        q:query
    });
    // Send request, call on search function
    request.execute(onSearchResponse);
}
//execute search request
function onSearchResponse(response) {
    var responseString = JSON.stringify(response, '', 2);
    document.getElementById('response').innerHTML = responseString;
}


