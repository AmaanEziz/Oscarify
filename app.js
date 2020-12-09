const express=require('express');
const bodyParser = require('body-parser');
const functions=require('./feature.js');

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.listen(8000,()=>{console.log("listening on port 8000")});

// Requirement 2.1.1 
//collections request  By Category and year
// test url : http://localhost:8080/collections/Actor/2015

app.get('/collections/:category/:year',(req,res)=>{

    let category =  req.params.category ;
    let year = req.params.year;

    functions.getMovieList(null, category,year,null)
    .then(data=>{
        if (data.length > 0){
        res.status(200).send(data) 
        } else {
            res.status(400).send("Invalid Parameter Values Specified")
        };
        });
        
});

// Requirement 2.1.2
// SINGLETON: request by catergory , year , and winner 
// test url: http://localhost:8080/movies/best picture/2000/true

app.get('/movies/:category/:year/:winner',(req,res)=>{

    let category =  req.params.category ;
    let year = req.params.year;
    let winner = req.params.winner;

    functions.getMovieList(null, category,year,winner)
    .then(data=>{
        if (data.length > 0){
            res.status(200).send(data) 
        } else {
                res.status(400).send("Invalid Parameter Values Specified")
        };
        });
});




// Requirement 2.1.3 
// For Last endpoint test:  http://localhost:8080/movies/search?category=CINEMATOGRAPHY&year=2014
app.get('/movies/search',(req,res)=>{

    let category=req.query.category;
    let year=req.query.year;
    let winner=req.query.winner;
    let name=req.query.name;
    let index=req.query.index;

    // SINGLETON: request by movie index /movies/search?index=7
    if (index){
        functions.getDataAtIndex(index).then(data=>{ 
            if (data.length == 0){
                res.status(400).send("Invalid Parameter Values");
            }
            else {
                res.status(200).send(data);
            }
        
        
        });
    }
    else if (name || category || year || winner) {

        functions.getMovieList(name,category,year,winner).then(data=>{
            if (data.length > 0){
                res.status(200).send(data);
            }
            else {
                res.status(400).send("Invalid Parameter Values")
            }
        
        
        });
   }
   else {res.send("Invalid Parameters Provided")}
   
});