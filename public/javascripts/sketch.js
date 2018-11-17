var snake;
var pixel_size = 20;
var shots = [];
var movement = [];
var highscore = 0;
var gameState = 'init';
let start = document.getElementById('start');
let stop = document.getElementById('stop');

var grid = [];
for (var i = 0; i < 20; i++) {
  grid[i] = [];
  for (var j = 0; j < 20; j++) {
    grid[i][j] = 0;
  }
}


function dfs() {
  console.log('dfs')

  if (snake.tail.length == 0) {
    currentX = 0
    currentY = 0
  } else {
    currentX = snake.tail[snake.tail.length - 1].x
    currentY = snake.tail[snake.tail.length - 1].y
  }

  console.log('Food', shots[0].x / 20, shots[0].y / 20)

  //if(snakeTail.length > 0) {
    console.log(snake.tail.length)
    console.log(currentX, currentY)

    var location = {
      x: currentX,
      y: currentY,
      path: [],
      status: 'Start'
    };

    var goal = {
      x: shots[0].x / 20,
      y: shots[0].y / 20,
      status: 'Goal'
    };

    var queue = [location];

    while (queue.length > 0) {
      currentLocation = queue.shift();
      console.log('current location', currentLocation)

      // Explore North
      var newLocation = exploreInDirection(currentLocation, 'North', grid);
      console.log('newLocation', newLocation)
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore East
      var newLocation = exploreInDirection(currentLocation, 'East', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
      console.log('newLocation', newLocation)

      // Explore South
      var newLocation = exploreInDirection(currentLocation, 'South', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore West
      var newLocation = exploreInDirection(currentLocation, 'West', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
    }
  //}

  return false
}


var locationStatus = function(location, grid) {
  console.log('location status')
  var gridSize = grid.length;
  var dft = location.x;
  var dfl = location.y;

  if (location.y < 0 ||
      location.y >= gridSize ||
      location.x < 0 ||
      location.x >= gridSize) {

    // location is not on the grid--return false
    return 'Invalid';
  } else if (grid[dft][dfl] === 'Goal') {
    return 'Goal';
  } else if (grid[dft][dfl] !== 0) {
    // location is either an obstacle or has been visited
    return 'Blocked';
  } else {
    return 'Valid';
  }
};


var exploreInDirection = function(currentLocation, direction, grid) {
  console.log('explore in direction')
  var newPath = currentLocation.path.slice();
  newPath.push(direction);
  console.log(newPath)

  var dft = currentLocation.x;
  var dfl = currentLocation.y;

  if (direction === 'North') {
    dft -= 1;
    console.log('north', dft)
  } else if (direction === 'East') {
    dfl += 1;
    console.log('East', dfl)
  } else if (direction === 'South') {
    dft += 1;
    console.log('South', dft)
  } else if (direction === 'West') {
    dfl -= 1;
    console.log('West', dfl)
  }

  var newLocation = {
    x: dft,
    y: dfl,
    path: newPath,
    status: 'Unknown'
  };
  newLocation.status = locationStatus(newLocation, grid);

  // If this new location is valid, mark it as 'Visited'
  if (newLocation.status === 'Valid') {
    grid[newLocation.x][newLocation.y] = 'Visited';
  }

  return newLocation;
};








function Snake() {
  this.show = function () {
    fill(255);
    //draw the snake tail
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, pixel_size, pixel_size);
    }

    //draw the snake head
    rect(this.pos.x, this.pos.y, pixel_size, pixel_size)
  }

  this.update = function () {
    //move snake's position into tail and pop off the end
     if (movement.length) {
      if (snake.speed.x != movement[0][0] * -1 && snake.speed.y != movement[0][1] * -1) {
        snake.dir(movement[0][0], movement[0][1]);
      }
      movement.splice(0, 1);
    }

    this.tail.unshift(createVector(this.pos.x, this.pos.y));
    this.tail.pop();
    //move the snake
    this.pos.x += this.speed.x * pixel_size;
     this.pos.y += this.speed.y * pixel_size;
  }

  this.dir = function (x, y) {
    this.speed.x = x;
    this.speed.y = y;
  }

  this.checkDeath = function () {
    if (this.pos.x >= width || this.pos.y >= height || this.pos.x < 0 || this.pos.y < 0) {
      gameState = 'end';
    }
    for (var i = 0; i < this.tail.length; i++) {
      if (this.tail[i].x == this.pos.x && this.tail[i].y == this.pos.y) {
        gameState = 'end';
      }
    }
  }

  this.eat = function (pos) {
    return this.pos.x == pos.x && this.pos.y == pos.y;
  }

  this.reset = function () {
    shots = [];
    this.tail = [];
    this.pos = createVector(0, 0);
    this.speed = createVector(1, 0);
  }

  this.reset();
}

var distances = [];
var maxDistance;
var spacer;
var path = []

function setup() {
  createCanvas(400, 400).parent('snake');
  for (var x = 0; x < width; x++) {
    distances[x] = []; // create nested array
    for (var y = 0; y < height; y++) {
      var distance = dist(width / 2, height / 2, x, y);
      distances[x][y] = distance / maxDistance * 255;
    }
  }
  spacer = 20;
  frameRate(10);
}

function initGame() {
  background(50, 50, 100);
  var name = 'Snake Game';
  textSize(50);
  fill(255);
  noLoop();
}

start.addEventListener('click', function () {
  /* console.log('start');
  removeElements();
  gameState = 'play';
  snake = new Snake();
  setJelloShots(1);
  snake.show()
  noLoop(); */
  console.log('start')
  removeElements();
  snake = new Snake();
  setJelloShots(1);
  gameState = 'play';
  runGame();

  path = dfs()
  console.log('dfs', path)
  console.log('movement', movement)
  console.log('grid', grid)

  for (var i = 0; i < path.length; i++) {
    if (path[i] === 'South') {
      movement.push([0, 1]);
     } else if (path[i] === 'North') {
       movement.push([0, -1]);
     } else if (path[i] === 'Weast') {
       movement.push([-1, 0]);
     } else if (path[i] === 'East') {
       movement.push([1, 0]);
     }
   }

});

stop.addEventListener('click', function () {
  console.log('stop');
  gameState = 'end';
});


function runGame() {
  background(50, 50, 100);
  textSize(12);
  fill(255);
  text("score: " + snake.tail.length, 1, 10);
  text("highscore: " + highscore, 1, 24);

  snake.dir(0,0)

  snake.show();
  snake.checkDeath();

  console.log('Snake', snake.pos.x / 20, snake.pos.y / 20)
  console.log('Food', shots[0].x / 20, shots[0].y / 20)
  console.log('Shots', shots)
  console.log('grid')
  console.log(grid)


  fill(0, 255, 0, 100);
  for (var i = 0; i < shots.length; i++) {
    rect(shots[i].x, shots[i].y, pixel_size, pixel_size);
    if (snake.eat(shots[i])) {
      snake.tail.push(createVector(snake.x, snake.y));
      shots.splice(i, 1);
      setJelloShots(1);
      if (snake.tail.length > highscore) highscore = snake.tail.length;
    }
  }

  for (var x = 0; x < width; x += spacer) {
    for (var y = 0; y < height; y += spacer) {
      noFill();
      stroke(0);
      rect(0, 0, x + spacer, y + spacer);
    }
  }
  grid[0][0] = 'Start'
  grid[shots[0].x/20][shots[0].y/20] = 'Goal'
 //#endregion

 //snake.update();
}

function endGame() {
  background(50, 50, 100);
  textSize(32);
  var msg = 'Game Over';
  var score = 'Your Score is ' + snake.tail.length;
  msgWidht = textWidth(msg);
  scoreWidht = textWidth(score);
  fill(255);
  text(msg, (width - msgWidht) / 2, height / 2 - 40);
  text(score, (width - scoreWidht) / 2, height / 2);
  startBtn = createButton('Restart Game');
  startBtn.position(width / 2 - startBtn.width / 2, height / 2 + 40);
  startBtn.mousePressed(startGame);
  noLoop();
}

function draw() {
  console.log(gameState)
  if (gameState == 'init') {
    initGame();
  } else if (gameState == 'play') {
    console.log('play')
    runGame();
  } else if (gameState == 'end') {
    endGame();
  }
}

function setJelloShots(num) {
  var cols = floor(width / pixel_size);
  var rows = floor(height / pixel_size);


  for (var i = 0; i < num; i++) {
    var location = createVector(floor(random(cols)), floor(random(rows))).mult(pixel_size);
    while (snake_intersect(location)) {
      location = createVector(floor(random(cols)), floor(random(rows))).mult(pixel_size);
    }
    shots.push(location);
  }
}

function snake_intersect(location) {
  var intersect = false;
  if (location.x == snake.pos.x && location.y == snake.pos.y) {
    intersect = true;
  } else {
    for (var i = 0; i < snake.tail.length; i++) {
      if (location.x == snake.tail[i].x && location.y == snake.tail[i].y) {
        intersect = true;
        break;
      }
    }
    for (var i = 0; i < shots.length; i++) {
      if (location.x == shots[i].x && location.y == shots[i].y) {
        intersect = true;
        break;
      }
    }
  }
  return intersect;
}

function keyPressed() {
  /* if (keyCode === DOWN_ARROW) {
    movement.push([0, 1]);
  } else if (keyCode === UP_ARROW) {
    movement.push([0, -1]);
  } else if (keyCode === LEFT_ARROW) {
    movement.push([-1, 0]);
  } else if (keyCode === RIGHT_ARROW) {
    movement.push([1, 0]);
  } */

  /* for (var i = 0; i < path.length; i++) {
    if (path[i] === 'South') {
      movement.push([0, 1]);
     } else if (path[i] === 'North') {
       movement.push([0, -1]);
     } else if (path[i] === 'Weast') {
       movement.push([-1, 0]);
     } else if (path[i] === 'East') {
       movement.push([1, 0]);
     }
   } */

}