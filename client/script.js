const state = {
  game: '',
  counter: 0,
  timeLeft: 10,
}

const dbModel = {
  name: '',
  score: '',
}

const gameMenu = `
<h1>Wackamole</h1>
<form class="menu-form">
<label>Seconds to play</label>
<input class="set-play-time" type="number" value="${state.timeLeft}" min="1" required>
<input class="start-game" type="submit" value="Start game">
</form>
`
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
    <div class="gamestats__whacked"></div>
  </section>
`
const gameOver = `
  <h2>Great wackin'!</h2>
  <h3 class="score"></h3>
  <h4>Submit to the leaderboard</h4>
  <form class="form">
    <input class="input" type="text" placeholder="Name">
    <input class="submit" type="submit" value="Submit">
  </form>
  <button>Main</button>
  <h1>Hall of fame</h1>
  <section class="leaderboard">
    <p>Loading...</p>
  </section>
`
const highScore = `
  <h1>Hall of fame</h1>
  <section>
  </section>
`
const runGameOn = (ev) => {
  ev.preventDefault();
  const playTime = document.querySelector('.set-play-time');
  state.timeLeft = playTime.value;
  render('gameOn');

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

const main = document.querySelector('main');

const render = (mode) => {
  state.game = mode;
  switch (state.game) {
    case 'gameMenu':
      main.innerHTML = gameMenu;
      const startButton = document.querySelector('.start-game');
      startButton.addEventListener('click', runGameOn);
      break;
    case 'gameOn':
      main.innerHTML = gameOn;
      break;
    case 'gameOver':
      main.innerHTML = gameOver;
      const scoreField = document.querySelector('.score');
      const leaderBoard = document.querySelector('.leaderboard');
      let leaderBoardInnerHtml = '';
      const inputField = document.querySelector('.input');
      const submitButton = document.querySelector('.submit');
      scoreField.textContent = `You wacked ${state.counter} cute bunnies.`;

      (async () => {
        const data = await axios.get('http://localhost:5001/api/highscore');
        leaderBoardInnerHtml = '';
        data.data.forEach(obj => leaderBoardInnerHtml += `<p>${obj.score} - ${obj.name}</p>`);
        leaderBoard.innerHTML = leaderBoardInnerHtml;
      })();
      break;
    case 'highScore':
      main.innerHTML = highScore;
      break;
    default:
      main.innerHTML = gameMenu;
      break;
  }
}

render('gameMenu');