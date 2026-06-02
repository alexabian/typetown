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
};

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
