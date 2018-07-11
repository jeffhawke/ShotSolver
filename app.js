var express = require('express');

var app = express();

const FIELD_SIZE = 7;


// array of triples : [ ball positions, legal moves, moves executed ]
var solveQueue = [];

var solutions = [];

function solve(elements) {
  solveQueue = [];
  solutions = [];

  if(elements != "()") {
    var strvalues = elements.toString().slice(1, -1).split(" ");
    var i = 0;
    var startingBalls = [];
    while (i < strvalues.length) {
      v1 = parseInt(strvalues[i++]);
      v2 = parseInt(strvalues[i++]);
      startingBalls.push([v1,v2]);
    } 
    prettyPrintField(startingBalls);

    var legalMoves = findAllLegalMoves(startingBalls);
    
    prettyPrintLegalMoves(legalMoves);

    solveQueue.push( [ copyField(startingBalls), copyMoves(legalMoves), [] ] )

    while(solveQueue.length > 0) {
      var triple = solveQueue.pop();
      if( doSolveStep(triple) ) {
        solutions.push(triple[2]);
      }
    }

    prettyPrintSolutions(solutions);
    //console.log("Done");


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

function prettyPrintField(f) {
  var str = "";
  f.forEach(function(b) {
    str = str + " " + prettyPrintBall(b);
  })
  console.log("Field: " + str);
}

function prettyPrintBall(b) {
  return "(" + b[0] + "," + b[1] + ")";
}

function prettyPrintMove(m) {
  return "[ " + prettyPrintBall(m[0]) + ", " + m[1] + " ]"
}

function prettyPrintMoves(mo) {
  str = "";
  mo.forEach(function(m) {
    str = str + " " + prettyPrintMove(m)
  })
  return "{ " + str + " }";
}

function prettyPrintLegalMoves(lm) {
  console.log("Legal Moves: " + prettyPrintMoves(lm));
}

function prettyPrintSolutions(so) {
  str = "";
  so.forEach(function(s) {
    str = str + " " + prettyPrintMoves(s)
  })
  console.log("Solutions: " + str);
}

function copyBall(b) {
  return Array.from(b);
}

function copyField(f) {
  return Array.from(f, copyBall);
}

function copyMove(m) {
  return [copyBall(m[0]), m[1]];
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
      var cf = copyField(triple[0]);
      var newField = executeMove(cf, move);
      var newLegalMoves = findAllLegalMoves(newField);
      var newSolutionSteps = copyMoves(triple[2]);
      newSolutionSteps.push(copyMove(move));
      solveQueue.push([ newField, newLegalMoves, newSolutionSteps ]); 
    })

    return false;
  }

}

function isBallPositionLegal(ball) {
  return ball[0]>=0 && ball[0]<FIELD_SIZE && ball[1]>=0 && ball[1]<FIELD_SIZE
}

function getBallIndexInField(ball, field) {
  return field.findIndex(function(b) {
    return b[0] == ball[0] && b[1] == ball[1];
  });
}

function checkBallinField(ball,field) {
  return ( getBallIndexInField(ball,field) >= 0);
}


function executeMove(field, move) {
  var ball = move[0];
  var found = getBallIndexInField(ball, field);

  if (found >= 0) { //sanity check
    var ob = field.splice(found, 1);
    var b = ob[0];

    var ret, nextBallIndex;
    switch(move[1]) {
      case 'u':
        do {
          ret = findNextBallUp(b,field);
          if(ret.found && ret.pos_y >= 0) {

            b[1] = ret.pos_y + 1;
            field.push(b);
            
            nextBallIndex = getBallIndexInField(ret.ball, field);
            ob = field.splice(nextBallIndex, 1)
            b = ob[0];
          }
        } while(ret.found);
        break;
      case 'd':
        do {
          ret = findNextBallDown(b,field);
          if(ret.found && ret.pos_y < FIELD_SIZE) {

            b[1] = ret.pos_y - 1;
            field.push(b);
            
            nextBallIndex = getBallIndexInField(ret.ball, field);
            ob = field.splice(nextBallIndex, 1)
            b = ob[0];
          }
        } while(ret.found);
        break;
      case 'l':
        do {
          ret = findNextBallLeft(b,field);
          if(ret.found && ret.pos_x >= 0) {

            b[0] = ret.pos_x + 1;
            field.push(b);
            
            nextBallIndex = getBallIndexInField(ret.ball, field);
            ob = field.splice(nextBallIndex, 1)
            b = ob[0];
          }
        } while(ret.found);
      break;
      case 'r':
        do {
          ret = findNextBallRight(b,field);
          if(ret.found && ret.pos_x < FIELD_SIZE) {

            b[0] = ret.pos_x - 1;
            field.push(b);
            
            nextBallIndex = getBallIndexInField(ret.ball, field);
            ob = field.splice(nextBallIndex, 1)
            b = ob[0];
          }
        } while(ret.found);
        break;
      default:
        
    }

  }
  return field;
}


function findNextBallUp(ball, field) {
  var pos_x, pos_y;
  var ret = { found: false, pos_y: -1 , ball: null};
  //'u'
  pos_x = ball[0];
  pos_y = ball[1];
  while (pos_y >= 0) {
      pos_y--;
      if(pos_y >= 0 && checkBallinField([pos_x, pos_y], field)) {
        ret.found = true;
        ret.pos_y = pos_y;
        ret.ball = [pos_x, pos_y];
        break;
      }
    }
  return ret;
}

function findNextBallDown(ball, field) {
  var pos_x, pos_y;
  var ret = { found: false, pos_y: -1 , ball: null};
  //'u'
  pos_x = ball[0];
  pos_y = ball[1];
  while (pos_y < FIELD_SIZE) {
      pos_y++;
      if(pos_y < FIELD_SIZE && checkBallinField([pos_x, pos_y], field)) {
        ret.found = true;
        ret.pos_y = pos_y;
        ret.ball = [pos_x, pos_y];
        break;
      }
    }
  return ret;
}

function findNextBallLeft(ball, field) {
  var pos_x, pos_y;
  var ret = { found: false, pos_x: -1 , ball: null};
  //'u'
  pos_x = ball[0];
  pos_y = ball[1];
  while (pos_x >= 0) {
      pos_x--;
      if(pos_x >= 0 && checkBallinField([pos_x, pos_y], field)) {
        ret.found = true;
        ret.pos_x = pos_x;
        ret.ball = [pos_x, pos_y];
        break;
      }
    }
  return ret;
}

function findNextBallRight(ball, field) {
  var pos_x, pos_y;
  var ret = { found: false, pos_x: -1 , ball: null};
  //'u'
  pos_x = ball[0];
  pos_y = ball[1];
  while (pos_x < FIELD_SIZE) {
      pos_x++;
      if(pos_x < FIELD_SIZE && checkBallinField([pos_x, pos_y], field)) {
        ret.found = true;
        ret.pos_x = pos_x;
        ret.ball = [pos_x, pos_y];
        break;
      }
    }
  return ret;
}

function findAllLegalMoves(field) {
  var legalMoves = [];

  field.forEach(function (b) {
    var newmoves = findLegalMoves(b, field);
    legalMoves = legalMoves.concat(newmoves);
  })

  return legalMoves;
}

function findLegalMoves(ball, field) {
  var legalMoves = [];
  var ret;

  ret = findNextBallUp(ball, field);
  if ( ret.found && ret.pos_y < (ball[1] - 1) ) {
    legalMoves.push([copyBall(ball), 'u']);
  }
  
  ret = findNextBallDown(ball, field);
  if ( ret.found && ret.pos_y > (ball[1] + 1) ) {
    legalMoves.push([copyBall(ball), 'd']);
  }

  ret = findNextBallLeft(ball, field);
  if ( ret.found && ret.pos_x < (ball[0] - 1) ) {
    legalMoves.push([copyBall(ball), 'l']);
  }

  ret = findNextBallRight(ball, field);
  if ( ret.found && ret.pos_x > (ball[0] + 1) ) {
    legalMoves.push([copyBall(ball), 'r']);
  }

  return legalMoves;
}


function resp(req) {
  solve(req.query.elements);

  return JSON.stringify(solutions);
}

app.get('/', function (req, res) {
  res.send(resp(req))
})



app.listen(3000, () => console.log('Solver app listening on port 3000!'))
