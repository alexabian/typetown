import { STORAGE_KEY } from './data.js';

const defaultProfiles = {
  lidia: { coins: 0, tasksCompleted: 0, owned: [] },
  nerea: { coins: 0, tasksCompleted: 0, owned: [] },
};

export const state = {
  profile: null,
  profiles: structuredClone(defaultProfiles),
  currentTask: null,
  taskIndex: 0,
  completedLines: [],
  farmFilter: 'common',
  sessionCorrect: 0,
  taskQueue: [],
  recentTaskKeys: [],
  recentTaskTypes: [],
  mode: 'mixed',
  quests: [],
  pendingEvent: null,
  activeTaskEvent: null,
  activeBoss: null,
  shieldHintUsed: false,
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
  state.mode = 'mixed';
  state.quests = [];
  state.pendingEvent = null;
  state.activeTaskEvent = null;
  state.activeBoss = null;
  state.shieldHintUsed = false;
}

function sanitizeNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
}

function sanitizeOwned(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item) => typeof item === 'string' && item.trim()))];
}

function sanitizeProfile(profile, fallback) {
  if (!profile || typeof profile !== 'object') return { ...fallback };
  return {
    coins: sanitizeNumber(profile.coins),
    tasksCompleted: sanitizeNumber(profile.tasksCompleted),
    owned: sanitizeOwned(profile.owned),
  };
}

function sanitizeProfiles(value) {
  if (!value || typeof value !== 'object') {
    return structuredClone(defaultProfiles);
  }

  return {
    lidia: sanitizeProfile(value.lidia, defaultProfiles.lidia),
    nerea: sanitizeProfile(value.nerea, defaultProfiles.nerea),
  };
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state.profiles = sanitizeProfiles(parsed.profiles);
    }
  } catch (error) {
    state.profiles = structuredClone(defaultProfiles);
    console.warn('Failed to load TypeTown state', error);
  }
}

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles: sanitizeProfiles(state.profiles) }));
}
