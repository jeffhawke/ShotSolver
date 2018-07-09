
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
  
  