export function showScreen(name) {
  document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
  if (name === 'farm') {
    document.getElementById('screen-farm').classList.add('active');
  } else if (name === 'game') {
    document.getElementById('screen-game').classList.add('active');
  } else if (name === 'profile') {
    document.getElementById('screen-profile').classList.add('active');
  }
}

export function setSparks(face, msg) {
  document.getElementById('sparks-face').textContent = face;
  document.getElementById('sparks-msg').textContent = msg;
}

export function showCoinRain(count, emoji = '🪙', fontSize = '1.5rem') {
  const rain = document.getElementById('coin-rain');
  rain.innerHTML = '';
  const num = Math.min(count * 3, 18);
  for (let i = 0; i < num; i++) {
    const c = document.createElement('span');
    c.className = 'coin-particle';
    c.textContent = emoji;
    c.style.left = Math.random() * 100 + 'vw';
    c.style.animationDelay = Math.random() * 0.5 + 's';
    c.style.fontSize = fontSize;
    rain.appendChild(c);
  }
  setTimeout(() => {
    rain.innerHTML = '';
  }, 2200);
}

export function buildKeyboard() {
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  document.getElementById('keyboard-hint').innerHTML = rows
    .map(
      (row) =>
        `<div style="display:flex;gap:4px;justify-content:center;width:100%;">` +
        row.split('').map((k) => `<div class="key-cap" id="key-${k}">${k}</div>`).join('') +
        `</div>`,
    )
    .join('');
}

export function highlightKey(letter) {
  document.querySelectorAll('.key-cap').forEach((k) => k.classList.remove('highlight'));
  const el = document.getElementById('key-' + letter.toUpperCase());
  if (el) el.classList.add('highlight');
}

export function attachKeyboardPressListener() {
  document.addEventListener('keydown', (e) => {
    const el = document.getElementById('key-' + e.key.toUpperCase());
    if (el) {
      el.classList.add('pressed');
      setTimeout(() => el.classList.remove('pressed'), 100);
    }
  });
}

export function makeClock(h, m) {
  const cx = 90;
  const cy = 90;
  const hAngle = ((h % 12) + m / 60) * 30 - 90;
  const mAngle = m * 6 - 90;
  const hRad = (hAngle * Math.PI) / 180;
  const mRad = (mAngle * Math.PI) / 180;
  const hx = (cx + 46 * Math.cos(hRad)).toFixed(1);
  const hy = (cy + 46 * Math.sin(hRad)).toFixed(1);
  const mx = (cx + 64 * Math.cos(mRad)).toFixed(1);
  const my = (cy + 64 * Math.sin(mRad)).toFixed(1);
  let nums = '';
  for (let i = 1; i <= 12; i++) {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    nums += `<text x="${(cx + 62 * Math.cos(a)).toFixed(1)}" y="${(cy + 62 * Math.sin(a)).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="11" font-family="Nunito,sans-serif" font-weight="800" fill="#3D2B4A">${i}</text>`;
  }
  let ticks = '';
  for (let i = 0; i < 60; i++) {
    const a = ((i * 6 - 90) * Math.PI) / 180;
    const isH = i % 5 === 0;
    const r1 = isH ? 72 : 76;
    ticks += `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}" x2="${(cx + 80 * Math.cos(a)).toFixed(1)}" y2="${(cy + 80 * Math.sin(a)).toFixed(1)}" stroke="${isH ? '#7A5A8A' : '#C9B8FF'}" stroke-width="${isH ? 2 : 1}"/>`;
  }
  return `<svg class="clock-svg" width="180" height="180" viewBox="0 0 180 180">
    <circle cx="${cx}" cy="${cy}" r="84" fill="#FFFCF7" stroke="#C9B8FF" stroke-width="3"/>
    ${ticks}${nums}
    <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#3D2B4A" stroke-width="6" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="#FF85B3" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="#3D2B4A"/>
  </svg>`;
}

export function refreshHomeCoins(profiles) {
  document.getElementById('lidia-coins-home').textContent = profiles.lidia.coins;
  document.getElementById('nerea-coins-home').textContent = profiles.nerea.coins;
}

export function updateSidebar(state, animals) {
  const p = state.profile;
  const prof = state.profiles[p];
  document.getElementById('sidebar-avatar').textContent = p === 'lidia' ? '🦋' : '🌸';
  document.getElementById('sidebar-name').textContent = p === 'lidia' ? 'Lidia' : 'Nerea';
  document.getElementById('sidebar-role').textContent = p === 'lidia' ? 'Office Star' : 'Junior Typist';
  document.getElementById('sidebar-coins').textContent = prof.coins;
  const done = state.completedLines.length % 5;
  document.getElementById('progress-fill').style.width = `${(done / 5) * 100}%`;
  document.getElementById('progress-label').textContent = `${done}/5`;
  const mf = document.getElementById('mini-farm');
  mf.innerHTML = prof.owned
    .slice(-8)
    .map((id) => {
      const a = animals.find((x) => x.id === id);
      return a ? `<span class="mini-animal" title="${a.name}">${a.emoji}</span>` : '';
    })
    .join('');
}

export function renderTask(task, state, handlers, helpers) {
  const body = document.getElementById('doc-body');
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  let html = `<div class="doc-report-title">📋 Daily Work Report — TypeTown Office<br><span style="font-size:0.75rem;color:var(--ink-light);font-family:'Nunito',sans-serif;">${date}</span></div>`;
  state.completedLines.forEach((line) => {
    html += `<div class="doc-line"><span class="line-label">${line.label}</span><span class="line-answer correct">${line.value}</span><span style="color:#1A8A50;font-size:0.8rem;margin-left:4px;">✓</span></div>`;
  });
  html += `<div class="task-zone" id="task-zone"><div class="task-prompt">${task.prompt}</div>`;
  if (task.type === 'letters' || task.type === 'letters_easy') {
    html += `<div class="task-target">${task.target}</div>`;
    html += `<div class="task-input-row"><input class="task-input" id="task-input" maxlength="1" placeholder="?" autocomplete="off" autocorrect="off" spellcheck="false"><button class="submit-btn" onclick="checkAnswer()">Send ✉️</button></div>`;
  } else if (task.type === 'spelling') {
    html += `<div class="task-target" style="font-size:1.4rem;letter-spacing:2px;">${task.target}</div>`;
    html += `<div class="task-input-row"><input class="task-input" id="task-input" maxlength="${task.answer.length}" placeholder="type it!" autocomplete="off" autocorrect="off" spellcheck="false"><button class="submit-btn" onclick="checkAnswer()">Send ✉️</button></div>`;
  } else if (task.type === 'maths') {
    html += `<div class="task-target">${task.target}</div>`;
    html += `<div class="task-input-row"><input class="task-input" id="task-input" maxlength="3" placeholder="?" autocomplete="off" type="text" inputmode="numeric"><button class="submit-btn" onclick="checkAnswer()">Send ✉️</button></div>`;
  } else if (task.type === 'counting' || task.type === 'counting_easy') {
    html += `<div class="counting-objects">`;
    for (let i = 0; i < task.countNum; i++) html += `<span class="count-obj" style="animation-delay:${i * 0.06}s">${task.countEmoji}</span>`;
    html += `</div><div class="task-input-row"><input class="task-input" id="task-input" maxlength="2" placeholder="?" autocomplete="off" type="text" inputmode="numeric"><button class="submit-btn" onclick="checkAnswer()">Send ✉️</button></div>`;
  } else if (task.type === 'count_by5' || task.type === 'count_by10') {
    html += `<div class="sequence-row">`;
    task.sequence.forEach((n) => {
      html += `<span class="seq-num">${n}</span><span class="seq-arrow">→</span>`;
    });
    html += `<span class="seq-blank">?</span></div>`;
    html += `<div class="task-input-row"><input class="task-input" id="task-input" maxlength="3" placeholder="?" autocomplete="off" type="text" inputmode="numeric"><button class="submit-btn" onclick="checkAnswer()">Send ✉️</button></div>`;
  } else if (task.type === 'clock') {
    html += helpers.makeClock(task.clockHour, task.clockMin);
    html += `<div class="clock-choices">`;
    task.choices.forEach((c) => {
      html += `<button class="clock-choice-btn" onclick="checkClockChoice('${c}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (task.type === 'free') {
    html += `<textarea class="free-typing-area" id="free-input" placeholder="Start typing your very important notes here..."></textarea>`;
    html += `<button class="submit-btn" onclick="submitFree()">Submit Report 📨</button>`;
  }
  html += `</div>`;
  body.innerHTML = html;
  const inp = document.getElementById('task-input');
  if (inp) {
    inp.focus();
    inp.addEventListener('keydown', (e) => {
      helpers.playClick();
      if (e.key === 'Enter') handlers.checkAnswer();
    });
    inp.addEventListener('input', () => {
      if (task.type === 'letters' || task.type === 'letters_easy') helpers.highlightKey(inp.value.toUpperCase());
    });
  }
  const free = document.getElementById('free-input');
  if (free) {
    free.focus();
    free.addEventListener('keydown', () => helpers.playClick());
  }
  document.getElementById('doc-status').textContent = 'Editing...';
}
