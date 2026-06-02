import { STORAGE_KEY } from './data.js';

export const state = {
  profile: null,
  profiles: {
    lidia: { coins: 0, tasksCompleted: 0, owned: [] },
    nerea: { coins: 0, tasksCompleted: 0, owned: [] },
  },
  currentTask: null,
  taskIndex: 0,
  completedLines: [],
  farmFilter: 'common',
  sessionCorrect: 0,
  taskQueue: [],
  recentTaskKeys: [],
  recentTaskTypes: [],
};

export function pushRecentTask(task) {
  const key = task.memoryKey || `${task.type}:${task.target || task.answer || task.prompt}`;
  state.recentTaskKeys.unshift(key);
  state.recentTaskTypes.unshift(task.type);
  state.recentTaskKeys = state.recentTaskKeys.slice(0, 6);
  state.recentTaskTypes = state.recentTaskTypes.slice(0, 4);
}

export function resetSessionState() {
  state.completedLines = [];
  state.taskQueue = [];
  state.sessionCorrect = 0;
  state.recentTaskKeys = [];
  state.recentTaskTypes = [];
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state.profiles = JSON.parse(saved).profiles || state.profiles;
    }
  } catch (error) {
    console.warn('Failed to load TypeTown state', error);
  }
}

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles: state.profiles }));
}
