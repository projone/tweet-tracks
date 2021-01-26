function onClientLoad() {
    gapi.client.setApiKey('AIzaSyCPDGuiXx8MypYqldnR20-0zTfTK3l8Kkk');
    gapi.client.load('youtube', 'v3', function () {
        search();
    });
}

// AIzaSyCPDGuiXx8MypYqldnR20-0zTfTK3l8Kkk

//function onYouTubeApiLoad() {
//}
 
// search on click
function search() {
    var query = document.getElementById('query').value;
    var q = query;
    // JavaScript client  to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        q: query,
        part: 'snippet'
    });
    // Send request, call on search function
    request.execute(onSearchResponse);
}
//execute search request
function onSearchResponse(response) {
    var responseString = JSON.stringify(response, '', 2);
    document.getElementById('response').innerHTML = responseString;
}



