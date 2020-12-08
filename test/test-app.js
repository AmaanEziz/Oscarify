const chai = require('chai');
const expect = chai.expect;

const functions=require('../feature.js');

// Test for SINGLETON Movie 
describe('SINGLETON:  Movie tests',function(){
    it('check that there is only one best picture winner for 2010', async () =>{
        await functions.getMovieList(null,"best picture","2010","true").then(data=>{
            // console.log(data);
            expect(data.length).to.equal(1);
            expect(data[0]).to.have.property('category', "BEST PICTURE");
            expect(data[0].year_ceremony).equals(2010);
            expect(data[0].winner).equals('true');
        })

    })

})


//Test for COLLECTION  request  By Category and year
describe('COLLECTION:  Movie tests',function(){

    it('check that there are a collection of movies category: Short Film in 1997', async () =>{
        await functions.getMovieList(null,"Short Film","1997",null).then(data=>{
            // console.log(data);
            expect(data.length).to.be.above(1);
            expect(data).to.be.an('array');
            data.forEach(movies => {
                expect(movies.category).to.include('SHORT FILM');
                expect(movies.year_ceremony).equals(1997);
            })
        })

    })
})

// Test for 3rd endpoint /movies/search

