const fetch = require("node-fetch");
const Oscars_record = require('./oscars.json');//Oscars file as a JSON array

function format(word){/////Converts all input strings to uniform standard for ease in comparing data
  return word.toString().toUpperCase().replace(/ /g,"+");
}

const categoryList=(function createCategoryList()
{
    var List=[];
    for (var i=0; i<Oscars_record.length;i++){
        List.push(format(Oscars_record[i].category));
    }
    return List;
})();
const titleList=(function createTitleList()
{
    var List=[];
    for (var i=0; i<Oscars_record.length;i++){
        List.push(format(Oscars_record[i].film));
    }
    return List;
})();

const yearList=(function createYearList()
{
    var List=[];
    for (var i=0; i<Oscars_record.length;i++){
        List.push(format(Oscars_record[i].year_ceremony));
    }
    return List;
})();


const winnerList=(function createWinnerList()
{
    var List=[];
    for (var i=0; i<Oscars_record.length;i++){
        List.push(format(Oscars_record[i].winner));
    }
    return List;
})();


async function getOMDB(movie){//Returns ALL fields given by OMDB API
    try{
    const response = await fetch("http://www.omdbapi.com/?apikey=505ac8dc&t="+movie);
    const OMDBobject= await response.json();
    return await OMDBobject;
    }
    catch(error){return "Movie info not found"}
}

async function getOMDBfields(movie){//Returns only the fields we need from the OMDB API

   let fields={};
  let OMDB=await getOMDB(movie).then(data=>{
    return data;
       });
    fields.Poster= OMDB.Poster;
    fields.Plot=OMDB.Plot;
    fields.IMDBReviewsLink="https://www.imdb.com/title/"+OMDB.imdbID;
    fields.StreamingLink="https://streamvideo.link/getvideo?key=cmlinIufEwFXuZrA&video_id="+OMDB.imdbID;
    return fields;

}


async function getDataAtIndex(index){//Merges Oscar data and OMDB field data into one object and returns it
    if(index>-1&&index<10395){
    let oscarsFields=Oscars_record[index];
    let movieName=oscarsFields.film;
    let OMDBfields=await getOMDBfields(movieName).then((data)=>{return data});
    var IndexData= Object.assign({},oscarsFields,OMDBfields);
    return IndexData;}
    else {return []}
    
    
}

  
async function getMovieList(title,category,year,winner){//Long function, returns List with given params
  let returnList=[];
  let params=[title,category,year,winner];
  for (var i=0; i<params.length;i++){//converts unspecified parameter to empty string
      if (params[i]==null){params[i]=""}
      params[i]=format(params[i]);
  }
  title=params[0];
  category=params[1];
  year=params[2];
  winner=params[3];
  for (i=0;i<Oscars_record.length;i++){
    
  if (titleList[i].includes(title) &&categoryList[i].includes(category)//Searches what movies include the criteria 

      &&yearList[i].includes(year)&&winnerList[i].includes(winner)){


          let DataAtIndex= await getDataAtIndex(i).then((data)=>{return data;});
          returnList.push(DataAtIndex);
      }
      
  }
  return returnList;
}


function RandNum(){
    let num=Math.floor(Math.random() * 2200)+8000;
    return num;
}

async function createRandPosters(){
    let posterList=[]
    for (var i=0;i<3;i++){
        let poster;
        while (!poster || poster=="N/A")
       { poster= await getDataAtIndex(RandNum()).then(data=>{return data.Poster});}
        posterList.push(poster);
        
    }
    
    return posterList;
    
}


//Mod.exports needed in order to export the needed functions to different files
module.exports={
   getDataAtIndex,getMovieList,createRandPosters}
  