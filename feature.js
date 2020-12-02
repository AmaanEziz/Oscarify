const fetch = require("node-fetch");
const Oscars_record = require('./oscars.json');


function format(word){/////Converts all input strings to uniform standard for ease in comparing data
  return word.toString().toUpperCase().replace(/ /g,"+");
}

function createCategoryList()
{
    var list=[];
    for (var i=0; i<Oscars_record.length;i++){
        list.push(format(Oscars_record[i].category));
    }
    return list;
}
function createNameList()
{
    var list=[];
    for (var i=0; i<Oscars_record.length;i++){
        list.push(format(Oscars_record[i].film));
    }
    return list;
}

function createYearList()
{
    var list=[];
    for (var i=0; i<Oscars_record.length;i++){
        list.push(format(Oscars_record[i].year_ceremony));
    }
    return list;
}


function createWinnerList()
{
    var list=[];
    for (var i=0; i<Oscars_record.length;i++){
        list.push(format(Oscars_record[i].winner));
    }
    return list;
}

const namelist=createNameList();
const categorylist=createCategoryList();
const yearlist=createYearList();
const winnerlist=createWinnerList();

async function getODPdata(movie){//Returns ALL fields given by ODP API
    try{
    const response = await fetch("http://www.omdbapi.com/?apikey=505ac8dc&t="+movie);
    const ODPobject= await response.json();
    return await ODPobject;
    }
    catch(error){return "Movie info not found"}
}

async function getODPfields(movie){//Returns only the fields we need from the ODP API

   let fields={};
  let ODPdata=await getODPdata(movie).then(data=>{
    return data;
       });
    fields.Poster= ODPdata.Poster;
    fields.Plot=ODPdata.Plot;
    fields.IMDBReviewsLink="https://www.imdb.com/title/"+ODPdata.imdbID;
    fields.StreamingLink="https://streamvideo.link/getvideo?key=cmlinIufEwFXuZrA&video_id="+ODPdata.imdbID;
    return fields;

}


async function getDataAtIndex(index){//Merges Oscar data and ODP field data into one object and returns it
    let oscarsFields=Oscars_record[index];
    let movieName=oscarsFields.film;
    let ODPfields=await getODPfields(movieName).then((data)=>{return data});
    var finalObj = Object.assign({},oscarsFields,ODPfields);
    delete finalObj.name;
    return finalObj;
    
    
}

  
async function getMovieList(titleParam,categoryParam,yearParam,winnerParam){//Long function, returns list with given params
  let returnlist=[];
  let params=[titleParam,categoryParam,yearParam,winnerParam];
  for (var i=0; i<params.length;i++){
      if (params[i]==null){params[i]=""}
      params[i]=format(params[i]);
  }
  let title=params[0];
  let category=params[1];
  let year=params[2];
  let winner=params[3];
  for (i=0;i<Oscars_record.length;i++){
    
  if (namelist[i].includes(title) &&categorylist[i].includes(category)

      &&yearlist[i].includes(year)&&winnerlist[i].includes(winner)){


          let DataAtIndex= await getDataAtIndex(i).then((data)=>{return data;});
          returnlist.push(DataAtIndex);
      }
      
  }
  if (returnlist.length==0){
  return "Legal parameters were given but no results were found"}
  else {return returnlist;}
}


//Mod.exports needed in order to export the needed functions to different files
module.exports={fetch,Oscars_record,categorylist,winnerlist,yearlist,getODPdata,getODPfields,
    getDataAtIndex,getMovieList}