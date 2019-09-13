var expect = require('chai').should();

// a test test - delete when we have real things to test here
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1, 2, 3].indexOf(4).should.equal(-1);
    });
  });
});