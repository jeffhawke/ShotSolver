


var express = require('express');

var app = express();

const FIELD_SIZE = 7;

var iternum = 0;

//typeof someVar === 'undefined'

class ball {
  constructor(pos_x, pos_y) {
    this.pos_x = pos_x;
    this.pos_y = pos_y;
  }
  equals (b) {
    if( b.prototype === this.prototype && b.pos_x==this.pos_x && b.pos_y == this.pos_y ) {
      return true;
    }
    return false;
  }
  moveUp() {
    this.pos_y--;
    return this.pos_y;
  }
  moveDown() {
    this.pos_y++;
    return this.pos_y;
  }
  moveLeft() {
    this.pos_x--;
    return this.pos_x;
  }
  moveRight() {
    this.pos_x++;
    return this.pos_x;
  }
}

class field {
  constructor(size) {
    this.size = size;
    this.balls = [];
  }
  addBall(pos_x, pos_y) {
    b = new ball(pos_x, pos_y);
    if(! this.ballExists(b))  
      ball.push(b);
  }
  ballExists(ball) {
    return (balls.findIndex( ball.equals ) >= 0);
  }

  moveAlongUp(b) {
    var bb = new ball(b.pos_x,b.pos_y);
    var ret = { found: false, pos_y: -1 };
    //'u'
    pos_x = b[0];
    pos_y = b[1] - 1;
    if(pos_y > 0 && ! this.ballExists(new b(pos_x, pos_y)) ) { //first step must be free and away from borders
      do {
        pos_y--;
        if(pos_y >= 0 && this.ballExists(new b(pos_x, pos_y)) ) {
          ret.found = true;
          ret.pos_y = pos_y;
          break;
        }
      } while (pos_y >= 0);
    }
    return ret;
  }
  
  moveAlongDown(ball) {
    var pos_x, pos_y;
    var ret = { found: false, pos_y: FIELD_SIZE };
    //'d'
    pos_x = ball[0];
    pos_y = ball[1] + 1;
    if(pos_y < FIELD_SIZE - 1 && !checkBallinField([pos_x, pos_y], field)) { //first step must be free and away from borders
      do {
        pos_y++;
        if(pos_y < FIELD_SIZE && checkBallinField([pos_x, pos_y], field)) {
          ret.found = true;
          ret.pos_y = pos_y;
          break;
        }
      } while (pos_y < FIELD_SIZE);
    }
    return ret;
  }
  
  moveAlongLeft(ball) {
    var pos_x, pos_y;
    var ret = { found: false, pos_x: -1 };
  
    //'l'
    pos_x = ball[0] - 1;
    pos_y = ball[1];
    if(pos_x > 0 && !checkBallinField([pos_x, pos_y], field)) { //first step must be free and away from borders
      do {
        pos_x--;
        if(pos_x >= 0 && checkBallinField([pos_x, pos_y], field)) {
          ret.found = true;
          ret.pos_x = pos_x;
          break;
        }
      } while (pos_x >= 0);
    }
    
    return ret;
  }
  
  moveAlongRight(ball) {
    var pos_x, pos_y;
    var ret = { found: false, pos_x: FIELD_SIZE };
  
    //'r'
    pos_x = ball[0] + 1;
    pos_y = ball[1];
    if(pos_x < FIELD_SIZE - 1 && !checkBallinField([pos_x, pos_y], field)) { //first step must be free and away from borders
      do {
        pos_x++;
        if(pos_x < FIELD_SIZE && checkBallinField([pos_x, pos_y], field)) {
          ret.found = true;
          ret.pos_x = pos_x;
          break;
        }
      } while (pos_x < FIELD_SIZE);
    }
  
    return ret;
  }
     




}



// array of triples : [ ball positions, legal moves, moves executed ]
var solveQueue = [];

var solutions = [];

function solve(elements) {
  if(elements != "()") {
    var strvalues = elements.toString().slice(1, -1).split(" ");
    var i = 0;
    var startingBalls = [];
    while (i < strvalues.length) {
      v1 = parseInt(strvalues[i++]);
      v2 = parseInt(strvalues[i++]);
      startingBalls.push([v1,v2]);
    } 
    console.log(startingBalls);

    var legalMoves = findAllLegalMoves(startingBalls);
    
    console.log(legalMoves);
/*
    solveQueue.push( [ startingBalls, legalMoves, [] ] )

    while(solveQueue.length > 0) {
      var triple = solveQueue.pop();
      if( doSolveStep(triple) ) {
        solutions.push(triple[2]);
      }
    }

    console.log(solutions);
    console.log("Done");
*/

/*
    var test = copyMoves(legalMoves);
    console.log(test);

    legalMoves[1][1] = "gggg";
    legalMoves[1][0][0] = 7;

    console.log(startingBalls);
    console.log(legalMoves);
    console.log(test);
*/

  }
}

function copyMove(m) {
  return [Array.from(m[0]), m[1]];
}

function copyMoves(moves) {
  return Array.from(moves, copyMove);
}

function doSolveStep(triple) {
  
  // if triple[0].length == 1 (only 1 ball in field)
  // then just return true
  if (triple[0].length == 1) {
    return true;
  }
  //otherwise,
  // - execute each legal move (from triple[1]) on the field
  // - compute new legal moves
  // - update the doneMoves and push into the stack
  else {
    triple[1].forEach(function (move) {
      var balls = executeMove(triple[0], move);
      solveQueue.push([ balls, findAllLegalMoves(balls), copyMoves(triple[2]).push(copyMove(move))]); 
    })

    return false;
  }

}

function executeMove(balls, move) {
  var ball = move[0];

  var found = balls.findIndex(function(b) {
    return b[0] == ball[0] && b[1] == ball[1];
  });
  
  if (found >= 0) {
    var ob = balls.splice(found, 0);
    var nb = updatePos(ob, move[1]);
    //the move should be legal and thus the resulting ball should be inside the field
    //still, better to trust but verify
    if( nb[0]>=0 && nb[0]<FIELD_SIZE && nb[1]>=0 && nb[1]<FIELD_SIZE)
      balls.push(nb);
    else
      balls.push(ob);
  }
  return balls;
}

function updatePos(ball, direction) {
  switch(direction) {
    case 'u':
      return [ball[0], ball[1]-1];
    case 'd':
      return [ball[0], ball[1]+1];
    case 'l':
      return [ball[0]-1, ball[1]];
    case 'r':
    return [ball[0]+1, ball[1]];
    default:
      return ball;
  }
}

/*
function findUnobstructedMoves(balls) {
  var legalMoves = [];

  balls.forEach(function (ball, i) {
    //console.log(ball);

    var foundUp = balls.findIndex(function(b) {
      return b[0] == ball[0] && b[1] == ball[1] - 1;
    });
    var foundDown = balls.findIndex(function(b) {
      return b[0] == ball[0] && b[1] == ball[1] + 1;
    });
    var foundLeft = balls.findIndex(function(b) {
      return b[0] == ball[0] - 1 && b[1] == ball[1];
    });
    var foundRight = balls.findIndex(function(b) {
      return b[0] == ball[0] + 1 && b[1] == ball[1];
    });

    //console.log(foundUp + "," + foundDown + "," + foundLeft + "," + foundRight);

    if(foundUp == -1 && ball[1] > 0) {
      legalMoves.push([Array.from(ball), 'u']);
    }
    if(foundDown == -1 && ball[1] < FIELD_SIZE-1) {
      legalMoves.push([Array.from(ball), 'd']);
    }
    if(foundLeft == -1 && ball[0] > 0) {
      legalMoves.push([Array.from(ball), 'l']);
    }
    if(foundRight == -1 && ball[0] < FIELD_SIZE-1) {
      legalMoves.push([Array.from(ball), 'r']);
    }


  })

  return legalMoves;

}
*/

function findAllLegalMoves(balls) {
  var legalMoves = [];

  balls.forEach(function (ball, i) {
    //console.log(ball);
    /*
    var foundUp = balls.findIndex(function(b) {
      return b[0] == ball[0] && b[1] == ball[1] - 1;
    });
    var foundDown = balls.findIndex(function(b) {
      return b[0] == ball[0] && b[1] == ball[1] + 1;
    });
    var foundLeft = balls.findIndex(function(b) {
      return b[0] == ball[0] - 1 && b[1] == ball[1];
    });
    var foundRight = balls.findIndex(function(b) {
      return b[0] == ball[0] + 1 && b[1] == ball[1];
    });

    //console.log(foundUp + "," + foundDown + "," + foundLeft + "," + foundRight);

    if(foundUp == -1 && ball[1] > 0) {
      legalMoves.push([Array.from(ball), 'u']);
    }
    if(foundDown == -1 && ball[1] < FIELD_SIZE-1) {
      legalMoves.push([Array.from(ball), 'd']);
    }
    if(foundLeft == -1 && ball[0] > 0) {
      legalMoves.push([Array.from(ball), 'l']);
    }
    if(foundRight == -1 && ball[0] < FIELD_SIZE-1) {
      legalMoves.push([Array.from(ball), 'r']);
    }
    */
    var newmoves = findLegalMoves(ball, balls);
    legalMoves = legalMoves.concat(newmoves);

  })

  return legalMoves;

}

function checkBallinField(ball,field) {
  return (field.findIndex(function(b) {
    return b[0] == ball[0] && b[1] == ball[1];
  }) >= 0);
}

function moveAlongUp(ball, field) {
  var pos_x, pos_y;
  var ret = { found: false, pos_y: -1 };
  //'u'
  pos_x = ball[0];
  pos_y = ball[1] - 1;
  if(pos_y > 0 && !checkBallinField([pos_x, pos_y], field)) { //first step must be free and away from borders
    do {
      pos_y--;
      if(pos_y >= 0 && checkBallinField([pos_x, pos_y], field)) {
        ret.found = true;
        ret.pos_y = pos_y;
        break;
      }
    } while (pos_y >= 0);
  }
  return ret;
}

function moveAlongDown(ball, field) {
  var pos_x, pos_y;
  var ret = { found: false, pos_y: FIELD_SIZE };
  //'d'
  pos_x = ball[0];
  pos_y = ball[1] + 1;
  if(pos_y < FIELD_SIZE - 1 && !checkBallinField([pos_x, pos_y], field)) { //first step must be free and away from borders
    do {
      pos_y++;
      if(pos_y < FIELD_SIZE && checkBallinField([pos_x, pos_y], field)) {
        ret.found = true;
        ret.pos_y = pos_y;
        break;
      }
    } while (pos_y < FIELD_SIZE);
  }
  return ret;
}

function moveAlongLeft(ball, field) {
  var pos_x, pos_y;
  var ret = { found: false, pos_x: -1 };

  //'l'
  pos_x = ball[0] - 1;
  pos_y = ball[1];
  if(pos_x > 0 && !checkBallinField([pos_x, pos_y], field)) { //first step must be free and away from borders
    do {
      pos_x--;
      if(pos_x >= 0 && checkBallinField([pos_x, pos_y], field)) {
        ret.found = true;
        ret.pos_x = pos_x;
        break;
      }
    } while (pos_x >= 0);
  }
  
  return ret;
}

function moveAlongRight(ball, field) {
  var pos_x, pos_y;
  var ret = { found: false, pos_x: FIELD_SIZE };

  //'r'
  pos_x = ball[0] + 1;
  pos_y = ball[1];
  if(pos_x < FIELD_SIZE - 1 && !checkBallinField([pos_x, pos_y], field)) { //first step must be free and away from borders
    do {
      pos_x++;
      if(pos_x < FIELD_SIZE && checkBallinField([pos_x, pos_y], field)) {
        ret.found = true;
        ret.pos_x = pos_x;
        break;
      }
    } while (pos_x < FIELD_SIZE);
  }

  return ret;
}
   

function findLegalMoves(ball, field) {
  var legalMoves = [];

  var pos_x, pos_y;
  
  if ( moveAlongUp(ball, field).found ) {
    legalMoves.push(copyMove([ball, 'u']));
  }
  
  if ( moveAlongDown(ball, field).found ) {
    legalMoves.push(copyMove([ball, 'd']));
  }

  if ( moveAlongLeft(ball, field).found ) {
    legalMoves.push(copyMove([ball, 'l']));
  }

  if ( moveAlongRight(ball, field).found ) {
    legalMoves.push(copyMove([ball, 'r']));
  }




  return legalMoves;
}


function resp(req) {
  solve(req.query.elements);

  iternum += 1;
  return iternum.toString();
}

app.get('/', function (req, res) {
  res.send(resp(req))
})



app.listen(3000, () => console.log('Solver app listening on port 3000!'))
