'use strict'
describe('Logic test', function () {
    var result;

    beforeEach(function (done) {
        logic.searchBeers('estrella',function(beers){
            result = beers;
            done();
        });
    });

    it('should return an array of 13 beers', function () {
        expect(result.length).toBe(13)
        
    });  
});