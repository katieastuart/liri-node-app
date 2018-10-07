// require statements and variables
require("dotenv").config();

var request = require("request");

var keys = require("./keys.js");

var axios = require("axios");

var Spotify = require('node-spotify-api');

var fs = require("fs")

var moment = require('moment');

// user input variables
var liri_command = process.argv[2]
var liri_search = process.argv.slice(3).join(" ");

    // console.log(liri_command)
    // console.log(liri_search)

//object of liri functions
var liriFunctions = {
    liriConcertThis: function() {

        // default search terms
        if (liri_search === "") {
            liri_search = "Backstreet Boys"
        }

        // search URL
        var url = "https://rest.bandsintown.com/artists/" + liri_search + "/events?app_id=codingbootcamp"

        // api call
        axios.get(url)
            .then(function (response) {
 
                // array of data
                var concertData = [
                    "Venue Name: " + response.data[0].venue.name,
                    "Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + ", " + response.data[0].venue.country,
                    "Date: " + moment(response.data[0].datetime).format('MMMM Do YYYY, h:mm a')
                ].join("\n\n");
         
                // print data
                console.log(concertData)

                // append data to log.txt
                logData(concertData)
            })

            // If the code experiences any errors it will log the error to the console.
            .catch(function (error) {
                console.log(error);
            });
    },
    liriSpotifyThis: function() {
        // create new object with api IDs
        var spotify = new Spotify({
        id: keys.id,
        secret: keys.secret
        });

        // default search terms
        if (liri_search === "") {
            liri_search = "The+Sign+Ace+of+Base"
        }
        
        // api call
        spotify.search({ type: 'track', query: liri_search, limit: 1 }, function(err, data) {

            // If the code experiences any errors it will log the error to the console.
            if (err) {
            return console.log('Error occurred: ' + err);
            }

            // array of data
            var songData = [
                "Artist: " + data.tracks.items[0].album.artists[0].name,
                "Song Name: " + data.tracks.items[0].name,
                "Preview URL: " + data.tracks.items[0].preview_url,
                "Album Name: " + data.tracks.items[0].album.name
            ].join("\n\n");

            // print data
            console.log(songData)

            // append data to log.txt
            logData(songData)
        });
    },
    liriMovieThis: function() {
        // default search terms
        if (liri_search === "") {
            liri_search = "Mr. Nobody"
        }

        // search URL
        var url = "http://www.omdbapi.com/?t=" + liri_search + "&y=&plot=short&apikey=trilogy"

        // api call
        request(url, function(error,response,body) {

            // If the code experiences any errors it will log the error to the console.
            if (!error && response.statusCode === 200) {

                // array of data
                var movieData = [
                    "Title: " + JSON.parse(body).Title,
                    "Year: " + JSON.parse(body).Year,
                    "IMDB Rating: " + JSON.parse(body).Ratings[0].Value,
                    "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value,
                    "Country where produced: " + JSON.parse(body).Country,
                    "Language: " + JSON.parse(body).Language,
                    "Plot: " + JSON.parse(body).Plot,
                    "Actors: " + JSON.parse(body).Actors
                  ].join("\n\n");
        
                // print data
                console.log(movieData)

                // append data to log.txt
                logData(movieData)
            }
        })
    }
};

// do-what-it-said function
function doWhatItSays() {
    if (liri_command === "do-what-it-says") {
        
        // reads random.txt file
        fs.readFile("random.txt", "utf8", function(error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
              return console.log(error);
            }
        
                // console.log(data);
          
            // split data at the commas into an array
            var dataArr = data.split(",");
          
                // console.log(dataArr);

            // populate liri_command and liri_search with values from text file array
            liri_command = dataArr[0]
            liri_search = dataArr[1]

                // console.log(liri_command)
                // console.log(liri_search)

            // if statements to determine which function to run
            if (liri_command === "concert-this") {
                liriFunctions.liriConcertThis()
            }

            if (liri_command === "spotify-this-song") {
                liriFunctions.liriSpotifyThis()
            }

            if (liri_command === "movie-this") {
                liriFunctions.liriMovieThis()
            }
          
        });
    }
}

// function to log results to log.txt
function logData(data) {
    var divider =
    "\n------------------------------------------------------------\n\n";
    
    fs.appendFile("log.txt", data + divider, function(err) {
        if (err) throw err;
      });
}

// liri function to run program
function liri() {
    if (liri_command === "concert-this") {
        liriFunctions.liriConcertThis()
    }

    if (liri_command === "spotify-this-song") {
        liriFunctions.liriSpotifyThis()
    }

    if (liri_command === "movie-this") {
        liriFunctions.liriMovieThis()
    }

    if (liri_command === "do-what-it-says") {
        doWhatItSays()
    }
}

// call liri function
liri()












