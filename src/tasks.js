import {
  EASY_WORDS,
  EMOJIS_COUNT,
  LETTERS,
  PATTERN_SETS,
  TASKS_LIDIA,
  TASKS_NEREA,
  VOWELS,
  VOWEL_WORDS,
  WORDS,
} from './data.js';
import { pushRecentTask } from './state.js';

export function shuffleDeck(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  return shuffleDeck(list);
}

function uniqueChoices(correct, pool, total = 3) {
  const choices = new Set([String(correct)]);
  while (choices.size < total) {
    choices.add(String(sample(pool)));
  }
  return shuffle([...choices]);
}

function offsetLetter(letter, shift) {
  const index = LETTERS.indexOf(letter);
  return LETTERS[index + shift];
}

function buildTask(def, profileName) {
  const task = { ...def };

  if (task.type === 'letters' || task.type === 'letters_easy') {
    task.target = sample(LETTERS);
    task.answer = task.target.toLowerCase();
    task.memoryKey = `${task.type}:${task.target}`;
  } else if (task.type === 'letter_match') {
    task.target = sample(LETTERS);
    task.answer = task.target.toLowerCase();
    const randomLetters = shuffle(
      LETTERS.filter((letter) => letter !== task.target).map((letter) => letter.toLowerCase()),
    ).slice(0, 2);
    task.choices = shuffle([task.answer, ...randomLetters]);
    task.memoryKey = `${task.type}:${task.target}`;
  } else if (task.type === 'spelling') {
    task.target = sample(WORDS).toUpperCase();
    task.answer = task.target.toLowerCase();
    task.memoryKey = `${task.type}:${task.target}`;
  } else if (task.type === 'word_scramble') {
    const word = sample(WORDS).toUpperCase();
    const scrambled = shuffle(word.split(''));
    if (scrambled.join('') === word) {
      [scrambled[0], scrambled[1]] = [scrambled[1], scrambled[0]];
    }
    task.target = scrambled.join(' ');
    task.answer = word.toLowerCase();
    task.displayWord = word;
    task.memoryKey = `${task.type}:${word}`;
  } else if (task.type === 'same_first_letter') {
    const answerWord = sample(EASY_WORDS).toUpperCase();
    const firstLetter = answerWord[0];
    const wrongWords = shuffle(EASY_WORDS.filter((word) => word[0].toUpperCase() !== firstLetter)).slice(0, 2);
    task.target = firstLetter;
    task.answer = answerWord.toLowerCase();
    task.choices = shuffle([answerWord, ...wrongWords.map((word) => word.toUpperCase())]);
    task.memoryKey = `${task.type}:${firstLetter}:${answerWord}`;
  } else if (task.type === 'counting' || task.type === 'counting_easy') {
    const count = Math.floor(Math.random() * (profileName === 'lidia' ? 9 : 5)) + 1;
    const emoji = sample(EMOJIS_COUNT);
    task.countEmoji = emoji;
    task.countNum = count;
    task.answer = String(count);
    task.memoryKey = `${task.type}:${emoji}:${count}`;
  } else if (task.type === 'count_by5') {
    const start = (Math.floor(Math.random() * 8) + 1) * 5;
    task.sequence = [start, start + 5, start + 10, start + 15];
    task.target = task.sequence.join(', ') + ', ...';
    task.answer = String(start + 20);
    task.memoryKey = `${task.type}:${start}`;
  } else if (task.type === 'count_by10') {
    const start = (Math.floor(Math.random() * 7) + 1) * 10;
    task.sequence = [start, start + 10, start + 20];
    task.target = task.sequence.join(', ') + ', ...';
    task.answer = String(start + 30);
    task.memoryKey = `${task.type}:${start}`;
  } else if (task.type === 'clock') {
    const h = Math.floor(Math.random() * 12) + 1;
    const m = Math.random() > 0.5 ? 0 : 30;
    task.clockHour = h;
    task.clockMin = m;
    task.answer = `${h}:${m === 0 ? '00' : '30'}`;
    task.target = task.answer;
    const distractors = new Set();
    while (distractors.size < 2) {
      const dh = Math.floor(Math.random() * 12) + 1;
      const dm = Math.random() > 0.5 ? 0 : 30;
      const d = `${dh}:${dm === 0 ? '00' : '30'}`;
      if (d !== task.answer) distractors.add(d);
    }
    task.choices = shuffle([task.answer, ...distractors]);
    task.memoryKey = `${task.type}:${task.answer}`;
  } else if (task.type === 'before_letter' || task.type === 'after_letter') {
    const startIndex = task.type === 'before_letter' ? 1 : 0;
    const endPadding = task.type === 'before_letter' ? 0 : 1;
    const target = sample(LETTERS.slice(startIndex, LETTERS.length - endPadding));
    const shift = task.type === 'before_letter' ? -1 : 1;
    task.target = target;
    task.answer = offsetLetter(target, shift).toLowerCase();
    task.choices = shuffle([
      offsetLetter(target, shift).toLowerCase(),
      offsetLetter(target, shift === -1 ? 1 : -1).toLowerCase(),
      sample(LETTERS.filter((letter) => ![target, offsetLetter(target, shift)].includes(letter))).toLowerCase(),
    ]);
    task.memoryKey = `${task.type}:${task.target}`;
  } else if (task.type === 'compare_numbers' || task.type === 'bigger_number_easy') {
    const max = task.type === 'bigger_number_easy' ? 10 : 20;
    let a = Math.floor(Math.random() * max) + 1;
    let b = Math.floor(Math.random() * max) + 1;
    while (a === b) b = Math.floor(Math.random() * max) + 1;
    task.target = `${a}   or   ${b}`;
    task.answer = String(Math.max(a, b));
    task.choices = shuffle([String(a), String(b)]);
    task.memoryKey = `${task.type}:${a}:${b}`;
  } else if (task.type === 'addition_choice' || task.type === 'subtraction_choice') {
    let a = Math.floor(Math.random() * 8) + 2;
    let b = Math.floor(Math.random() * 8) + 1;
    const isAdd = task.type === 'addition_choice';
    if (!isAdd && b > a) [a, b] = [b, a];
    const answer = isAdd ? a + b : a - b;
    task.target = `${a} ${isAdd ? '+' : '-'} ${b} = ?`;
    task.answer = String(answer);
    task.choices = uniqueChoices(answer, [answer - 2, answer - 1, answer + 1, answer + 2, answer + 3].filter((n) => n >= 0));
    task.memoryKey = `${task.type}:${a}:${b}`;
  } else if (task.type === 'missing_number') {
    const step = sample([2, 5, 10]);
    const start = step === 2 ? Math.floor(Math.random() * 10) + 2 : (Math.floor(Math.random() * 5) + 1) * step;
    const sequence = [start, start + step, start + step * 2, start + step * 3];
    const missingIndex = Math.floor(Math.random() * sequence.length);
    task.sequence = sequence;
    task.answer = String(sequence[missingIndex]);
    task.missingIndex = missingIndex;
    task.choices = uniqueChoices(task.answer, sequence.map(String).concat([String(Number(task.answer) + step), String(Math.max(0, Number(task.answer) - step))]));
    task.memoryKey = `${task.type}:${sequence.join('-')}:${missingIndex}`;
  } else if (task.type === 'vowel_choice') {
    const wordDef = sample(VOWEL_WORDS);
    task.wordPreview = wordDef.word.replace(wordDef.missing, '_').toUpperCase();
    task.target = task.wordPreview;
    task.answer = wordDef.missing.toLowerCase();
    task.choices = shuffle(VOWELS.map((v) => v.toLowerCase())).slice(0, 3);
    if (!task.choices.includes(task.answer)) task.choices[0] = task.answer;
    task.choices = shuffle(task.choices);
    task.memoryKey = `${task.type}:${wordDef.word}`;
  } else if (task.type === 'emoji_pattern' || task.type === 'emoji_pattern_easy') {
    const pattern = sample(PATTERN_SETS);
    const displayed = pattern.slice(0, -1);
    const next = pattern.at(-1);
    task.pattern = displayed;
    task.answer = next;
    const distractors = shuffle(EMOJIS_COUNT.filter((emoji) => !displayed.includes(emoji) && emoji !== next)).slice(0, 2);
    task.choices = shuffle([next, ...distractors]);
    task.memoryKey = `${task.type}:${displayed.join('')}`;
  } else if (task.type === 'free') {
    task.answer = null;
    task.memoryKey = `${task.type}:${Date.now()}`;
  }

  return task;
}

function filterAvailableTasks(profileName, state) {
  const prof = state.profiles[profileName];
  const list = profileName === 'lidia' ? TASKS_LIDIA : TASKS_NEREA;
  return list.filter((task) => !task.minCompleted || prof.tasksCompleted >= task.minCompleted);
}

export function createTaskEngine({ state, renderTask, setSparks, highlightKey }) {
  function generateTask() {
    const profileName = state.profile;
    const list = filterAvailableTasks(profileName, state);

    if (!state.taskQueue || state.taskQueue.length === 0) {
      state.taskQueue = shuffleDeck(list);
      state.taskQueue.sort((a, b) => {
        const aRecent = state.recentTaskTypes.includes(a.type) ? 1 : 0;
        const bRecent = state.recentTaskTypes.includes(b.type) ? 1 : 0;
        return aRecent - bRecent;
      });
    }

    let task = null;
    let attempts = 0;
    while (attempts < 10) {
      const def = state.taskQueue.shift() || sample(list);
      const candidate = buildTask(def, profileName);
      const isRecentKey = state.recentTaskKeys.includes(candidate.memoryKey);
      const isRecentType = state.recentTaskTypes.includes(candidate.type) && attempts < 4;
      if (!isRecentKey && !isRecentType) {
        task = candidate;
        break;
      }
      state.taskQueue.push(def);
      attempts += 1;
    }

    if (!task) {
      task = buildTask(sample(list), profileName);
    }

    if (task.target && /^[A-Z]$/.test(task.target)) {
      highlightKey(task.target);
    } else {
      highlightKey('');
    }

    state.currentTask = task;
    pushRecentTask(task);
    renderTask(task);
    setSparks('🤓', task.prompt);
    document.getElementById('task-badge').textContent = task.badge;
    document.getElementById('task-title-text').textContent = task.title;
  }

  return { generateTask };
}
