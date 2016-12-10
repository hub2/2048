function Cell(val){
  this.val = val;
}
var cells;
var temp;
var gameSize = 4;
var message;
var finishRect;
var finished = false;
var button;

var DIRECTION = {
  UP : 0,
  LEFT : 3,
  RIGHT : 1,
  DOWN : 2
}
var RESULT = {
  WIN : 1,
  LOSE : 2
}


function setup() {
  createCanvas(500, 500);
  button = createButton('Play again');
  button.position(width/2, height*0.8);
  button.mousePressed(setupNewGame);
  setupNewGame();
}

function draw() {
  var startX = width*0.02;
  var startY = height*0.02;
  var rectSize = width*0.96 / gameSize; 
  var paddingSize = rectSize / 15;
  
  background(0);
  fill(color(187, 173, 160));
  rect(width*0.01, height*0.01, width * (1-0.02), height * (1-0.02));

  
  for(var i=0; i<gameSize; i++)
  {
    for (var j=0; j<gameSize; j++)
    {
      fill(205, 192, 180);
      rect(startX + j*rectSize + paddingSize, 
          startY + i*rectSize + paddingSize, 
          rectSize-2*paddingSize, 
          rectSize-2*paddingSize);
    }
  }

  for(var i=0; i<gameSize; i++)
  {
    for (var j=0; j<gameSize; j++)
    {
      if(cells[j][i].val !== 0)
      {
        var x = startX + j*rectSize;
        var y = startY + i*rectSize;
        var goodColor = 240-map(Math.log2(cells[j][i].val), 1, 7+gameSize, 0, 200);
        fill(240, goodColor, goodColor);
        rect(x + paddingSize,y + paddingSize, 
          rectSize-2*paddingSize, 
          rectSize-2*paddingSize);
          
        fill(0, 0, 0);
        var factor = map(ceil(Math.log10(cells[j][i].val)), 1, 6, 1, 2.5);
        textSize(256/gameSize/factor);
        textAlign(CENTER, CENTER);
        text(cells[j][i].val, x, y, rectSize, rectSize);
      }
    }
  }
  if(finished) {
    fill(0,0,0);
    rect(0,0,width,height);
    textAlign(CENTER, CENTER);
    fill(255,255,255);
    text(message, 0, 0, width, height);
    button.show();
  }
}

function keyPressed() {
  if (finished)
    return;
  var direction = null;
  if (keyCode === UP_ARROW) {
    direction = DIRECTION["UP"];
  } 
  if (keyCode === LEFT_ARROW) {
    direction = DIRECTION["LEFT"];
  }
  if (keyCode === RIGHT_ARROW) {
    direction = DIRECTION["RIGHT"];
  } 
  if (keyCode === DOWN_ARROW) {
    direction = DIRECTION["DOWN"];
  }
  if(direction !== null && moveAndMerge(direction))
  {
    finish(RESULT["WIN"]);
  }
  if (!addAtRandom())
  {
    finish(RESULT["LOSE"]);
  }
}

function addAtRandom()
{
  var val = 2;
  if (random()<0.1)
  {
    val = 4;
  }
  var x = floor(random(gameSize-1));
  var y = floor(random(gameSize-1));
  
  for(var i=0; i<gameSize; i++)
  {
    for(var j=0; j<gameSize; j++)
    {
      if(cells[(x+j)%gameSize][(y+i)%gameSize].val === 0)
      {
        cells[(x+j)%gameSize][(y+i)%gameSize].val = val;
        return true;
      }
    }
  }
  return false;
}

function moveAndMerge(direction)
{
  rotateMatrix(direction);
  var isGameOver = false;
  for(var i=1; i<gameSize; i++)
  {
    for(var j=0; j<gameSize; j++)
    {
      if (cells[j][i].val !== 0)
      {
        var newY=0;
        for(var k=i-1; k>=0; k--)
        {
          if (cells[j][k].val !== 0)
          {
            newY = k+1;
            break;
          }
        }
        if(cells[j][newY].val !== 0)
        {
          continue;
        }
        cells[j][newY].val = cells[j][i].val;
        cells[j][i].val = 0;
      }
    }
  }
  for(var i=0; i<gameSize-1; i++)
  {
    for(var j=0; j<gameSize; j++)
    {
      
      if (cells[j][i].val === cells[j][i+1].val) 
      {
        cells[j][i].val *= 2;
        if(cells[j][i].val === pow(2, gameSize+7))
          isGameOver = true;
        cells[j][i+1].val = 0;
        for(var k=i+1; k<gameSize-1; k++)
        {
          cells[j][k].val = cells[j][k+1].val;
          cells[j][k+1].val = 0;
        }
      }
    }
  }
  rotateMatrix(-direction);
  return isGameOver;
}

function rotateMatrix(rotations) {
  if(rotations < 0) {
    rotations = 4 + rotations;
  }
  for(var i = 0;i<rotations;i++) {
   for(var x= 0;x<gameSize;x++) {
     for(var y=0;y<gameSize;y++) {
       temp[x][y].val = cells[gameSize - y - 1][x].val;
     }
   } 
   for(var x= 0;x<gameSize;x++) {
     for(var y=0;y<gameSize;y++) {
       cells[x][y].val = temp[x][y].val;
     }
   } 
  }
}

function finish(result)
{
  finished = true;
  message = "Good job, you won";
  if(result == RESULT["LOSE"])
  {
    message = "Good job, you lost"
  }
}

function setupNewGame()
{
  finished = false;
  button.hide();
  cells = new Array(gameSize);
  temp = new Array(gameSize);
  for (var i = 0; i < gameSize; i++) {
    cells[i] = new Array(gameSize);
    temp[i] = new Array(gameSize);
    for(var j = 0; j < gameSize; j++){
      cells[i][j] = new Cell(0);
      temp[i][j] = new Cell(0);
    }
  }
  for (var z = 0; z<4; z++){
    addAtRandom();
  }
}
