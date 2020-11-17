const express = require('express');
const request = require('request');
const app = express();
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('search');
});

app.get('/result', function(req, res){
    var query = req.query.search;
    var url = 'https://www.omdbapi.com/?s=' + query + '&apikey=35711dae';
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body)
            console.log(data);
            res.render('result', {data: data});
        }
    });
});



 app.listen(8080, function(){
     console.log('Movie app started on port: 8080');
 });
