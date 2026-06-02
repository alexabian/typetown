import { ANIMALS, BREAK_MSGS, SPARKS_ENCOURAGE, SPARKS_PRAISE } from './data.js';

export function createGame({ state, saveState, refreshHomeCoins, showScreen, updateSidebar, buildKeyboard, generateTask, setSparks, playSuccess, playWrong, playUnlock, showCoinRain }) {
  function selectProfile(name) {
    state.profile = name;
    state.completedLines = [];
    state.taskQueue = [];
    state.sessionCorrect = 0;
    updateSidebar();
    showScreen('game');
    generateTask();
    buildKeyboard();
  }

  function goHome() {
    saveState();
    showScreen('profile');
    refreshHomeCoins(state.profiles);
  }

  function checkClockChoice(chosen) {
    if (chosen === state.currentTask.answer) {
      onCorrect();
    } else {
      playWrong();
      document.querySelectorAll('.clock-choice-btn').forEach((btn) => {
        if (btn.textContent.trim() === chosen) {
          btn.classList.add('shake');
          setTimeout(() => btn.classList.remove('shake'), 400);
        }
      });
      setSparks('😅', SPARKS_ENCOURAGE[Math.floor(Math.random() * SPARKS_ENCOURAGE.length)]);
    }
  }

  function checkAnswer() {
    const inp = document.getElementById('task-input');
    if (!inp) return;
    if (inp.value.trim().toLowerCase() === state.currentTask.answer) onCorrect();
    else onWrong(inp);
  }

  function submitFree() {
    const ta = document.getElementById('free-input');
    if (!ta || ta.value.trim().length < 3) {
      setSparks('😄', 'Keep typing — write more! 💕');
      return;
    }
    onCorrect(true);
  }

  function onCorrect(isFree = false) {
    document.querySelectorAll('.task-input, .submit-btn, .free-typing-area, .clock-choice-btn').forEach((el) => {
      el.disabled = true;
    });
    const task = state.currentTask;
    const prof = state.profiles[state.profile];
    prof.coins += task.points;
    prof.tasksCompleted++;
    state.sessionCorrect++;
    const val = isFree
      ? '...done! ✍️'
      : document.getElementById('task-input')
        ? document.getElementById('task-input').value.toUpperCase()
        : '✓';
    state.completedLines.push({ label: task.badge + ' — ' + (task.target || 'Notes'), value: val });
    updateSidebar();
    saveState();
    playSuccess();
    showCoinRain(task.points);
    const praise = SPARKS_PRAISE[Math.floor(Math.random() * SPARKS_PRAISE.length)];
    setSparks('🤩', praise + ' +' + task.points + ' coins! 🪙');
    document.getElementById('doc-status').textContent = 'Saved ✓';
    if (state.sessionCorrect % 5 === 0) {
      const bonus = state.sessionCorrect <= 5 ? 10 : state.sessionCorrect <= 10 ? 15 : 20;
      prof.coins += bonus;
      updateSidebar();
      saveState();
      setTimeout(() => showBreak(state.sessionCorrect, bonus), 1500);
    } else {
      setTimeout(() => {
        generateTask();
        updateSidebar();
      }, 1300);
    }
  }

  function showBreak(streak, bonus) {
    const msg = BREAK_MSGS[Math.floor(Math.random() * BREAK_MSGS.length)];
    const tier = streak >= 15 ? '🌈 MEGA' : streak >= 10 ? '💫 Super' : '🌟 Mini';
    const popup = document.getElementById('break-popup');
    popup.innerHTML = `<div class="break-popup-box">
    <div class="break-emoji">${msg.emoji}</div>
    <div class="break-title">${msg.title}</div>
    <div class="break-sub">${msg.sub}</div>
    <div class="break-bonus">🪙 +${bonus} bonus coins!</div>
    <button class="break-continue-btn" onclick="continueAfterBreak()">Keep going! 💪</button>
  </div>`;
    popup.style.display = 'flex';
    playUnlock();
    showCoinRain(bonus);
    setSparks('🤩', `${tier} Break! +${bonus} bonus coins! 🎉`);
  }

  function continueAfterBreak() {
    document.getElementById('break-popup').style.display = 'none';
    generateTask();
    updateSidebar();
  }

  function onWrong(inp) {
    playWrong();
    inp.classList.add('shake');
    setTimeout(() => inp.classList.remove('shake'), 400);
    setSparks('😅', SPARKS_ENCOURAGE[Math.floor(Math.random() * SPARKS_ENCOURAGE.length)]);
    inp.value = '';
    inp.focus();
  }

  function nextTask() {
    generateTask();
  }

  return {
    selectProfile,
    goHome,
    checkClockChoice,
    checkAnswer,
    submitFree,
    continueAfterBreak,
    nextTask,
  };
}
