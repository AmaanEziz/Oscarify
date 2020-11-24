const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');           // set view engine for ejs 

app.listen(8080, () => {
    console.log('Movie app started on port: 8080');
});

// read Oscar CSV file
const fs = require('fs');
const Papa = require('papaparse');
const csvFilePath = 'the_oscar_award.csv'
const file = fs.createReadStream(csvFilePath);

const Oscar_record = [];
Papa.parse(file, {
  header: true,
  transformHeader: header => header.trim(),
  step: function(result) {
    Oscar_record.push(result.data)
  }
});


// Get request for UI search PAGE

app.get('/', (req, res) => {
    res.render('search');
});

// making get request for Result page to print out data to UI
app.get('/result', (req, res) => {

    var query = req.query.search;
    var url = 'https://www.omdbapi.com/?s=' + query + '&apikey=35711dae';
    request(url, (error, response, body) => {
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body)
            console.log(data);
            res.render('result', {data: data});
            console.log(data["Search"][0]["Title"]);
            console.log(data["Search"][0]["Year"]);
        }
    });
});

// Creat call OMDB API
const getMovieData = async (movie) => {
    try {
      var moviename = movie.toString().replace(/ /g,"+");
      const response = await fetch("http://www.omdbapi.com/?t=" + moviename + "&apikey=47175bcf");
      const json = await response.json();
      json.IMDBReviewsLink="https://www.imdb.com/title/" + json.imdbID;
      json.StreamingLink="https://streamvideo.link/getvideo?key=cmlinIufEwFXuZrA&video_id=" + json.imdbID;
      return json;
    } catch (error) {
      return error;
    }
};

//get data form Oscar.json file
const Oscar_record = require('./oscars.json');

// making function to return Singleton index movie

function getMovieByIndex(number){

    let filmname= Oscar_record[number].film;
    try {
        return getMovieData(filmname).then((data)=>{return data}); 
    } catch (error) {
        return error;
    }
}

// maknig function to return movies collection by Oscar Category

async function getMoviesByCategory(category, year){

    var movies_list =  [];
    for( var i = 0; i < Oscar_record.length; i++ ){

      var categorystring = Oscar_record[i].category.replace(/\s/g, '');  // to read white space for Json data
      var catergory_param = category.toUpperCase().replace(/\s/g, '');   // to convert param toUppercase and read space

      if(categorystring == catergory_param && Oscar_record[i].year_ceremony == year) {

        let OMDPinfo= await getMovieData(Oscar_record[i].film).then((data)=>{return data;});    // calling getMoviesData to get data from OMDB API

        let Oscar_dataset = Oscar_record[i];
        delete Oscar_dataset.ceremony;    
        delete Oscar_dataset.name;

        Oscar_dataset.imdbLink = OMDPinfo.IMDBReviewsLink;
        Oscar_dataset.streamingLink = OMDPinfo.StreamingLink;
        movies_list.push(Oscar_dataset);
     } else {
         return "There are no Oscar_reacord OR the enterd infomation is not correct!";
     }
    }
    return movies_list;
  }

  // SINGLETON: request by movie index
app.get('/movies/:index',(req,res)=>{ 
    getMovieByIndex(req.params.index)
    .then(data => {
        console.log(data);
        res.send(data);
    })

});

// making get request to Postman at endpoint http://localhost:8080/movies?category=actor&year_film=1927&winner=true
// Get single movies
app.get('/movies', (req, res) => {

    if(req.query) {
        Oscar_record.forEach ( (movies) =>{ 
            if(req.query.category == movies.category &
                req.query.year_film == movies.year_film &
                req.query.winner == movies.winner)
            {
                // make OMDB API call to get IMDB link 
                var url = 'https://www.omdbapi.com/?t=' + movies.film + '&apikey=35711dae';
                request(url, (error, response, body) => {
                    if(!error && response.statusCode == 200){
                        var data = JSON.parse(body);
                        var imdb_link = "https://www.imdb.com/title/" + data.imdbID;
                        
                        var movies_detail = {
                            Title :  movies.film,
                            Year :  movies.year_film,
                            Oscar_category :  movies.category,
                            Year_ceremony :  movies.year_ceremony,
                            Imdb_link: imdb_link
                            };
                        
                        console.log(movies_detail);
                        res.status(200).json(movies_detail);    
                    }
                });  
            }
        });
    } 
    else {
        res.status(400).send(error.message);
    }
});



