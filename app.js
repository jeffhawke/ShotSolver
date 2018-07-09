var express = require('express');

var app = express();

const FIELD_SIZE = 7;

var iternum = 0;


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
  //field.findIndex(function(b) {
  //  return b[0] == ball[0] && b[1] == ball[1];
  //});
  
  if (found >= 0) {
    var ob = field.splice(found, 1);
    var b = ob[0];
    //var nb = updatePos(ob, move[1]);

    var ret;
    switch(move[1]) {
      case 'u':
        do {
          ret = moveAlongUp(b,field);
          if(ret.found && ret.pos_y >= 0) {
            
            found = getBallIndexInField(b, field);

            b.pos_y = ret.pos_y - 1;
            field.push(b);
            
            ob = field.splice(found, 1)
            b = ob[0];
          }
        } while(!ret.found);
        break;
      case 'd':
        
      case 'l':
        
      case 'r':
        
      default:
        
    }







  }
  return field;
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


function findAllLegalMoves(balls) {
  var legalMoves = [];

  balls.forEach(function (ball, i) {
    //console.log(ball);

    var newmoves = findLegalMoves(ball, balls);
    legalMoves = legalMoves.concat(newmoves);

  })

  return legalMoves;

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
