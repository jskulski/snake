var expect = require('chai').expect;

var m = require('monet');
var r = require('ramda');

var point = function(x, y) {
    return {
        x: x,
        y: y
    }
};

var north = function(p) {
    return point(p.x, p.y + 1)
};

var south = function(p) {
    return point(p.x, p.y - 1);
};

var east = function(p) {
    return point(p.x + 1, p.y);
};
var west = function(p) {
    return point(p.x - 1, p.y);
};


describe('points', function() {
    it('can be created', function() {
        var p = point(2, 3);
    });

    it('has a point to the north', function() {
        var p = north(point(2, 3));
        expect(p).to.deep.equal(point(2, 4));
    });

    it('has a point to the south', function() {
        var p = south(point(2, 3));
        expect(p).to.deep.equal(point(2, 2));
    });

    it('has a point to the east', function() {
        var p = east(point(2, 3));
        expect(p).to.deep.equal(point(3, 3));
    });

    it('has a point to the west', function() {
        var p = west(point(2, 3));
        expect(p).to.deep.equal(point(1, 3));
    });
});
