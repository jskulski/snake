var expect = require('chai').expect;

var m = require('monet');
var r = require('ramda');

var point = function (x, y) {
  return {
    x: x,
    y: y
  }
};

var north = function (p) {
  return point(p.x, p.y - 1)
};

var south = function (p) {
  return point(p.x, p.y + 1);
};

var east = function (p) {
  return point(p.x + 1, p.y);
};
var west = function (p) {
  return point(p.x - 1, p.y);
};


describe('points', function () {
  it('can be created', function () {
    var p = point(2, 3);
  });

  it('has a point to the north', function () {
    var p = north(point(2, 3));
    expect(p).to.deep.equal(point(2, 2));
  });

  it('has a point to the south', function () {
    var p = south(point(2, 3));
    expect(p).to.deep.equal(point(2, 4));
  });

  it('has a point to the east', function () {
    var p = east(point(2, 3));
    expect(p).to.deep.equal(point(3, 3));
  });

  it('has a point to the west', function () {
    var p = west(point(2, 3));
    expect(p).to.deep.equal(point(1, 3));
  });
});

var snake = function (/* arguments */) {
  return r.values(arguments);
};

make_move_snake = function (direction) {
  return function (s) {
    return r.concat(
      [direction(r.head(s))],
      r.init(s)
    );
  }
};

var s_north = make_move_snake(north);
var s_south = make_move_snake(south);
var s_west = make_move_snake(west);
var s_east = make_move_snake(east);


describe('snake', function () {
  it('can be created', function () {
    var s = snake(
      point(1, 3),
      point(1, 4),
      point(1, 5),
      point(1, 6)
    );
  });

  it('can be moved north', function () {
    expect(
      s_north(snake(
        point(1, 3),
        point(1, 4),
        point(1, 5),
        point(2, 5)
      ))
    ).to.deep.equal(
      snake(
        point(1, 2),
        point(1, 3),
        point(1, 4),
        point(1, 5)
      )
    );
  });

  it('can be moved south', function () {
    expect(
      s_south(snake(
        point(1, 1),
        point(2, 1),
        point(3, 1),
        point(4, 1)
      ))
    ).to.deep.equal(
      snake(
        point(1, 2),
        point(1, 1),
        point(2, 1),
        point(3, 1)
      )
    );
  });

  it('can be moved east', function () {
    expect(
      s_east(snake(
        point(1, 3),
        point(1, 4),
        point(1, 5),
        point(2, 5)
      ))
    ).to.deep.equal(
      snake(
        point(2, 3),
        point(1, 3),
        point(1, 4),
        point(1, 5)
      )
    );

    it('can be moved west', function () {
      expect(
        s_west(snake(
          point(2, 3),
          point(2, 4),
          point(2, 5),
          point(3, 5)
        ))
      ).to.deep.equal(
        snake(
          point(1, 3),
          point(2, 3),
          point(2, 4),
          point(2, 5)
        )
      );
    });
  });
});

