const express=require('express');
const bodyParser = require('body-parser');
const functions=require('./Functions.js');

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.listen(8000,()=>{console.log("listening on port 8000")});


app.get('/movies/search',(req,res)=>{

    let category=req.query.category;
    let year=req.query.year;
    let winner=req.query.winner;
    let name=req.query.name;
    let index=req.query.index;

    // SINGLETON: request by movie index /movies/search?index=7
    if (index&&!category&&!year&&!winner&&!name){
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