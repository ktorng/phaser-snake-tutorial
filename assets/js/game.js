var snake, apple, squareSize, score, speed,
    updateDelay, direction, new_direction,
    addNew, cursors, scoreTextValue, speedTextValue,
    textStyle_Key, textStyle_Value;

var Game = {
  
  preload: function() {
    game.load.image('snake', './assets/images/snake.png');
    game.load.image('apple', './assets/images/apple.png');
  },

  create: function() {
    snake = [];
    apple = {};
    squareSize = 15;
    score = 0;
    speed = 0;
    updateDelay = 0;
    direction = 'right';
    new_direction = null;
    addNew = false;

    cursors = game.input.keyboard.createCursorKeys();

    game.stage.backgroundColor = '#061f27';

    for (var i = 0; i < 10; i++) {
      snake[i] = game.add.sprite(150+i*squareSize, 150, 'snake');
    }

    this.generateApple();

    textStyle_Key = { font: 'bold 14px sans-serif', fill: '#46c0f9', align: 'center' };
    textStyle_Value = { font: 'bold 18px sans-serif', fill: '#fff', align: 'center' };

    // Score
    game.add.text(30, 20, "SCORE", textStyle_Key);
    scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
    // Speed
    game.add.text(500, 20, "SPEED", textStyle_Key);
    speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

  },

  update: function() {
    
    // handle key presses
    if (cursors.right.isDown && direction != 'left') {
      new_direction = 'right';
    } else if (cursors.left.isDown && direction != 'right') {
      new_direction = 'left';
    } else if (cursors.up.isDown && direction != 'down') {
      new_direction = 'up';
    } else if (cursors.down.isDown && direction != 'up') {
      new_direction = 'down';
    }

    // formula to calculate game speed based on score
    speed = Math.min(15, Math.floor(score/5));
    speedTextValue.text = '' + speed;

    // update function of phaser has around 60 fps
    // slow it down to make game playable

    // increase a counter on every update call
    updateDelay++;

    // Do game stuff only if counter is aliquot to (10 - game speed)
    // higher the speed, the more frequently this is fulfilled
    if (updateDelay % (10 - speed) == 0) {
      
      // Snake movement
      var firstCell = snake[snake.length - 1];
      var lastCell = snake.shift();
      var oldLastCellx = lastCell.x;
      var oldLastCelly = lastCell.y;
      
      // If a new direction has been chosen, make it the direction of the snake now
      if (new_direction) {
        direction = new_direction;
        new_direction = null;
      }

      // Change the last cell's coordinates relative to the head of the snake, according
      // to the direction
      if (direction == 'right') {
        lastCell.x = firstCell.x + 15;
        lastCell.y = firstCell.y;
      } else if (direction == 'left') {
        lastCell.x = firstCell.x - 15;
        lastCell.y = firstCell.y;
      } else if (direction == 'up') {
        lastCell.x = firstCell.x;
        lastCell.y = firstCell.y - 15;
      } else if (direction == 'down') {
        lastCell.x = firstCell.x;
        lastCell.y = firstCell.y + 15;
      }

      // Place the last cell in the front of the stack
      // Mark it in the first cell
      snake.push(lastCell);
      firstCell = lastCell;
      // End of snake movement

      // Increase length of snake if an apple had been eaten
      // Create a block in the back of the snake with the old position of the previous
      // last block
      if (addNew) {
        snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
        addNew = false;
      }

      // Check for apple collision
      this.appleCollision();

      // Check for collision with self. Parameter is the head of the snake
      this.selfCollision(firstCell);

      // Check for collision with wall. Paramter is the head of the snake
      this.wallCollision(firstCell);

    }

  },

  appleCollision: function() {
    
    // Check if any part of the snake is overlapping the apple
    // needed if apple spawns inside of snake
    for (var i = 0; i < snake.length; i++) {
      if (snake[i].x == apple.x && snake[i].y == apple.y) {

        // add new block to its length
        addNew = true;

        // destroy old apple
        apple.destroy();

        // make a new one
        this.generateApple();

        // increase score
        score++;

        // refresh scoreboard
        scoreTextValue.text = score.toString();

      }
    }

  },

  selfCollision: function(head) {
    // check if head overlaps with any part of the snake
    for (var i = 0; i < snake.length - 1; i++) {
      if (head.x == snake[i].x && head.y == snake[i].y) {
        game.state.start('Game_Over');
      }
    }
  },

  wallCollision: function(head) {
    // check if head is in the boundaries of the game field
    if (head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0) {
      game.state.start('Game_Over');
    }
  },

  generateApple: function() {
    
    var randomX = Math.floor(Math.random() * 40) * squareSize;
    var randomY = Math.floor(Math.random() * 30) * squareSize;

    apple = game.add.sprite(randomX, randomY, 'apple');

  }


};
