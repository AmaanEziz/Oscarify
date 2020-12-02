const express=require('express');
const fetch = require("node-fetch");
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
//get data form Oscar.json file
const Oscar_record = require('./oscars.json');

app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');  

app.listen(8080,()=>{console.log("listening on port 8080");});

// get param from UI (Search Page)
app.get('/', (req, res) => {
    res.render('search');
});

// making get request for Result page to print out data to UI
app.get('/result', (req, res) => {
    var query = req.query.search;
    var url = 'https://www.omdbapi.com/?s=' + query + '&apikey=35711dae';
    try {
        request(url, (error, response, body) => {
            if(!error && response.statusCode == 200){
                var data = JSON.parse(body)
                // if (data = " ") {
                //     res.render('result', {error: "Invalid movie name"})
                // }
                // console.log(data.Search[0].Title);
                for (var i = 0 ; i < Oscar_record.length; i++) {
                    data.Search.forEach( movie => {
                        var moviename = movie.Title;
                        if (moviename == Oscar_record[i].film) {
                            movie.winner = Oscar_record[i].winner;
                            movie.category = Oscar_record[i].category;
                            movie.year_ceremony = Oscar_record[i].year_ceremony;
                        } 
                    })
                }
                console.log(data);
                res.render('result', {data: data});
            }
        });
    }
    catch (error) {
        return error;
    }
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



// creat categorylist object array store Oscar Movies detail base on Category
var categorylist=[];
    for (var i=0; i<Oscar_record.length;i++){
        categorylist.push(Oscar_record[i].category.toString().replace(/ /g,"+"));
    }

// creat yearlist to store Oscar Movies detail base on Year
var yearlist=[];
    for (i=0; i<Oscar_record.length;i++){
        yearlist.push(Oscar_record[i].year_film);
    }

// creat Winner to store Oscar Movies detail base on Year  
var winnerlist=[];
for (i=0; i<Oscar_record.length;i++){
    winnerlist.push(Oscar_record[i].winner);
}

async function getOMDPdata(movie){//Gets ALL ODP info of a movie when given its title
    try{
    const response = await fetch("http://www.omdbapi.com/?t="+movie+"&apikey=47175bcf");
    const ODPinfo = await response.json();
    return await ODPinfo;}
    catch(error){return error;}
}

//Takes in an ODP object and trims the unnecessary info and adds streaming/review link
function ReturnOnlyNeededInfo(movie){
    delete movie.Year;
    delete movie.Rated;
    delete movie.Released;
    delete movie.Runtime;
    delete movie.Director;
    delete movie.Writer;
    delete movie.Actors;
    delete movie.Metascore;
    delete movie.imdbVotes;
    delete movie.Awards;
    delete movie.Type;
    delete movie.DVD;
    delete movie.BoxOffice;
    delete movie.Production;
    delete movie.Website;
    delete movie.Ratings;
    delete movie.Language;
    delete movie.Country;
    movie.IMDBReviewsLink="https://www.imdb.com/title/"+movie.imdbID;
    movie.StreamingLink="https://streamvideo.link/getvideo?key=cmlinIufEwFXuZrA&video_id="+movie.imdbID;
    return movie;
}
// making function to return Singleton index movie

async function getMoviesByIndex(index){ 
    let movie=Oscar_record[index];
    let MovieName=movie.film;
    let ODPinfo=await getOMDPdata(MovieName).then((data)=>{return data;});
    let neededInfo=await ReturnOnlyNeededInfo(ODPinfo);
    neededInfo.Year_film = movie.year_film;
    neededInfo.OscarCategory=movie.category;
    neededInfo.Winner=movie.winner;
    return await neededInfo;
    
}



async function getMovieList(firstlist,firstvalue,secondlist,secondvalue,thirdlist,thirdvalue){
    let returnlist=[];
    for (let i=0;i<firstlist.length;i++){
        if (firstlist[i]==firstvalue&&secondlist[i]==secondvalue&&thirdlist[i]==thirdvalue){
            let MoviesByIndex= await getMoviesByIndex(i).then((data)=>{return data;});
            returnlist.push(MoviesByIndex);
        }
    }
    return await returnlist;
}

async function getMoviesByCategory(category){ 
    let categoryvalue=category.toString().toUpperCase().replace(/ /g,"+");//Makes sure spaces are replaced with + and its capitalized to avoid errors
    return await getMovieList(categorylist,categoryvalue,[],null,[],null);
  }


async function getMoviesByYear(year){ 
    return await getMovieList(yearlist,year,[],null,[],null);
  }

async function getMoviesByWinner(winner){ 
    let winnervalue=winner.toString().toLowerCase();
    return await getMovieList(winnerlist,winnervalue,[],null,[],null);
    
  }

async function getMoviesByCategoryYear(category,year){ 
    let categoryvalue=category.toString().toUpperCase().replace(/ /g,"+");
    return await getMovieList(categorylist,categoryvalue,yearlist,year,[],null).then(data=>{return data;});
    
  }


async function getMoviesByCategoryWinner(category,winner){ 
    let categoryvalue=category.toString().toUpperCase().replace(/ /g,"+");
    let winnervalue=winner.toString().toLowerCase();
    return await getMovieList(categorylist,categoryvalue,winnerlist,winnervalue,[],null);
    
  }


async function getMoviesByYearWinner(year,winner){ 
    let winnervalue=winner.toString().toLowerCase();
    return await getMovieList(yearlist,year,winnerlist,winnervalue,[],null);
  }
 

async function getMoviesByCategoryYearWinner(category,year,winner){ 
    let categoryvalue=category.toString().toUpperCase().replace(/ /g,"+");
    let winnervalue=winner.toString().toLowerCase();
    return await getMovieList(categorylist,categoryvalue,yearlist,year,winnerlist,winnervalue);
  }


  // SINGLETON: request by movie index
app.get('/movies/:index',(req,res)=>{ 
    getMoviesByIndex(req.params.index)
    .then(data => {
        console.log(data);
        res.send(data);
    }), error => res.status(400).send(`error: ${error}`)

});


//collections request  By Category and year
// test url : 

app.get('/movies/collections/:category/:year',(req,res)=>{

    let category =  req.params.category ;
    let year = req.params.year;

    getMoviesByCategoryYear(category,year)
    .then(data => {
        // console.log(data);
        res.status(200).send(data)})
    },  error => {
        console.log(error);
        res.status(400).send(error.message);
    });




// For Last endpoint Picture http://localhost:8080/moives/search?category=Best Picture
app.get('/movies/search',(req,res)=>{
    let category=req.query.category;
    let year=req.query.year;
    let winner=req.query.winner;
    if (category && year && winner){
        getMoviesByCategoryYearWinner(category,year,winner)
        .then(data=>{res.send(data); console.log(data)} );
    }
    else if (category && year){
        getMoviesByCategoryYear(category,year).then(data=>{res.send(data)})
    }
    else if (category && winner){
        getMoviesByCategoryWinner(category,winner).then(data=>{res.send(data)})
    }
    else if (year && winner){
        getMoviesByYearWinner(year,winner).then(data=>{res.send(data)})
    }
    else if (category){
        getMoviesByCategory(category).then(data=>{res.send(data)})
    }
    else if (year){
        getMoviesByYear(year).then(data=>{res.send(data)})
    }
    else if (winner){
        getMoviesByWinner(winner).then(data=>{res.send(data)})
    }
    else {
        res.status(400).send("Invalid Parameters");
    }
})

