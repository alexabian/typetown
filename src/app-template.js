export const appTemplate = `<!-- PROFILE -->
<div id="screen-profile" class="screen active">
  <div class="game-logo">
    <h1>Type<span>Town</span> ✨</h1>
    <p class="tagline">Just like dad's work — but cuter</p>
  </div>
  <div class="profile-cards">
    <div class="profile-card lidia" onclick="selectProfile('lidia')">
      <div class="profile-avatar">🦋</div>
      <h2>Lidia</h2>
      <p>Office Star ⭐</p>
      <div class="coins-badge">🪙 <span id="lidia-coins-home">0</span> coins</div>
    </div>
    <div class="profile-card nerea" onclick="selectProfile('nerea')">
      <div class="profile-avatar">🌸</div>
      <h2>Nerea</h2>
      <p>Junior Typist 🌟</p>
      <div class="coins-badge">🪙 <span id="nerea-coins-home">0</span> coins</div>
    </div>
  </div>
</div>

<!-- GAME -->
<div id="screen-game" class="screen">
  <div class="sidebar">
    <div class="sidebar-logo">Type<span>Town</span></div>
    <div class="player-badge">
      <div class="avatar-sm" id="sidebar-avatar">🦋</div>
      <h3 id="sidebar-name">Lidia</h3>
      <div class="role" id="sidebar-role">Office Star</div>
    </div>

    <div class="coin-display">
      <span>🪙 Coins</span>
      <span class="coin-count" id="sidebar-coins">0</span>
    </div>

    <div class="progress-wrap">
      <div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>
      <span class="progress-label" id="progress-label">0/5</span>
    </div>

    <div class="mode-panel">
      <div class="sidebar-mini-title">Choose job</div>
      <div class="mode-picker" id="mode-picker"></div>
    </div>

    <div class="quest-panel">
      <div class="sidebar-mini-title">Today’s quests</div>
      <div class="quest-list" id="quest-list"></div>
    </div>

    <div class="helper-panel">
      <div class="sidebar-mini-title">Farm helpers</div>
      <div class="helper-power" id="helper-power"></div>
      <div class="event-chip" id="event-chip" style="display:none;"></div>
      <div class="boss-chip" id="boss-chip" style="display:none;"></div>
    </div>

    <div class="sparks-wrap">
      <div class="sparks-face" id="sparks-face">😊</div>
      <div class="sparks-bubble" id="sparks-msg">Hi! Ready to work? 💖</div>
    </div>

    <div class="mini-farm" id="mini-farm"></div>

    <div class="sidebar-nav">
      <button class="nav-btn active" id="nav-work" onclick="showWork()">
        <span class="icon">📄</span><span>Work</span>
      </button>
      <button class="nav-btn" id="nav-farm" onclick="showFarm()">
        <span class="icon">🐣</span><span>My Farm</span>
      </button>
      <button class="nav-btn" onclick="goHome()">
        <span class="icon">🏠</span><span>Home</span>
      </button>
    </div>
  </div>

  <div class="main-area" id="work-area">
    <div class="task-header">
      <span class="task-type-badge" id="task-badge">Letters</span>
      <span class="task-title-text" id="task-title-text">Alphabet Section</span>
      <button class="next-task-btn" onclick="nextTask()">Next task ➡</button>
    </div>

    <div class="doc-frame">
      <div class="doc-toolbar">
        <div class="doc-toolbar-dot" style="background:#FF7EB3"></div>
        <div class="doc-toolbar-dot" style="background:#FFD43B"></div>
        <div class="doc-toolbar-dot" style="background:#5DDBA8"></div>
        <span class="doc-title-bar">Daily Report — TypeTown Office</span>
        <span class="doc-status" id="doc-status">Editing...</span>
      </div>
      <div class="doc-body" id="doc-body"></div>
    </div>

    <div class="keyboard-hint" id="keyboard-hint"></div>
  </div>
</div>

<!-- FARM -->
<div id="screen-farm" class="screen">
  <div class="farm-header">
    <h2>🌟 My Collection 🌸</h2>
    <p>Collect animals, flowers, sweets, space & more — spend your coins!</p>
  </div>
  <div class="farm-coins-bar">🪙 <span id="farm-coins-display">0</span> coins</div>
  <div class="rarity-tabs">
    <button class="rarity-tab r-common active" onclick="filterFarm('common',this)">🌿 Common</button>
    <button class="rarity-tab r-uncommon" onclick="filterFarm('uncommon',this)">💜 Uncommon</button>
    <button class="rarity-tab r-rare" onclick="filterFarm('rare',this)">🧡 Rare</button>
    <button class="rarity-tab r-legendary" onclick="filterFarm('legendary',this)">✨ Legendary</button>
  </div>
  <div class="farm-grid" id="farm-grid"></div>
  <button style="background:var(--white);border:2px solid rgba(200,160,220,0.4);border-radius:14px;padding:8px 20px;font-family:'Nunito',sans-serif;font-size:0.9rem;font-weight:700;color:var(--ink);cursor:pointer;margin-bottom:2rem;" onclick="leaveFarm()">← Back to work</button>
</div>

<div class="coin-rain" id="coin-rain"></div>
<div class="animal-popup" id="animal-popup" style="display:none;"></div>
<div class="break-popup" id="break-popup" style="display:none;"></div>
`