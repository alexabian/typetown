import './style.css';
import { appTemplate } from './app-template.js';
import { ANIMALS } from './data.js';
import { loadState, saveState, state } from './state.js';
import { playClick, playSuccess, playUnlock, playWrong } from './audio.js';
import {
  attachKeyboardPressListener,
  buildKeyboard,
  highlightKey,
  makeClock,
  refreshHomeCoins,
  renderTask,
  setSparks,
  showCoinRain,
  showScreen,
  updateSidebar as renderSidebar,
} from './ui.js';
import { createTaskEngine } from './tasks.js';
import { createFarm } from './farm.js';
import { createGame } from './game.js';

document.body.innerHTML = appTemplate;

loadState();
refreshHomeCoins(state.profiles);
attachKeyboardPressListener();

const updateSidebar = () => renderSidebar(state, ANIMALS);
let game;

const taskEngine = createTaskEngine({
  state,
  renderTask: (task) =>
    renderTask(
      task,
      state,
      {
        checkAnswer: () => game.checkAnswer(),
      },
      { makeClock, playClick, highlightKey },
    ),
  setSparks,
  highlightKey,
});

const farm = createFarm({
  state,
  saveState,
  showScreen,
  setSparks,
  playUnlock,
  updateSidebar,
  showCoinRain,
});

game = createGame({
  state,
  saveState,
  refreshHomeCoins,
  showScreen,
  updateSidebar,
  buildKeyboard,
  generateTask: () => taskEngine.generateTask(),
  setSparks,
  playSuccess,
  playWrong,
  playUnlock,
  showCoinRain,
});

Object.assign(window, {
  selectProfile: game.selectProfile,
  goHome: game.goHome,
  showWork: farm.showWork,
  showFarm: farm.showFarm,
  leaveFarm: farm.leaveFarm,
  filterFarm: farm.filterFarm,
  nextTask: game.nextTask,
  checkAnswer: game.checkAnswer,
  checkChoice: game.checkChoice,
  submitFree: game.submitFree,
  continueAfterBreak: game.continueAfterBreak,
  checkClockChoice: game.checkClockChoice,
  buyAnimal: farm.buyAnimal,
  setSparks,
});
