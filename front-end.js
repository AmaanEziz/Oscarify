const express=require('express');
const request = require('request');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");

const api=require('./feature.js');

const zerolist=api.createzeroList();
const namelist=api.createnamelist();
const yearlist=api.createYearList();
const categorylist=api.createCategoryList();
const winnerlist=api.createWinnerList();
const app = express();

app.listen(8080, () => {
    console.log('Movie app started on port: 8080');
});

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('views'))
app.use('/css', express.static(__dirname + 'views/css'));

app.set('view engine', 'ejs');  
app.set('views', './views')





// get param from UI (Search Page)
app.get('/', (req, res) => {
    res.render('search');
});

app.get('/result', async (req, res) => {
    let category=req.query.category;
    let year=req.query.year;
    let winner=req.query.winner;
    let name=req.query.name;
    if (name&&category&&year&&winner){ 
        api.getMovieList(namelist,name,categorylist,category,yearlist,year,winnerlist,winner).then(data=>{res.render('result',{data:data})});}
    else if (category&&year&&winner){
        api.getMovieList(zerolist,0,categorylist,category,yearlist,year,winnerlist,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&category&&year){
        api.getMovieList(namelist,name,categorylist,category,yearlist,year,zerolist,0).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&category&&winner){
        api.getMovieList(namelist,name,categorylist,category,zerolist,0,winnerlist,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (category&&name&&winner){
        api.getMovieList(namelist,namecategorylist,category,zerolist,0,winnerlist,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&category){
        api.getMovieList(namelist,name,categorylist,category,zerolist,0,zerolist,0).then(data=>{res.render('result',{data:data})});
    }
    else if (category&&year){
        api.getMovieList(zerolist,0,categorylist,category,yearlist,year,zerolist,0).then(data=>{res.render('result',{data:data})});
    }
    else if (year&&winner){
        api.getMovieList(zerolist,0,zerolist,0,yearlist,year,winnerlist,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&year){
        api.getMovieList(namelist,name,zerolist,0,yearlist,year,zerolist,0).then(data=>{res.render('result',{data:data})});
    }
    else if (category&&winner){
        api.getMovieList(zerolist,0,category,zerolist,0,winnerlist,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&winner){
        api.getMovieList(namelist,name,zerolist,0,zerolist,0,winnerlist,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name){
        api.getMovieList(namelist,name,zerolist,0,zerolist,0,zerolist,0,zerolist,0).then(data=>{res.render('result',{data:data})});
    }
    else if (category){
        api.getMovieList(zerolist,0,categorylist,category,zerolist,0,zerolist,0).then(data=>{res.render('result',{data:data})});
    }
    else if (year){
        api.getMovieList(zerolist,0,zerolist,0,yearlist,year,zerolist,0).then(data=>{res.render('result',{data:data})});
    }
    else if (winner){
        api.getMovieList(zerolist,0,zerolist,0,zerolist,0,winnerlist,winner).then(data=>{res.render('result',{data:data})});}
    else {
        res.render('result',{data:[]})
    }
});


app.get('/api',(req,res)=>{
    let category=req.query.category;
    let year=req.query.year;
    let winner=req.query.winner;
    let name=req.query.name;
    if (name&&category&&year&&winner){ 
        api.getMovieList(namelist,name,categorylist,category,yearlist,year,winnerlist,winner).then(data=>{res.send(data)});}
    else if (category&&year&&winner){
        api.getMovieList(zerolist,0,categorylist,category,yearlist,year,winnerlist,winner).then(data=>{res.send(data)});
    }
    else if (name&&category&&year){
        api.getMovieList(namelist,name,categorylist,category,yearlist,year,zerolist,0).then(data=>{res.send(data)});
    }
    else if (name&&category&&winner){
        api.getMovieList(namelist,name,categorylist,category,zerolist,0,winnerlist,winner).then(data=>{res.send(data)});
    }
    else if (category&&name&&winner){
        api.getMovieList(namelist,namecategorylist,category,zerolist,0,winnerlist,winner).then(data=>{res.send(data)});
    }
    else if (name&&category){
        api.getMovieList(namelist,name,categorylist,category,zerolist,0,zerolist,0).then(data=>{res.send(data)});
    }
    else if (category&&year){
        api.getMovieList(zerolist,0,categorylist,category,yearlist,year,zerolist,0).then(data=>{res.send(data)});
    }
    else if (year&&winner){
        api.getMovieList(zerolist,0,zerolist,0,yearlist,year,winnerlist,winner).then(data=>{res.send(data)});
    }
    else if (name&&year){
        api.getMovieList(namelist,name,zerolist,0,yearlist,year,zerolist,0).then(data=>{res.send(data)});
    }
    else if (category&&winner){
        api.getMovieList(zerolist,0,category,zerolist,0,winnerlist,winner).then(data=>{res.send(data)});
    }
    else if (name&&winner){
        api.getMovieList(namelist,name,zerolist,0,zerolist,0,winnerlist,winner).then(data=>{res.send(data)});
    }
    else if (name){
        api.getMovieList(namelist,name,zerolist,0,zerolist,0,zerolist,0,zerolist,0).then(data=>{res.send(data)});
    }
    else if (category){
        api.getMovieList(zerolist,0,categorylist,category,zerolist,0,zerolist,0).then(data=>{res.send(data)});
    }
    else if (year){
        api.getMovieList(zerolist,0,zerolist,0,yearlist,year,zerolist,0).then(data=>{res.send(data)});
    }
    else if (winner){
        api.getMovieList(zerolist,0,zerolist,0,zerolist,0,winnerlist,winner).then(data=>{res.send(data)});}
    else {
        res.send("Invalid Parameters");
    }
});

