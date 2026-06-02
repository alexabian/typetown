import { BREAK_MSGS, SPARKS_ENCOURAGE, SPARKS_PRAISE } from './data.js';
import { resetSessionState } from './state.js';

function normalizeAnswer(value) {
  return String(value).trim().toLowerCase();
}

export function createGame({ state, saveState, refreshHomeCoins, showScreen, updateSidebar, buildKeyboard, generateTask, setSparks, playSuccess, playWrong, playUnlock, showCoinRain }) {
  function selectProfile(name) {
    state.profile = name;
    resetSessionState();
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

  function checkChoice(chosen) {
    if (normalizeAnswer(chosen) === normalizeAnswer(state.currentTask.answer)) {
      onCorrect();
    } else {
      playWrong();
      document.querySelectorAll('.task-choice-btn, .clock-choice-btn').forEach((btn) => {
        if (normalizeAnswer(btn.textContent) === normalizeAnswer(chosen)) {
          btn.classList.add('shake');
          setTimeout(() => btn.classList.remove('shake'), 400);
        }
      });
      setSparks('😅', SPARKS_ENCOURAGE[Math.floor(Math.random() * SPARKS_ENCOURAGE.length)]);
    }
  }

  function checkClockChoice(chosen) {
    checkChoice(chosen);
  }

  function checkAnswer() {
    const inp = document.getElementById('task-input');
    if (!inp) return;
    if (normalizeAnswer(inp.value) === normalizeAnswer(state.currentTask.answer)) onCorrect();
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

  function getCompletionText(task, isFree) {
    if (isFree) return '...done! ✍️';
    const input = document.getElementById('task-input');
    if (input) return input.value.toUpperCase();
    if (task.type === 'counting' || task.type === 'counting_easy') return String(task.answer);
    if (task.type.includes('choice') || task.choices) return String(task.answer).toUpperCase();
    return '✓';
  }

  function onCorrect(isFree = false) {
    document.querySelectorAll('.task-input, .submit-btn, .free-typing-area, .clock-choice-btn, .task-choice-btn').forEach((el) => {
      el.disabled = true;
    });
    const task = state.currentTask;
    const prof = state.profiles[state.profile];
    prof.coins += task.points;
    prof.tasksCompleted++;
    state.sessionCorrect++;
    state.completedLines.push({
      label: task.badge + ' — ' + (task.target || task.wordPreview || 'Notes'),
      value: getCompletionText(task, isFree),
    });
    updateSidebar();
    saveState();
    playSuccess();
    showCoinRain(task.points);
    const praise = SPARKS_PRAISE[Math.floor(Math.random() * SPARKS_PRAISE.length)];
    setSparks('🤩', `${praise} +${task.points} coins! 🪙`);
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
    checkChoice,
    checkClockChoice,
    checkAnswer,
    submitFree,
    continueAfterBreak,
    nextTask,
  };
}
