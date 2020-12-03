const express=require('express');
// const bodyParser = require('body-parser');
const functions=require('./feature.js');

const app = express();

app.listen(8080,()=>{console.log("listening on port 8080");});



app.get('/movies',(req,res)=>{

    let category=req.query.category;
    let year=req.query.year;
    let winner=req.query.winner;
    let name=req.query.name;
    let index=req.query.index;
    if (index){
        functions.getDataAtIndex(index).then(data=>{/////////SINGLETON ENDPOINt is /movies?index={index}
            if (data!=[]){
                res.status(200).send(data);
                res.status(400).send(error.message)
            }
            else {
                res.send("Invalid Parameter Values")
            }
        
        
        });
    }
    else if (name || category || year || winner) {

        functions.getMovieList(name,category,year,winner).then(data=>{
            if (data!=[]){
                res.status(200).send(data);
                res.status(400).send(error.message)
            }
            else {
                res.send("Invalid Parameter Values")
            }
        
        
        });
   }
   else {res.send("Invalid Parameters Provided")}
   
});



app.get('/movies/:category/:year/:winner',(req,res)=>{

    let category =  req.params.category ;
    let year = req.params.year;
    let winner = req.params.winner;

    functions.getMovieList(null, category,year,winner)
    .then(data=>{
        if (data!=[]){
        res.status(200).send(data) }
        else {res.status(400).send("Invalid Parameter Values Specified")};
        });

});



app.get('/collections/:category/:year',(req,res)=>{

    let category =  req.params.category ;
    let year = req.params.year;

    functions.getMovieList(null, category,year,null)
    .then(data=>{
        if (data!=[]){
        res.status(200).send(data) }
        else {res.status(400).send("Invalid Parameter Values Specified")};
        });
        
});



app.get('/search',(req,res)=>{

    let category=req.query.category;

    functions.getMovieList(null, category,null,null)
    .then(data=>{
        if (data!=[]){
        res.status(200).send(data) }
        else {res.status(400).send("Invalid Parameter Values Specified")};
        });
        

});
