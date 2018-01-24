document.addEventListener('DOMContentLoaded', function () {
  var canvas, ctx, reset, table, piece, winner, turn = 'user', style;

  function setUpBody() {
    let body = document.body.style;
    document.documentElement.style.height = '100%';
    body.height = '100%';
    body.margin = 0;
    body.backgroundColor = 'indigo';
    body.display = 'flex';
    body.justifyContent = 'center';
    body.alignItems = 'center';
    body.flexDirection = 'column';

    style = document.createElement('style');
    document.head.appendChild(style);
    style = style.sheet;
    style.insertRule('button {outline: none;}', 0);
    style.insertRule('canvas {-webkit-transition: opacity 0.3s ease}', 0);
  }

  //------------------------------------------------------------------------------------- UI Functions

  function chooseBoard() {
    var choose = document.createElement('div');
    choose.id = 'choose-piece';
    choose.style.height = '300px';
    choose.style.width = '500px';
    choose.style.backgroundColor = 'white';
    choose.style.boxShadow = '0 0 20px 0 black';
    choose.style.borderRadius = '10px';
    choose.style.display = 'flex';
    choose.style.justifyContent = 'space-around';
    choose.style.alignItems = 'center';

    var buttonX = document.createElement('button');
    buttonX.className = 'choose-button';
    buttonX.textContent = 'X';
    buttonX.style.color = 'white';

    var buttonO = document.createElement('button');
    buttonO.className = 'choose-button';
    buttonO.textContent = 'O';
    buttonO.style.color = 'red';

    choose.appendChild(buttonX);
    choose.appendChild(buttonO);
    document.body.appendChild(choose);

    var chooseButtons = document.getElementsByClassName('choose-button');
    for (var i in chooseButtons) {
      if (chooseButtons.hasOwnProperty(i)) {
        chooseButtons[i].style.width = '200px';
        chooseButtons[i].style.height = '200px';
        chooseButtons[i].style.backgroundColor = '#222222';
        chooseButtons[i].style.fontSize = '150px';
        chooseButtons[i].style.borderRadius = '15px';
        chooseButtons[i].style.border = 'none';
        chooseButtons[i].style.cursor = 'pointer';
        chooseButtons[i].style.boxShadow = '0 0 20px 0 black';
      }
    }

    function launchApp(x) {
      piece = x;
      var fade = 1;
      var anim = setInterval(function () {
        if (fade < 0) {
          document.body.removeChild(choose);
          clearInterval(anim);
        } else {
          choose.style.opacity = fade;
          fade -= 0.1;
        }
      }, 15);
      setTimeout(createCanvas, 220);
    }

    buttonX.addEventListener('click', function () {
      launchApp('X');
    });

    buttonO.addEventListener('click', function () {
      launchApp('O');
    });
  }

  function createCanvas() {
    // Sets up a basic canvas and adds it to the document
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600;
    canvas.style.backgroundColor = '#222222';
    canvas.style.boxShadow = '0 0 20px 0 black';
    canvas.style.borderRadius = '10px';
    canvas.style.opacity = '0';
    document.body.appendChild(canvas);
    var fade = 0;
    var anim = setInterval(function () {
      if (fade > 1) {
        clearInterval(anim);
        drawTable();
        table = gameTable();

        createResetButton();
        loadEventHandlers();
      } else {
        canvas.style.opacity = fade;
        fade += 0.1;
      }
    }, 20);
    initScoreBoard();
  }

  function drawTable() {
    // Draws the game table inside the canvas
    ctx.save();
    ctx.strokeStyle = '#DDDDDD';
    ctx.lineWidth = '5';
    ctx.beginPath();
    ctx.moveTo(200, 10);
    ctx.lineTo(200, 590);
    ctx.moveTo(400, 10);
    ctx.lineTo(400, 590);
    ctx.moveTo(10, 200);
    ctx.lineTo(590, 200);
    ctx.moveTo(10, 400);
    ctx.lineTo(590, 400);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function drawX(x,y) {
    // Draws the X for players
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.translate(x, y);
    ctx.rotate((Math.PI / 180) * 45);
    ctx.translate(-x, -y);
    ctx.fillRect(x - 100, y - 15, 200, 30);
    ctx.translate(x, y);
    ctx.rotate((Math.PI / 180) * -90);
    ctx.translate(-x, -y);
    ctx.fillRect(x - 100, y - 15, 200, 30);
    ctx.restore();
  }

  function drawO(x, y) {
    // Draws the O for players
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.arc(x, y, 70, (Math.PI / 180) * 0, (Math.PI / 180) * 360);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function createResetButton() {
    // Create and add to document a 'Reset' button to restart the game
    reset = document.createElement('button');
    reset.id = 'reset';
    reset.style.width = '60px';
    reset.style.height = '60px';
    reset.style.position = 'fixed';
    reset.style.top = '50px';
    reset.style.right = '50px';
    reset.style.backgroundColor = 'white';
    reset.style.fontFamily = 'monospace';
    reset.style.color = '#222222';
    reset.style.border = 'none';
    reset.style.borderRadius = '10px';
    reset.style.boxShadow = '0 0 20px 0 black';
    reset.style.cursor = 'pointer';
    reset.style.userSelect = 'none';
    reset.textContent = 'Clear';
    document.body.appendChild(reset);
  }


  function initScoreBoard(winner) {
    var score = document.createElement('div');
    score.style.width = '560px';
    score.style.marginTop = '10px';
    score.style.display = 'flex';
    score.style.justifyContent = 'space-between';
    score.style.fontFamily = 'monospace';
    score.style.textTransform = 'uppercase';
    score.style.color = 'white';
    score.style.opacity = '0';

    var userWins = document.createElement('h1');
    userWins.id = 'user-score';
    userWins.textContent = 'User: ' + winners.user;
    var programWins = document.createElement('h1');
    programWins.textContent = 'Program: ' + winners.program;
    programWins.id = 'program-score';
    var draws = document.createElement('h1');
    draws.textContent = 'draws: ' + winners.draw;
    draws.id = 'draws-score';

    score.appendChild(userWins);
    score.appendChild(draws);
    score.appendChild(programWins);
    document.body.appendChild(score);
    var fade = 0;
    var anim = setInterval(function () {
      if (fade > 1) {
        clearInterval(anim);
      } else {
        score.style.opacity = fade;
        fade += 0.1;
      }
    }, 20);
  }

  function updateScoreBoard() {
    document.getElementById('user-score').textContent = 'User: ' + winners.user;
    document.getElementById('program-score').textContent = 'Program: ' + winners.program;
    document.getElementById('draws-score').textContent = 'Draws: ' + winners.draw;
  }

  //---------------------------------------------------------------------------------------- Game Functions

  var winners = {
    user: 0,
    program: 0,
    draw: 0
  };

  function gameTable() {
    // Generates a gameTable object with info about each cell
    var cellWidth = canvas.width / 3;
    var cellHeight = canvas.height / 3;
    var table = [];
    for (var i = 0; i < 3; i++) {
      table.push([]);
      for (var j = 0; j < 3; j++) {
        table[i].push({
          id: [i, j],
          area: [cellWidth * j, cellWidth * (j + 1), cellHeight * i, cellHeight * (i + 1)],
          center: [(cellWidth * j) + (cellWidth / 2), (cellHeight * i) + (cellHeight / 2)],
          playedBy: ''
        });
      }
    }
    return table;
  }

  function gameFlow(lastMove) {
    // Checks playable cells, if game is over, and player turns
    var playableCells = [];
    for (var i =  0; i < table.length; i++)
      for (var j = 0; j < table[i].length; j++)
        if (!table[i][j].playedBy)
          playableCells.push(table[i][j]);
    if (gameOver(lastMove)) {
      canvas.removeEventListener('click', canvasClick);
      setTimeout(function() {
        updateScoreBoard();
        resetGame();
      }, 400);
    } else if (turn == 'program') {
      setTimeout(function() {
        programMove(playableCells);
      }, 400);
    }
  }

  function gameOver(lastMove) {
    // Checks conditions for the game to be over and return a boolean
    var i, j, row = [], column = [], diagonalLeft, diagonalRight;

    // Checks if player has completed a row or column
    for (i = 0; i < table[lastMove[0]].length; i++)
      row.push(table[lastMove[0]][i]);
    for (i = 0; i < table[lastMove[1]].length; i++)
      column.push(table[i][lastMove[1]]);
    if (row.every((cell) => (cell.playedBy == 'user')) || column.every((cell) => (cell.playedBy == 'user'))) {
      winners.user++;
      return true;
    } else if (row.every((cell) => (cell.playedBy == 'program')) || column.every((cell) => (cell.playedBy == 'program'))) {
      winners.program++;
      return true;
    }

    // Checks if player has played a tile in a diagonal and
    // generates an array with those tiles
    if (lastMove[0] == lastMove[1]) {
      diagonalLeft = [];
      for (i = 0; i < table.length; i++)
        for (j = 0; j < table[i].length; j++)
          if(i == j)
            diagonalLeft.push(table[i][j]);
    }
    if (lastMove[0] + lastMove[1] == 2) {
      diagonalRight = [];
      for (i = 0; i < table.length; i++)
        for (j = 0; j < table[i].length; j++)
          if (i + j == 2)
            diagonalRight.push(table[i][j]);
    }

    // Checks if player has completed a diagonal
    if (diagonalLeft)
      if (diagonalLeft.every((cell) => (cell.playedBy == 'user'))) {
        winners.user++;
        return true;
      } else if (diagonalLeft.every((cell) => (cell.playedBy == 'program'))) {
        winners.program++;
        return true;
      }
    if (diagonalRight)
      if (diagonalRight.every((cell) => (cell.playedBy == 'user'))) {
        winners.user++;
        return true;
      } else if (diagonalRight.every((cell) => (cell.playedBy == 'program'))) {
        winners.program++;
        return true;
      }

    // Checks if all the tiles are played
    for (i = 0; i < table.length; i++)
      for (j = 0; j < table[i].length; j++)
        if (!table[i][j].playedBy)
          return false;
    winners.draw++;
    return true;
  }

  function programMove(cells) {
    // Sets the rules for program's moves
    var i, j, move, priorMove = null, tempMove = null, posibleMoves = null;

    // 1. Checks if a player has already played two cells in the same row
    for (i = 0; i < table.length; i++) {
      posibleMoves = table[i].reduce(function (a, b) {
        if (b.playedBy != 'user')
          a[0].push(b);
        if (b.playedBy != 'program')
          a[1].push(b);
        return a;
      }, [[],[]]);
      if (posibleMoves[0].length == 1 && posibleMoves[0][0].playedBy != 'program')
        tempMove = posibleMoves[0][0];
      if (posibleMoves[1].length == 1 && posibleMoves[1][0].playedBy != 'user')
        priorMove = posibleMoves[1][0];
    }

    // 2. Checks if user has already played two cells in the same column
    for (i = 0; i < 3; i++) {
      if (posibleMoves) posibleMoves = [];
      for (j = 0; j < 3; j++) {
        posibleMoves.push(table[j][i]);
      }
      posibleMoves = posibleMoves.reduce(function (a, b) {
        if (b.playedBy != 'user')
          a[0].push(b);
        if (b.playedBy != 'program')
          a[1].push(b);
        return a;
      }, [[],[]]);
      if (posibleMoves[0].length == 1 && posibleMoves[0][0].playedBy != 'program')
        tempMove = posibleMoves[0][0];
      if (posibleMoves[1].length == 1 && posibleMoves[1][0].playedBy != 'user')
        priorMove = posibleMoves[1][0];
    }

    // 3. Checks if a player has already played two tiles in the same diagonal
    posibleMoves = [[],[]];
    for (i = 0; i < 3; i++)
      for (j = 0; j < 3; j++) {
        if (i == j)
          posibleMoves[0].push(table[i][j]);
        if (i + j == 2)
          posibleMoves[1].push(table[i][j]);
      }
    let posibleMoves1 = posibleMoves[0].reduce(function (a, b) {
      if (b.playedBy != 'user')
        a[0].push(b);
      if (b.playedBy != 'program')
        a[1].push(b);
      return a;
    }, [[], []]);
    posibleMoves = posibleMoves[1].reduce(function (a, b) {
      if (b.playedBy != 'user')
        a[0].push(b);
      if (b.playedBy != 'program')
        a[1].push(b);
      return a;
    }, [[], []]);
    if (posibleMoves[0].length == 1 && posibleMoves[0][0].playedBy != 'program')
      tempMove = posibleMoves[0][0];
    if (posibleMoves[1].length == 1 && posibleMoves[1][0].playedBy != 'user')
      priorMove = posibleMoves[1][0];
    if (posibleMoves1[0].length == 1 && posibleMoves1[0][0].playedBy != 'program')
      tempMove = posibleMoves1[0][0];
    if (posibleMoves1[1].length == 1 && posibleMoves1[1][0].playedBy != 'user')
      priorMove = posibleMoves1[1][0];

    // Evaluates all the stored moves to use one
    if (priorMove)
      move = priorMove;
    else if (tempMove)
      move = tempMove;
    else
      move = cells[Math.floor(Math.random() * cells.length)];

    // Executes move
    if (piece == 'O')
      drawX(move.center[0], move.center[1]);
    else if (piece == 'X')
      drawO(move.center[0], move.center[1]);
    move.playedBy = 'program';
    turn = 'user';
    gameFlow(move.id);
  }


  function resetGame() {
    // Clear canvas and reset all game values to default
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTable();
    canvas.addEventListener('click', canvasClick);
    winner = '';
    var i, j;
    for (i = 0; i < table.length; i++)
      for (j = 0; j < table[i].length; j++)
        table[i][j].playedBy = '';
    if (turn == 'program') {
      var cells = [];
      for (i = 0; i < table.length; i++)
        for (j = 0; j < table[i].length; j++)
          cells.push(table[i][j]);
      setTimeout(function() {
        programMove(cells);
      }, 400);
    }
  }

  //---------------------------------------------------------------------------------------- Event Handlers

  function loadEventHandlers() {
    reset.addEventListener('click', function () {
      resetGame();
      for (var key in winners) {
        if (winners.hasOwnProperty(key))
          winners[key] = 0;
      }
      updateScoreBoard();
    });
    canvas.addEventListener('click', canvasClick);
  }

  function canvasClick(event) {
    // Handles clicks on canvas
    var mouse = getMousePosition(event);
    for (var i = 0; i < table.length; i++)
    for (var j = 0; j < table[i].length; j++)
    if (mouse.x >= table[i][j].area[0] && mouse.x <= table[i][j].area[1] && mouse.y >= table[i][j].area[2] && mouse.y <= table[i][j].area[3])
    if (!table[i][j].playedBy && turn == 'user') {
      if (piece == 'X')
      drawX(table[i][j].center[0], table[i][j].center[1]);
      else if (piece == 'O')
      drawO(table[i][j].center[0], table[i][j].center[1]);
      table[i][j].playedBy = 'user';
      turn = 'program';
      gameFlow(table[i][j].id);
    }
  }

  function getMousePosition(event) {
    // Gets the coordinades of the canvas in relation with the portview and
    // use them to calculate the coordinades of the mouse inside the canvas
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  //--------------------------------------------------------------------------------------- App flow

  setUpBody();
  chooseBoard();

});
