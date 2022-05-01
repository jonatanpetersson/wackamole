const state = { game: '', counter: 0, timeLeft: 10 };
let dbModel = { name: '', score: '' };

const main = document.querySelector('main');

const gameMenu = `
<h1>Whack-a-mole</h1>
<form class="menu-form">
<label>Seconds to play</label>
<input class="set-play-time" type="number" value="${state.timeLeft}" min="1" required>
<input class="start-game" type="submit" value="Start game">
</form>
<button class="highscore-button">Leaderboard</button>
`;

const gameOn = `
  <section class="game-field">
    <div class="game-field__square"></div>
    <div class="game-field__square"></div>
    <div class="game-field__square"></div>
    <div class="game-field__square"></div>
    <div class="game-field__square"></div>
    <div class="game-field__square"></div>
    <div class="game-field__square"></div>
    <div class="game-field__square"></div>
    <div class="game-field__square"></div>
  </section>
  <section class="game-stats">
    <div class="gamestats__whacked"> 0 whacked bunnies!!</div>
  </section>
`;

const gameOver = `
  <h2>Great whackin'!</h2>
  <h3 class="score"></h3>
  <h4>Submit to the leaderboard</h4>
  <form class="form">
    <input class="input" type="text" placeholder="Name">
    <input class="submit" type="submit" value="Submit">
  </form>
  <button class="highscore-button">Leaderboard</button>
  <button class="main-button">Main</button>
`;

const highScore = `
  <h1>Hall of fame</h1>
  <section class="leaderboard">
    <p>Loading...</p>
  </section>
  <button class="main-button">Main</button>
`;

const loadGameMenu = () => {
  main.innerHTML = gameMenu;
  const startButton = document.querySelector('.start-game');
  const highScore1Button = document.querySelector('.highscore-button');

  startButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    const playTime = document.querySelector('.set-play-time');
    state.timeLeft = playTime.value;
    render('gameOn')
  });
  highScore1Button.addEventListener('click', () => render('highScore'));
};

const loadGameOn = () => {
  state.counter = 0;
  main.innerHTML = gameOn;
  const whackCounter = document.querySelector('.gamestats__whacked');
  const mole = document.createElement('span');
  const nodes = document.querySelectorAll('.game-field__square');
  nodes.forEach(div => div.addEventListener('click', (ev) => {
    if (ev.currentTarget.innerHTML) {
      ev.currentTarget.firstChild.classList.add('md-red');
      state.counter++;
      whackCounter.innerHTML = `${state.counter} whacked bunnies!!`
    }
  }));

  const timer = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * nodes.length);
    const randomNode = nodes[randomIndex];
    mole.classList.remove('md-red');
    mole.classList.add('mole', 'opacity-zero', 'material-icons', 'md-48', 'md-light');
    mole.textContent = 'cruelty_free';
    randomNode.append(mole);
    setTimeout(() => randomNode.firstChild.classList.remove('opacity-zero'), 0);
    setTimeout(() => randomNode.firstChild.classList.add('opacity-zero'), 800);
    setTimeout(() => randomNode.innerHTML = '', 1000);
  }, 1500)

  setTimeout(() => {
    clearInterval(timer);
    render('gameOver')
  }, state.timeLeft * 1000);
};

const loadGameOver = () => {
  main.innerHTML = gameOver;
  const scoreField = document.querySelector('.score');
  const submitButton = document.querySelector('.submit');
  const menu1Button = document.querySelector('.main-button');
  const highScore2Button = document.querySelector('.highscore-button');

  scoreField.textContent = `You wacked ${state.counter} cute bunnies.`;
  submitButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    const inputField = document.querySelector('.input');
    const form = document.querySelector('.form');
    dbModel.name = inputField.value;
    dbModel.score = state.counter;
    form.innerHTML = '<p>Submitting to leaderboard...</p>';
    (async () => {
      await axios({
        method: 'post',
        url: 'http://localhost:5001/api/highscore',
        headers: {},
        data: dbModel,
      });
    })();
    form.innerHTML = '';
  });
  menu1Button.addEventListener('click', () => render('gameMenu'));
  highScore2Button.addEventListener('click', () => render('highScore'));
};

const loadHighScore = () => {
  main.innerHTML = highScore;
  const main2Button = document.querySelector('.main-button');
  const leaderBoard = document.querySelector('.leaderboard');

  (async () => {
    const data = await axios.get('http://localhost:5001/api/highscore');
    leaderBoard.innerHTML = '';
    data.data.forEach(obj => leaderBoard.innerHTML += `<p>${obj.score} - ${obj.name}</p>`);
  })();
  main2Button.addEventListener('click', () => render('gameMenu'));
};

const render = (mode) => {
  state.game = mode;
  switch (state.game) {
    case 'gameMenu':
      loadGameMenu();
      break;

    case 'gameOn':
      loadGameOn()
      break;

    case 'gameOver':
      loadGameOver();
      break;

    case 'highScore':
      loadHighScore()
      break;

    default:
      loadGameMenu();
      break;
  }
}

render('gameMenu');