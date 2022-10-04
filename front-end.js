const express=require('express');

const functions=require('./Functions.js');

const app = express();

app.listen(8080, () => {
    console.log('Movie app started on port: 8080');
    console.log(functions.getDistinctCategories())
});

app.use(express.json());
app.use(express.static('views'))
app.use('/css', express.static(__dirname + 'views/css'));

app.set('view engine', 'ejs');  
app.set('views', './views')


// get param from UI (Search Page)
app.get('/', async (req, res) => 
{
    let randPosterURLs=await functions.createRandPosters();
    let distinctCategories= functions.getDistinctCategories();
    let distinctYears=functions.getDistinctYears();
    res.render('search',{moviePosterURLs:randPosterURLs, categories:distinctCategories, years: distinctYears});
});

//Queries the given params and returns the result page accordingly
app.get('/result', async (req, res) => {
    let category=req.query.category;
    let year=req.query.year;
    let winnerParam=req.query.winner;
    let isWinner=winnerParam=="" ? null : (winnerParam=="Winner" ? true : false) ;
    let name=req.query.name;
    if (category || year || winner || name){
    functions.getMovieList(name,category,year,isWinner).then(data=>{res.render('result',{data:data})})  }
    else { 
        res.render('result',{data:[]});
    }
});
