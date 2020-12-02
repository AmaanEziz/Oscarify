const express=require('express');

const functions=require('./feature.js');

const app = express();

app.listen(8080, () => {
    console.log('Movie app started on port: 8080');
});

app.use(express.json());
app.use(express.static('views'))
app.use('/css', express.static(__dirname + 'views/css'));

app.set('view engine', 'ejs');  
app.set('views', './views')



// get param from UI (Search Page)
app.get('/', (req, res) => {
    res.render('search');
});

//Queries the given params and returns the result page accordingly
app.get('/result', async (req, res) => {
    let category=req.query.category;
    let year=req.query.year;
    let winner=req.query.winner;
    let name=req.query.name;
    if (name&&category&&year&&winner){ ///Long if else statement, unfortunate
        functions.getMovieList(name,category,year,winner).then(data=>{res.render('result',{data:data})});}
    else if (category&&year&&winner){
        functions.getMovieList(null,category,year,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&category&&year){
        functions.getMovieList(name,category,year,null).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&category&&winner){
        functions.getMovieList(name,category,null,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&year&&winner){
        functions.getMovieList(name,null,year,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&category){
        functions.getMovieList(name,category,null,null).then(data=>{res.render('result',{data:data})});
    }
    else if (category&&year){
        functions.getMovieList(null,category,year,null).then(data=>{res.render('result',{data:data})});
    }
    else if (year&&winner){
        functions.getMovieList(null,null,year,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&year){
        functions.getMovieList(name,null,year,null).then(data=>{res.render('result',{data:data})});
    }
    else if (category&&winner){
        functions.getMovieList(null,category,null,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name&&winner){
        functions.getMovieList(name,null,null,winner).then(data=>{res.render('result',{data:data})});
    }
    else if (name){
        functions.getMovieList(name,null,null,null).then(data=>{res.render('result',{data:data})});
    }
    else if (category){
        functions.getMovieList(null,category,null,null).then(data=>{res.render('result',{data:data})});
    }
    else if (year){
        functions.getMovieList(null,null,year,null).then(data=>{res.render('result',{data:data})});
    }
    else if (winner){
        functions.getMovieList(null,null,null,winner).then(data=>{res.render('result',{data:data})});}
    else {
        res.render("result",{data:[]});
    }
});
