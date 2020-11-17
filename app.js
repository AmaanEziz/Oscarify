const express = require('express');
const request = require('request');
const app = express();
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('search');
});

 app.listen(8080, function(){
     console.log('Movie app started on port: 8080');
 });
