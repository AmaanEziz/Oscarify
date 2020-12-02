const express=require('express');
const bodyParser = require('body-parser');
const api=require('./feature.js');

const zerolist=api.createzeroList();
const namelist=api.createnamelist();
const yearlist=api.createYearList();
const categorylist=api.createCategoryList();
const winnerlist=api.createWinnerList();
const app = express();

//get data form Oscar.json file
const Oscar_record = require('./oscars.json');

app.use(bodyParser.json());
app.use(express.json());


app.listen(8080,()=>{console.log("listening on port 8080");});

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

