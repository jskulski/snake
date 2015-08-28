var expect = require('chai').expect;

var m = require('monet');
var r = require('ramda');

// data Point = Int Int
var Point = function (x, y) {
  return {
    x: x,
    y: y
  }
};

var north = function (p) {
  return Point(p.x, p.y - 1)
};

var south = function (p) {
  return Point(p.x, p.y + 1);
};

var east = function (p) {
  return Point(p.x + 1, p.y);
};
var west = function (p) {
  return Point(p.x - 1, p.y);
};


describe('points', function () {
  it('can be created', function () {
    var p = Point(2, 3);
  });

  it('has a point to the north', function () {
    var p = north(Point(2, 3));
    expect(p).to.deep.equal(Point(2, 2));
  });

  it('has a point to the south', function () {
    var p = south(Point(2, 3));
    expect(p).to.deep.equal(Point(2, 4));
  });

  it('has a point to the east', function () {
    var p = east(Point(2, 3));
    expect(p).to.deep.equal(Point(3, 3));
  });

  it('has a point to the west', function () {
    var p = west(Point(2, 3));
    expect(p).to.deep.equal(Point(1, 3));
  });
});

// data Snake = [Point]
var Snake = function (/* arguments */) {
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


describe('Snake', function () {
  it('can be created', function () {
    var s = Snake(
      Point(1, 3),
      Point(1, 4),
      Point(1, 5),
      Point(1, 6)
    );
  });

  it('can be moved north', function () {
    expect(
      s_north(Snake(
        Point(1, 3),
        Point(1, 4),
        Point(1, 5),
        Point(2, 5)
      ))
    ).to.deep.equal(
      Snake(
        Point(1, 2),
        Point(1, 3),
        Point(1, 4),
        Point(1, 5)
      )
    );
  });

  it('can be moved south', function () {
    expect(
      s_south(Snake(
        Point(1, 1),
        Point(2, 1),
        Point(3, 1),
        Point(4, 1)
      ))
    ).to.deep.equal(
      Snake(
        Point(1, 2),
        Point(1, 1),
        Point(2, 1),
        Point(3, 1)
      )
    );
  });

  it('can be moved east', function () {
    expect(
      s_east(Snake(
        Point(1, 3),
        Point(1, 4),
        Point(1, 5),
        Point(2, 5)
      ))
    ).to.deep.equal(
      Snake(
        Point(2, 3),
        Point(1, 3),
        Point(1, 4),
        Point(1, 5)
      )
    );

    it('can be moved west', function () {
      expect(
        s_west(Snake(
          Point(2, 3),
          Point(2, 4),
          Point(2, 5),
          Point(3, 5)
        ))
      ).to.deep.equal(
        Snake(
          Point(1, 3),
          Point(2, 3),
          Point(2, 4),
          Point(2, 5)
        )
      );
    });
  });
});


// data Board = Int Int
var Board = function(width, height) {
  return {
    width: width,
    height: height
  };
};

describe('Board', function() {
  it('can be created', function() {
    var b = Board(20, 20);
  });
});


// render :: Board -> String
var render = function(b) {
  var str = '';
  var acc ='';
  var render_point = function(acc, p) {
    return acc + '['+ p.x +' ' + p.y +']'
  };
  var rows = r.range(0, b.width);
  var cols = r.range(0, b.height);

  acc = r.reduce(function(acc, row) {
    return acc + r.reduce(function(acc, col) {
      return render_point(acc, Point(row, col));
    }, '')(cols) + '\n';
  }, '');

  return acc(rows);
  //return r.reduce(render_point, '', rows);
};

// data Apple = Point
var Apple = function(point) {
  return {
    lives: point
  }
};

describe('apple', function() {
  it('can be created', function() {
    var apple = Apple(Point(3,2))
  });
});

describe('renderer', function() {
  it('render a board', function() {
    var b = Board(10, 10);
    str = render(b);
    //console.log(str);
  });

  it('renders a Snake on a board', function () {
    var b = Board(10, 10);
  });
});

//#####

// data BoardState = Board Snake MaybeApple
var BoardState = function() {};

// ParseRenderedBoard :: [String] -> BoardState
var parseRenderedBoard = function(rendered_board) {
  return BoardState()
};

describe('Board to App State parser', function() {

  it('can be created', function() {
    parseRenderedBoard()
  });

  it('can parse a square', function() {
    var parser = Parser()


  });

});
