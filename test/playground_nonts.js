var expect = require('chai').expect;

var m = require('monet');
var r = require('ramda');


// trace : String -> String -> IO String
// @impure
var trace = r.curry(function(tag, x){
  console.log(tag, x);
  return x;
});
var log = trace('DEBUG: ');

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
  if (r.isEmpty(arguments[0])) {
    throw new Error('Snake must have at least one point, e.g. a head')
  }

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
  var acc;

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

// data BoardSize = Int Int
var BoardSize = function(width, height) {
  return {
    width: width,
    height: height
  }
};

// data RenderedBoard = [String]
var RenderedBoard = function(/* arguments */) {
  return r.values(arguments);
};

// data BoardState = Board MaybeSnake MaybeApple
var BoardState = function(b, ms, ma) {
  return {
    board: b,
    snake: ms,
    apple: ma
  }
};


// compact :: [Char] -> [Char]
var rejectWall = r.reject(r.equals('#'));

// compact :: [a] -> [a]
var compact = r.reject(r.equals([]));

// filterWalls :: RenderedBoard -> RenderedBoard
var filterWalls = r.compose(r.map(r.join('')), compact, r.map(rejectWall));

// determineBoardWidth :: RenderedBoard -> Int
var determineBoardWidth = r.compose(r.length, filterWalls);

// determineBoardHeight :: RenderedBoard -> Int
var determineBoardHeight = r.compose(r.length, r.head, filterWalls);

// determineSnake :: RenderedBoard -> Maybe Snake
//var determineSnake = r.compose(m.Maybe.fromNull, function() { return null });

// data PointValue = Point Char
var PointValue = function(x, y, value) {
  return {
    p: Point(x, y),
    value: value
  };
};

// TODO: tacit?
// mapIndicesAndValues :: RenderedBoard -> [PointValues]
var mapIndicesAndValues = function(rendered_board) {
  return r.map(function(row) {
    return r.map(function (col) {
      return PointValue(parseInt(col), parseInt(row), rendered_board[row][col]);
    })(r.keys(r.split('', rendered_board[row])));
  })(r.keys(rendered_board));
};

// isEmptySpace :: PointValue -> Boolean
var isEmptySpace = r.compose(r.equals(' '), r.prop('value'));

// filterEmptySpaces :: [PointValues] -> [PointValues]
var filterEmptySpaces = r.reject(isEmptySpace);

// orderSnakePointValues :: [PointValues] -> [PointValues]
var orderSnakePointValues = r.sortBy(r.prop('value'));

// getPoints :: [PointValues] -> [Point]
var getPoints = r.map(r.prop('p'));

// makeSnake :: [Points] -> Maybe Snake
// TODO: figure out monads, this seems wrong
var makeSnake = function(points) {
  if (r.isEmpty(points)) {
    return m.Maybe.None()
  } else {
    return Snake.apply(this, points)
  }
};

// findSnake :: RenderedBoard -> Maybe Snake
var findSnake = r.compose(
  makeSnake,
  getPoints,
  orderSnakePointValues,
  filterEmptySpaces,
  r.flatten,
  mapIndicesAndValues,
  filterWalls
);

// parseRenderedBoard :: RenderedBoard -> BoardState
var parseRenderedBoard = function(rendered_board) {
  return BoardState(
    Board(determineBoardWidth(rendered_board), determineBoardHeight(rendered_board)),
    findSnake(rendered_board),
    m.None()
  )
};

describe('Board to App State parser', function() {
  //
  //it('can filter walls', function() {
  //  expect(
  //    filterWalls(RenderedBoard(
  //      '####',
  //      '#  #',
  //      '# 0#',
  //      '####'
  //    ))
  //  ).to.deep.equal(
  //    RenderedBoard(
  //      '  ',
  //      ' 0'
  //    )
  //  )
  //});
  //
  //it('can get a list of of snake coridinates', function() {
  //  expect(
  //    findSnake(RenderedBoard(
  //      '2 ',
  //      '10'
  //    ))
  //  ).to.deep.equal(
  //    Snake(
  //      Point(1,1),
  //      Point(0,1),
  //      Point(0,0)
  //    )
  //  )
  //});
  //
  //it('can return a Maybe Snake', function() {
  //  //var MaybeSnake = function(s) {
  //  //  return m.Maybe.Some(s)
  //  //}
  //  //log(
  //  //  MaybeSnake(Snake())
  //  //);
  //  //expect(parseRenderedBoard(
  //  //        '###',
  //  //        '# #',
  //  //        '###'
  //  //).snake).to.equal(
  //  //  m.None()
  //  //)
  //});
  //
  it('can parse a 3x3 board into a 1x1 world', function() {
    expect(
      parseRenderedBoard((RenderedBoard(
        '###',
        '# #',
        '###'
      )))
    ).to.deep.equal(
      BoardState(
        Board(1, 1),
        m.None(),
        m.None()
      )
    )
  });

  it('can parse a baby snake', function() {
    expect(
      parseRenderedBoard(([
        '#####',
        '#   #',
        '# 0 #',
        '#   #',
        '#####'
      ]))
    ).to.deep.equal(
      BoardState(
        Board(3, 3),
        Snake(Point(1,1)),
        m.None()
      )
    )
  });

  it('can parse a teen snake', function() {
    expect(
      parseRenderedBoard(([
        '#####',
        '# 12#',
        '# 03#',
        '#   #',
        '#####'
      ]))
    ).to.deep.equal(
      BoardState(
        Board(3, 3),
        Snake(
          Point(1,1),
          north(Point(1,1)),
          east(north(Point(1,1))),
          south(east(north(Point(1,1))))
        ),
        m.None()
      )
    )
  });



});


