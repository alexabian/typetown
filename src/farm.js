import { ANIMALS } from './data.js';

export function rarityUnlocked(rarity, ownedIds) {
  if (rarity === 'common' || rarity === 'uncommon') return true;
  if (rarity === 'rare') return ownedIds.filter((id) => ANIMALS.find((a) => a.id === id && a.rarity === 'uncommon')).length >= 3;
  if (rarity === 'legendary') return ownedIds.filter((id) => ANIMALS.find((a) => a.id === id && a.rarity === 'rare')).length >= 3;
  return false;
}

export function createFarm({ state, saveState, showScreen, setSparks, playUnlock, updateSidebar, showCoinRain }) {
  function showFarm() {
    document.getElementById('nav-work').classList.remove('active');
    document.getElementById('nav-farm').classList.add('active');
    showScreen('farm');
    renderFarm();
  }

  function leaveFarm() {
    document.getElementById('nav-farm').classList.remove('active');
    document.getElementById('nav-work').classList.add('active');
    showScreen('game');
  }

  function showWork() {
    document.getElementById('nav-farm').classList.remove('active');
    document.getElementById('nav-work').classList.add('active');
    showScreen('game');
  }

  function filterFarm(rarity, btn) {
    state.farmFilter = rarity;
    document.querySelectorAll('.rarity-tab').forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    renderFarm();
  }

  function renderFarm() {
    const prof = state.profiles[state.profile];
    document.getElementById('farm-coins-display').textContent = prof.coins;
    const items = ANIMALS.filter((a) => a.rarity === state.farmFilter);
    const unlocked = rarityUnlocked(state.farmFilter, prof.owned);
    const grid = document.getElementById('farm-grid');
    grid.innerHTML = items
      .map((animal) => {
        const owned = prof.owned.includes(animal.id);
        const afford = prof.coins >= animal.price;
        const hardLocked = !unlocked;
        const rarityLabel = animal.rarity.charAt(0).toUpperCase() + animal.rarity.slice(1);
        let lockMsg = '';
        if (hardLocked) {
          if (state.farmFilter === 'rare') lockMsg = 'Unlock 3 uncommon animals first!';
          if (state.farmFilter === 'legendary') lockMsg = 'Unlock 3 rare animals first!';
        }
        return `<div class="farm-card r-${animal.rarity} ${owned ? 'owned' : ''} ${hardLocked ? 'locked-hard' : !afford && !owned ? 'cant-afford' : ''}"
      onclick="${hardLocked ? `setSparks('🔒','${lockMsg}')` : owned ? `setSparks('😄','You already have ${animal.name}! 💖')` : `buyAnimal('${animal.id}')`}" >
      ${owned ? '<span class="owned-stamp">✓ mine</span>' : ''}
      ${hardLocked ? '<span class="lock-icon">🔒</span>' : ''}
      <span class="farm-animal-emoji">${owned ? animal.emoji : '❓'}</span>
      <div class="farm-animal-name">${owned ? animal.name : '???'}</div>
      <div class="rarity-pill r-${animal.rarity}">${rarityLabel}</div><br>
      <div class="farm-price">🪙 ${owned ? '✓' : animal.price}</div>
    </div>`;
      })
      .join('');

    if (!unlocked) {
      const lockMsg =
        state.farmFilter === 'rare'
          ? 'Collect 3 uncommon animals to unlock Rare!'
          : state.farmFilter === 'legendary'
            ? 'Collect 3 rare animals to unlock Legendary!'
            : '';
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--ink-light);font-weight:700;font-size:0.95rem;">🔒 ${lockMsg}</div>` + grid.innerHTML;
    }
  }

  function buyAnimal(id) {
    const prof = state.profiles[state.profile];
    const animal = ANIMALS.find((a) => a.id === id);
    if (!animal) return;
    if (prof.owned.includes(id)) {
      setSparks('😄', `You already have ${animal.name}! 💖`);
      return;
    }
    if (!rarityUnlocked(animal.rarity, prof.owned)) return;
    if (prof.coins < animal.price) {
      setSparks('😅', `Need ${animal.price} coins for ${animal.name}! Keep working! 💕`);
      return;
    }
    prof.coins -= animal.price;
    prof.owned.push(id);
    saveState();
    playUnlock();
    showAnimalPopup(animal);
    updateSidebar();
    setTimeout(renderFarm, 2200);
  }

  function showAnimalPopup(animal) {
    const popup = document.getElementById('animal-popup');
    popup.style.display = 'flex';
    popup.innerHTML = `<div class="animal-popup-box">
    <div class="animal-popup-emoji">${animal.emoji}</div>
    <div class="animal-popup-title">${animal.name}!</div>
    <div class="animal-popup-sub">🌟 New farm friend unlocked! 🌟</div>
  </div>`;
    showCoinRain(6, animal.emoji, '2rem');
    setTimeout(() => {
      popup.style.display = 'none';
      document.getElementById('coin-rain').innerHTML = '';
    }, 2200);
  }

  return { showFarm, leaveFarm, showWork, filterFarm, renderFarm, buyAnimal };
}
