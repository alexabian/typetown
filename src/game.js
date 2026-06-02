import { BREAK_MSGS, QUEST_LIBRARY, SPARKS_ENCOURAGE, SPARKS_PRAISE, SURPRISE_EVENTS } from './data.js';
import { resetSessionState } from './state.js';

function normalizeAnswer(value) {
  return String(value).trim().toLowerCase();
}

function sample(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createQuests(profileName) {
  return QUEST_LIBRARY[profileName].map((quest, index) => ({
    ...quest,
    id: `${profileName}-quest-${index}`,
    progress: 0,
    done: false,
  }));
}

function isWordTask(task) {
  return task.category === 'words';
}

function isMathTask(task) {
  return task.category === 'math';
}

function getOwnedHelpers(state) {
  return state.profiles[state.profile]?.owned || [];
}

function getHintForTask(task) {
  if (task.type === 'friends_of_ten' || task.type === 'friends_of_ten_easy') {
    return `${task.friendNumber} needs ${10 - task.friendNumber} more to make 10.`;
  }
  if (task.type === 'missing_number' || task.type === 'count_by5' || task.type === 'count_by10') {
    return 'Look at how much the numbers jump each time.';
  }
  if (task.type === 'emoji_pattern' || task.type === 'emoji_pattern_easy') {
    return 'Look for the little pattern that repeats.';
  }
  if (task.type === 'before_letter') {
    return `Say the alphabet and stop just before ${task.target}.`;
  }
  if (task.type === 'after_letter') {
    return `Say the alphabet and go one step after ${task.target}.`;
  }
  if (task.type === 'word_scramble') {
    return `The word starts with ${task.displayWord[0]}.`;
  }
  if (task.type === 'compare_numbers' || task.type === 'bigger_number_easy') {
    return 'The bigger number is the one with the greater value.';
  }
  return null;
}

function getTaskLabel(task) {
  return String(task.badge || task.title || 'Task').replace(/^👑\s*/, '');
}

function questMatches(task, quest, nextSessionCorrect) {
  if (quest.kind === 'count') return nextSessionCorrect;
  if (quest.kind === 'badge') return getTaskLabel(task) === quest.target ? 1 : 0;
  if (quest.kind === 'category') return task.category === quest.target ? 1 : 0;
  return 0;
}

function pickEvent(state) {
  const owned = getOwnedHelpers(state);
  const chance = owned.includes('unicorn') ? 0.38 : 0.22;
  if (Math.random() > chance) return null;
  const event = { ...sample(SURPRISE_EVENTS) };
  if (event.type === 'math-party') event.forceMode = 'math';
  if (event.type === 'word-party') event.forceMode = 'words';
  if (event.type === 'pattern-party') event.forceMode = 'patterns';
  return event;
}

function getBossTitle(mode) {
  if (mode === 'math') return 'Number Boss';
  if (mode === 'words') return 'Word Wizard';
  if (mode === 'patterns') return 'Puzzle Parade';
  return 'Office Boss';
}

export function createGame({
  state,
  saveState,
  refreshHomeCoins,
  showScreen,
  updateSidebar,
  buildKeyboard,
  generateTask,
  setSparks,
  playSuccess,
  playWrong,
  playUnlock,
  showCoinRain,
}) {
  function refreshUI() {
    updateSidebar();
    refreshHomeCoins(state.profiles);
  }

  function showPopup({ emoji, title, sub, bonus, buttonText = 'Keep going ✨' }) {
    const popup = document.getElementById('break-popup');
    popup.innerHTML = `<div class="break-popup-box">
      <div class="break-emoji">${emoji}</div>
      <div class="break-title">${title}</div>
      <div class="break-sub">${sub}</div>
      ${bonus ? `<div class="break-bonus">${bonus}</div>` : ''}
      <button class="break-continue-btn" onclick="continueAfterBreak()">${buttonText}</button>
    </div>`;
    popup.style.display = 'flex';
  }

  function startBossRound() {
    const mode = state.mode === 'mixed' ? sample(['math', 'words', 'patterns']) : state.mode;
    state.activeBoss = {
      title: getBossTitle(mode),
      remaining: 3,
      reward: state.profile === 'lidia' ? 18 : 14,
      mode,
    };
    refreshUI();
    showPopup({
      emoji: '👑',
      title: state.activeBoss.title,
      sub: 'Three special jobs in a row! Finish them for a bonus chest.',
      bonus: `🪙 Bonus ${state.activeBoss.reward}`,
      buttonText: 'Start boss round! 💥',
    });
  }

  function finishBossRound() {
    const reward = state.activeBoss.reward;
    state.profiles[state.profile].coins += reward;
    state.activeBoss = null;
    saveState();
    refreshUI();
    showCoinRain(Math.max(6, Math.ceil(reward / 2)), '👑', '1.7rem');
    showPopup({
      emoji: '🏆',
      title: 'Boss cleared!',
      sub: 'You finished all 3 special jobs. The whole office is cheering!',
      bonus: `+${reward} bonus coins`,
      buttonText: 'Back to work 🌟',
    });
  }

  function maybeQueueEvent() {
    if (state.activeBoss || state.pendingEvent || state.activeTaskEvent) return;
    const event = pickEvent(state);
    if (!event) return;
    state.pendingEvent = event;
    setSparks(event.face, event.message);
    refreshUI();
  }

  function maybeShowBreak() {
    if (state.sessionCorrect === 0 || state.sessionCorrect % 5 !== 0) return false;
    const streak = state.sessionCorrect;
    const msg = sample(BREAK_MSGS);
    const owned = getOwnedHelpers(state);
    let bonus = streak >= 15 ? 10 : streak >= 10 ? 8 : 5;
    if (owned.includes('panda')) bonus += 3;
    state.profiles[state.profile].coins += bonus;
    saveState();
    refreshUI();
    showCoinRain(Math.max(4, bonus - 1), '💖', '1.3rem');
    showPopup({
      emoji: msg.emoji,
      title: msg.title,
      sub: msg.sub,
      bonus: `+${bonus} break bonus`,
    });
    return true;
  }

  function applyQuestProgress(task) {
    let questBonus = 0;
    const completedNow = [];
    const nextSessionCorrect = state.sessionCorrect;
    state.quests.forEach((quest) => {
      if (quest.done) return;
      const gain = questMatches(task, quest, nextSessionCorrect);
      if (!gain) return;
      if (quest.kind === 'count') {
        quest.progress = Math.min(quest.goal, gain);
      } else {
        quest.progress = Math.min(quest.goal, quest.progress + gain);
      }
      if (quest.progress >= quest.goal) {
        quest.done = true;
        questBonus += quest.reward;
        completedNow.push(quest.label);
      }
    });
    return { questBonus, completedNow };
  }

  function getTaskCoinBonus(task) {
    const owned = getOwnedHelpers(state);
    let bonus = 0;
    const notes = [];
    if (owned.includes('fox') && isWordTask(task)) {
      bonus += 1;
      notes.push('🦊 fox bonus');
    }
    if (owned.includes('parrot') && isMathTask(task)) {
      bonus += 1;
      notes.push('🦜 parrot bonus');
    }
    if (owned.includes('unicorn') && task.eventMeta) {
      bonus += 1;
      notes.push('🦄 unicorn sparkle');
    }
    return { bonus, notes };
  }

  function gradeCorrect(answerLabel) {
    const task = state.currentTask;
    const prof = state.profiles[state.profile];
    const praise = sample(SPARKS_PRAISE);
    const { bonus: helperBonus, notes } = getTaskCoinBonus(task);

    let totalReward = task.points + helperBonus;
    let messageBits = [`${praise} +${totalReward} coins! 🪙`];
    if (notes.length) messageBits.push(notes.join(' · '));

    prof.coins += totalReward;
    prof.tasksCompleted += 1;
    state.sessionCorrect += 1;
    state.completedLines.push({ label: getTaskLabel(task), value: answerLabel });
    state.completedLines = state.completedLines.slice(-12);

    const { questBonus, completedNow } = applyQuestProgress(task);
    if (questBonus) {
      prof.coins += questBonus;
      messageBits.push(`Quest bonus +${questBonus}`);
      showCoinRain(Math.max(5, Math.ceil(questBonus / 2)), '✨', '1.4rem');
    }

    playSuccess();
    showCoinRain(Math.max(4, Math.min(8, Math.ceil(totalReward / 2))));
    setSparks('🤩', messageBits.join(' · '));
    document.getElementById('doc-status').textContent = 'Saved ✓';

    state.activeTaskEvent = null;

    if (state.activeBoss) {
      state.activeBoss.remaining -= 1;
      if (state.activeBoss.remaining <= 0) {
        saveState();
        refreshUI();
        finishBossRound();
        return;
      }
    }

    saveState();
    refreshUI();

    if (completedNow.length) {
      setTimeout(() => setSparks('🥳', `Quest complete! ${completedNow[0]} +${questBonus} coins!`), 250);
    }

    if (!state.activeBoss && state.sessionCorrect >= 4 && state.sessionCorrect % 6 === 0) {
      startBossRound();
      return;
    }

    maybeQueueEvent();
    if (maybeShowBreak()) return;

    setTimeout(() => generateTask(), 700);
  }

  function onWrong() {
    const task = state.currentTask;
    const owned = getOwnedHelpers(state);
    const hint = owned.includes('owl') && !state.shieldHintUsed ? getHintForTask(task) : null;
    if (hint) {
      state.shieldHintUsed = true;
      setSparks('🦉', `Hint: ${hint}`);
      document.getElementById('doc-status').textContent = 'Hint ready!';
    } else {
      setSparks('😅', sample(SPARKS_ENCOURAGE));
    }
    playWrong();
    const input = document.getElementById('task-input');
    if (input) {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 350);
      input.focus();
    }
  }

  function checkAnswer() {
    const task = state.currentTask;
    const input = document.getElementById('task-input');
    if (!input) return;
    const answer = normalizeAnswer(input.value);
    if (!answer) return;
    if (answer === normalizeAnswer(task.answer)) {
      gradeCorrect(input.value.trim().toUpperCase());
    } else {
      onWrong();
    }
  }

  function checkChoice(choice) {
    if (normalizeAnswer(choice) === normalizeAnswer(state.currentTask.answer)) {
      gradeCorrect(String(choice).trim());
    } else {
      onWrong();
    }
  }

  function checkClockChoice(choice) {
    checkChoice(choice);
  }

  function submitFree() {
    const free = document.getElementById('free-input');
    if (!free) return;
    const value = free.value.trim();
    if (!value) return;
    gradeCorrect('typed note');
  }

  function nextTask() {
    state.activeTaskEvent = null;
    generateTask();
    refreshUI();
  }

  function continueAfterBreak() {
    document.getElementById('break-popup').style.display = 'none';
    generateTask();
    refreshUI();
  }

  function setMode(mode) {
    state.mode = mode;
    state.taskQueue = [];
    setSparks('🧠', `Switched to ${mode === 'mixed' ? 'mixed' : mode} jobs!`);
    generateTask();
    refreshUI();
  }

  function selectProfile(profileName) {
    resetSessionState();
    state.profile = profileName;
    state.quests = createQuests(profileName);
    showScreen('game');
    buildKeyboard();
    refreshUI();
    generateTask();
  }

  function goHome() {
    state.profile = null;
    document.getElementById('break-popup').style.display = 'none';
    showScreen('profile');
    refreshHomeCoins(state.profiles);
  }

  return {
    selectProfile,
    goHome,
    setMode,
    nextTask,
    checkAnswer,
    checkChoice,
    checkClockChoice,
    submitFree,
    continueAfterBreak,
  };
}
