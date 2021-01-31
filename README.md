# Tweet Tracks
Plays a song that has a trending topic from Twitter in the lyrics.

<!-- edit this part -->
## Screenshot of the webpage
![Alt text](./assets/images/screenshot.png?raw=true "Screenshot")

## Description
- This project is a purely front-end web application that finds a list of trending topics from Twitter by user's desired location and plays a song from YouTube that has the user's choice of topic in the lyrics.
- Webscraped trends24 website to get the trending topics from Twitter.
- Used Musixmatch API to search for a song that has the trending topic in the lyrics.

<!-- NOT SURE IF YOU WANT TO KEEP THE YOUTUBE PLAYLIST PART -->
- Utilized Youtube API to play the song and save it to the user's Youtube playlist.

<!-- PLEASE EDIT THIS PART  I'M NOT SURE IF YOU WANT TO USE YOUTUBE PLAYLIST -->
## How to Run
[Prerequisite]
- YouTube Developer Keys (See: https://developers.google.com/youtube/v3/getting-started) 

[Installation]
1. Clone the repository: git clone
https://github.com/projone/tweet-tracks.git
2. Go to assets folder
3. Go to js folder
4. Go to script.js file and replace Youtube keys for yours
```javascript

var apiKey = 'AIzaSyAxnLvO9fU3ahdMfivmsavDwE4qCwhzBgE';

```
5. Go to https://projone.github.io/tweet-tracks/

## How to use
- It's very simple to use. Under SELECT YOUR CITY box, select your choice of location, either a country or a city and click the button GO to search for trending topics.
- Under TRENDING IN box, click on one of the trending topics to play a song.
- If you like to save the song to your playlist, click ADD TO PLAYLIST button.
- Press NEW SONG button to play a new song.

