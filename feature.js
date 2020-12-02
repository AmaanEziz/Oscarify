const fetch = require("node-fetch");
const moviesArr = require('./oscars.json');


function format(word){
  return word.toString().toUpperCase().replace(/ /g,"+");
}


function createzeroList(){
  var list=[];
  for (var i=0; i<moviesArr.length;i++){
    list.push(0);
}
return list;
}
function createCategoryList()
{
    var list=[];
    for (var i=0; i<moviesArr.length;i++){
        list.push(format(moviesArr[i].category));
    }
    return list;
}
function createnamelist()
{
    var list=[];
    for (var i=0; i<moviesArr.length;i++){
        list.push(format(moviesArr[i].film));
    }
    return list;
}

function createYearList()
{
    var list=[];
    for (var i=0; i<moviesArr.length;i++){
        list.push(format(moviesArr[i].year_ceremony));
    }
    return list;
}


function createWinnerList()
{
    var list=[];
    for (var i=0; i<moviesArr.length;i++){
        list.push(format(moviesArr[i].winner));
    }
    return list;
}

const namelist=createnamelist();
const categorylist=createCategoryList();
const yearlist=createYearList();
const winnerlist=createWinnerList();
const zerolist=createzeroList();


async function getODPdata(movie){//Gets ALL ODP info of a movie when given its title
    try{
    const response = await fetch("http://www.omdbapi.com/?t="+movie+"&apikey=47175bcf");
    const ODPinfo = await response.json();
  
    return await ODPinfo;}
    catch(error){return error;}
}




function ReturnOnlyNeededInfo(movie){//Takes in an ODP object and trims the unnecessary info and adds streaming/review link
    delete movie.Rated;
    delete movie.imdbRating;
    delete movie.Released;
    delete movie.Runtime;
    delete movie.Director;
    delete movie.Writer;
    delete movie.Metascore;
    delete movie.imdbVotes;
    delete movie.Year;
    delete movie.Type;
    delete movie.DVD;
    delete movie.BoxOffice;
    delete movie.Production;
    delete movie.Website;
    delete movie.Ratings;
    delete movie.Language;
    delete movie.Country;
    delete movie.Response;
    movie.IMDBReviewsLink="https://www.imdb.com/title/"+movie.imdbID;
    movie.StreamingLink="https://streamvideo.link/getvideo?key=cmlinIufEwFXuZrA&video_id="+movie.imdbID;
    delete movie.imdbID;
    return movie;
}

async function getMoviesByName(name){
  let odpinfo=await getODPdata(name).then(data=>{return data;})
  let MoviesByName=ReturnOnlyNeededInfo(odpinfo);
  return MoviesByName;
}

async function getMoviesByIndex(index){ //Returns the Needed info given an Index of the oscars.json file
    let movie=moviesArr[index];
    let MovieName=movie.film;
    let ODPinfo=await getODPdata(MovieName).then((data)=>{return data;});
    let neededInfo=await ReturnOnlyNeededInfo(ODPinfo);
    neededInfo.yearCeremony=movie.year_ceremony;
    neededInfo.yearReleased=movie.year_film;
    neededInfo.OscarCategory=movie.category;
    neededInfo.Winner=movie.winner;
    return await neededInfo;
    
}


  
async function getMovieList(listzero,title,listtwo,category,listthree,year,listfour,winner){
    let returnlist=[];
    let titlevalue=format(title);
    let categoryvalue=format(category);
    let yearvalue=format(year);
    let winnervalue=format(winner);
    for (let i=0;i<moviesArr.length;i++){
      
        if (listzero[i].toString().includes(titlevalue) &&listtwo[i].toString().includes(categoryvalue)&&listthree[i]==yearvalue&&listfour[i]==winnervalue){
            let MoviesByIndex= await getMoviesByIndex(i).then((data)=>{return data;});
            returnlist.push(MoviesByIndex);
        }
        
    }
    return await returnlist;
}


async function getCollectionMoviesByName(name){

  return getMovieList(namelist,name,zerolist,0,zerolist,0,zerolist,0).then(data=>{return data;});
  }

async function getMoviesByCategory(category){ 
    return await getMovieList(zerolist,0,categorylist,category,zerolist,0,zerolist,null);
  }


async function getMoviesByYear(year){ 
    return await getMovieList(zerolist,0,zerolist,0,yearlist,year,zerolist,null);
  }
  async function getMoviesByWinner(winner){ 
    return await getMovieList(zerolist,0,zerolist,0,zerolist,0,winnerlist,winner);
    
  }

  async function getMoviesByCategoryYear(category,year){ 
    return await getMovieList(zerolist,0,categorylist,category,yearlist,year,zerolist,null).then(data=>{return data;});
    
  }


  async function getMoviesByCategoryWinner(category,winner){ 
    return await getMovieList(zerolist,0,categorylist,category,zerolist,0,winnerlist,winner);
    
  }

  async function getMoviesByYearWinner(year,winner){ 

    return await getMovieList(zerolist,0,zerolist,0,yearlist,year,winnerlist,winner);
  }

  async function getMoviesByCategoryYearWinner(category,year,winner){ 
    return await getMovieList(zerolist,0,categorylist,category,yearlist,year,winnerlist,winner);
  }

module.exports={fetch,moviesArr,getMoviesByName, createCategoryList,createYearList,createWinnerList,categorylist,winnerlist,yearlist,getODPdata,
    ReturnOnlyNeededInfo,getCollectionMoviesByName,getMoviesByIndex,getMovieList,getMoviesByYear,getMoviesByCategory,getMoviesByWinner,getMoviesByYearWinner,
    getMoviesByCategoryWinner,getMoviesByCategoryYear,getMoviesByCategoryYearWinner,createzeroList,createnamelist}