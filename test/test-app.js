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