import { EMOJIS_COUNT, LETTERS, TASKS_LIDIA, TASKS_NEREA, WORDS } from './data.js';

export function shuffleDeck(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createTaskEngine({ state, renderTask, setSparks, highlightKey }) {
  function generateTask() {
    const p = state.profile;
    const list = p === 'lidia' ? TASKS_LIDIA : TASKS_NEREA;
    if (!state.taskQueue || state.taskQueue.length === 0) {
      state.taskQueue = shuffleDeck(list);
      if (
        state.taskQueue.length > 1 &&
        state.currentTask &&
        state.taskQueue[0].type === state.currentTask.type
      ) {
        [state.taskQueue[0], state.taskQueue[1]] = [state.taskQueue[1], state.taskQueue[0]];
      }
    }

    const def = state.taskQueue.shift();
    const task = { ...def };

    if (task.type === 'letters' || task.type === 'letters_easy') {
      task.target = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      task.answer = task.target.toLowerCase();
      highlightKey(task.target);
    } else if (task.type === 'spelling') {
      task.target = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
      task.answer = task.target.toLowerCase();
    } else if (task.type === 'maths') {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      const op = a >= b ? (Math.random() > 0.5 ? '+' : '-') : '+';
      task.target = `${a} ${op} ${b} = ?`;
      task.answer = String(op === '+' ? a + b : a - b);
    } else if (task.type === 'counting' || task.type === 'counting_easy') {
      const count = Math.floor(Math.random() * (p === 'lidia' ? 9 : 5)) + 1;
      const emoji = EMOJIS_COUNT[Math.floor(Math.random() * EMOJIS_COUNT.length)];
      task.countEmoji = emoji;
      task.countNum = count;
      task.answer = String(count);
    } else if (task.type === 'count_by5') {
      const start = (Math.floor(Math.random() * 8) + 1) * 5;
      task.sequence = [start, start + 5, start + 10, start + 15];
      task.target = task.sequence.join(', ') + ', ...';
      task.answer = String(start + 20);
    } else if (task.type === 'count_by10') {
      const start = (Math.floor(Math.random() * 7) + 1) * 10;
      task.sequence = [start, start + 10, start + 20];
      task.target = task.sequence.join(', ') + ', ...';
      task.answer = String(start + 30);
    } else if (task.type === 'clock') {
      const h = Math.floor(Math.random() * 12) + 1;
      const m = Math.random() > 0.5 ? 0 : 30;
      task.clockHour = h;
      task.clockMin = m;
      task.answer = h + ':' + (m === 0 ? '00' : '30');
      task.target = task.answer;
      const distractors = new Set();
      while (distractors.size < 2) {
        const dh = Math.floor(Math.random() * 12) + 1;
        const dm = Math.random() > 0.5 ? 0 : 30;
        const d = dh + ':' + (dm === 0 ? '00' : '30');
        if (d !== task.answer) distractors.add(d);
      }
      task.choices = [task.answer, ...distractors].sort(() => Math.random() - 0.5);
    }

    state.currentTask = task;
    renderTask(task);
    setSparks('🤓', task.prompt);
    document.getElementById('task-badge').textContent = task.badge;
    document.getElementById('task-title-text').textContent = task.title;
  }

  return { generateTask };
}
