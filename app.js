const express=require('express');
const bodyParser = require('body-parser');
const functions=require('./feature.js');

const app = express();

//get data form Oscar.json file
const Oscar_record = require('./oscars.json');

//app.use(bodyParser.json());
app.use(express.json());


app.listen(8080,()=>{console.log("listening on port 8080");});




  // SINGLETON: request by movie index
// app.get('/movies/:index',(req,res)=>{ 

//     functions.getDataAtIndex(req.params.index)
//     .then(data => {
//         console.log(data);
//         res.send(data);
//     })

// });

// // SINGLETON: request by catergory , year , and winner 
// app.get('/movies/collections/:category/:year/:winner',(req,res)=>{

//     let category =  req.params.category ;
//     let year = req.params.year;

//     getMoviesByCategoryYear(category,year)
//     .then(data => {
//         // console.log(data);
//         res.status(200).send(data)})
//     },  error => {
//         console.log(error);
//         res.status(400).send(error.message);
        
// });


// //collections request  By Category and year
// // test url : 

// app.get('/movies/collections/:category/:year',(req,res)=>{

//     let category =  req.params.category ;
//     let year = req.params.year;

//     getMoviesByCategoryYear(category,year)
//     .then(data => {
//         // console.log(data);
//         res.status(200).send(data)})
//     },  error => {
//         console.log(error);
//         res.status(400).send(error.message);
// });

app.get('/movies',(req,res)=>{
    let category=req.query.category;
    let year=req.query.year;
    let winner=req.query.winner;
    let name=req.query.name;
    let index=req.query.index;
    if (name&&category&&year&&winner){ 
        functions.getMovieList(name,category,year,winner).then(data=>{res.send(data)});}//Singleton request, returns movie with specified params
    else if (category&&year&&winner){
        functions.getMovieList(null,category,year,winner).then(data=>{res.send(data)});
    }
    else if (name&&category&&year){
        functions.getMovieList(name,category,year,null).then(data=>{res.send(data)});//collections request
    }
    else if (name&&category&&winner){
        functions.getMovieList(name,category,null,winner).then(data=>{res.send(data)});
    }
    else if (name&&year&&winner){
        functions.getMovieList(name,null,year,winner).then(data=>{res.send(data)});
    }
    else if (name&&category){
        functions.getMovieList(name,category,null,null).then(data=>{res.send(data)});
    }
    else if (category&&year){
        functions.getMovieList(null,category,year,null).then(data=>{res.send(data)});
    }
    else if (year&&winner){
        functions.getMovieList(null,null,year,winner).then(data=>{res.send(data)});
    }
    else if (name&&year){
        functions.getMovieList(name,null,year,null).then(data=>{res.send(data)});
    }
    else if (category&&winner){
        functions.getMovieList(null,category,null,winner).then(data=>{res.send(data)});
    }
    else if (name&&winner){
        functions.getMovieList(name,null,null,winner).then(data=>{res.send(data)});
    }
    else if (name){
        functions.getMovieList(name,null,null,null).then(data=>{res.send(data)});
    }
    else if (category){
        functions.getMovieList(null,category,null,null).then(data=>{res.send(data)});
    }
    else if (year){
        functions.getMovieList(null,null,year,null).then(data=>{res.send(data)});
    }
    else if (winner){
        functions.getMovieList(null,null,null,winner).then(data=>{res.send(data)});}
    else if (index){
        functions.getDataAtIndex(index).then(data=>{res.send(data)})//Singleton request
    }
    else {
        res.send("Invalid Parameters");
    }
})

