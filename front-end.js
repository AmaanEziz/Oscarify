const express=require('express');

const functions=require('./Functions.js');

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
app.get('/', (req, res) => 
{

    functions.createRandPosters().then(data=>{res.render('search',{data:data});})
});

//Queries the given params and returns the result page accordingly
app.get('/result', async (req, res) => {
    let category=req.query.category;
    let year=req.query.year;
    let winner=req.query.winner;
    let name=req.query.name;
    if (category || year || winner || name){
    functions.getMovieList(name,category,year,winner).then(data=>{res.render('result',{data:data})})  }
    else { 
        res.render('result',{data:[]});
    }
});
