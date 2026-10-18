'use strict';
/* משחקי הנסיכות והחיות — kids game hub, no external requests, no data collection */

const NUM_F = ['אחת','שתיים','שלוש','ארבע','חמש','שש','שבע','שמונה','תשע','עשר'];
const NUM_M = ['אחד','שניים','שלושה','ארבעה','חמישה','שישה','שבעה','שמונה','תשעה','עשרה'];

const COLORS = [
  { name: 'אדום',  hex: '#e74c3c' },
  { name: 'כחול',  hex: '#3498db' },
  { name: 'צהוב',  hex: '#f1c40f' },
  { name: 'ירוק',  hex: '#2ecc71' },
  { name: 'ורוד',  hex: '#ff7eb9' },
  { name: 'סגול',  hex: '#9b59b6' },
];
const SHAPES = [
  { id: 'circle',   name: 'עיגול' },
  { id: 'square',   name: 'ריבוע' },
  { id: 'triangle', name: 'משולש' },
  { id: 'star',     name: 'כוכב' },
  { id: 'heart',    name: 'לב' },
];
const STICKERS = [
  { emoji: '👸', name: 'נסיכה' }, { emoji: '🦄', name: 'חד קרן' },
  { emoji: '🏰', name: 'טירה' }, { emoji: '🐶', name: 'כלב' },
  { emoji: '🐱', name: 'חתול' }, { emoji: '🦋', name: 'פרפר' },
  { emoji: '🐰', name: 'ארנב' }, { emoji: '🌳', name: 'עץ' },
  { emoji: '🌸', name: 'פרח' }, { emoji: '☀️', name: 'שמש' },
  { emoji: '🌈', name: 'קשת' }, { emoji: '☁️', name: 'ענן' },
];
const MEMO_ITEMS = [
  { emoji: '🦁', name: 'אריה' }, { emoji: '🐘', name: 'פיל' },
  { emoji: '🐵', name: 'קוף' }, { emoji: '🦒', name: 'ג׳ירפה' },
  { emoji: '🐰', name: 'ארנב' }, { emoji: '🦊', name: 'שועל' },
  { emoji: '👸', name: 'נסיכה' }, { emoji: '🦄', name: 'חד קרן' },
];
const FRUITS = [
  { emoji: '🍎', name: 'תפוח', plural: 'תפוחים', gender: 'm' },
  { emoji: '🍌', name: 'בננה', plural: 'בננות', gender: 'f' },
  { emoji: '🍓', name: 'תות', plural: 'תותים', gender: 'm' },
  { emoji: '🍊', name: 'תפוז', plural: 'תפוזים', gender: 'm' },
  { emoji: '🍇', name: 'ענבים', plural: 'ענבים', gender: 'm' },
  { emoji: '🍐', name: 'אגס', plural: 'אגסים', gender: 'm' },
];
const CUSTOMERS = [
  { emoji: '👸', name: 'הנסיכה' }, { emoji: '🤴', name: 'הנסיך' },
  { emoji: '🐰', name: 'הארנב' }, { emoji: '🦄', name: 'חד הקרן' },
  { emoji: '🐻', name: 'הדוב' },
];
const LETTERS = [
  ['א','אריה','🦁'], ['ב','בלון','🎈'], ['ג','גמל','🐪'], ['ד','דג','🐠'],
  ['ה','הר','⛰️'], ['ו','ורד','🌹'], ['ז','זאב','🐺'], ['ח','חתול','🐱'],
  ['ט','טלפון','📱'], ['י','ילדה','👧'], ['כ','כלב','🐶'], ['ל','לב','❤️'],
  ['מ','מלכה','👑'], ['נ','נסיכה','👸'], ['ס','סוס','🐴'], ['ע','ענן','☁️'],
  ['פ','פרח','🌸'], ['צ','ציפור','🐦'], ['ק','קוף','🐵'], ['ר','רכבת','🚂'],
  ['ש','שמש','☀️'], ['ת','תפוח','🍎'],
];
const COUNT_EMOJIS = ['🦄','🐰','🦋','🐱','🐶','🌸','⭐','🍎'];

// ---------- helpers ----------
const app = document.getElementById('app');
let cleanupFns = [];
function onCleanup(fn) { cleanupFns.push(fn); }
function runCleanup() { cleanupFns.forEach(f => { try { f(); } catch (e) {} }); cleanupFns = []; }

let soundOn = true;
let heVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  heVoice = vs.find(v => v.lang && v.lang.toLowerCase().startsWith('he')) || null;
}
if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text, opts) {
  if (!soundOn || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'he-IL';
  if (heVoice) u.voice = heVoice;
  u.rate = (opts && opts.rate) || 0.9;
  u.pitch = 1.15;
  speechSynthesis.speak(u);
}
function stopSpeak() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

function confetti(n) {
  const bits = ['🎉','⭐','🌸','💖','✨','🎈'];
  for (let i = 0; i < (n || 26); i++) {
    const c = el('span', 'confetti-bit', pick(bits));
    c.style.right = Math.random() * 96 + 'vw';
    c.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    c.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3600);
  }
}
function celebrate(text) {
  const wrap = el('div', 'celebrate');
  const b = el('div', 'burst', pick(['🌟','🎉','💖','🏆','👏']));
  wrap.appendChild(b);
  document.body.appendChild(wrap);
  confetti();
  speak(text || pick(['כל הכבוד!', 'מעולה!', 'יופי!', 'אלופה!', 'נפלא!']));
  setTimeout(() => wrap.remove(), 1200);
}

// ---------- shell ----------
function shell(title, contentNode, opts) {
  runCleanup();
  stopSpeak();
  app.innerHTML = '';
  const bar = el('div', 'topbar');
  const home = el('button', 'pill-btn', '🏠');
  home.setAttribute('aria-label', 'בית');
  home.onclick = () => { renderHome(); };
  const t = el('div', 'pill-label', title);
  const sp = el('div', 'spacer');
  const snd = el('button', 'pill-btn', soundOn ? '🔊' : '🔇');
  snd.setAttribute('aria-label', 'קול');
  snd.onclick = () => { soundOn = !soundOn; snd.textContent = soundOn ? '🔊' : '🔇'; if (!soundOn) stopSpeak(); };
  bar.append(home, t, sp, snd);
  const scr = el('div', 'screen');
  if (opts && opts.prompt !== undefined) {
    const pb = el('div', 'prompt-bar');
    const ptxt = el('div', '', opts.prompt);
    ptxt.style.flex = '1';
    const again = el('button', 'speak-again', '🔊');
    again.setAttribute('aria-label', 'שמע שוב');
    again.onclick = () => speak(pb.firstChild.textContent);
    pb.append(ptxt, again);
    scr.appendChild(pb);
  }
  scr.appendChild(contentNode);
  app.append(bar, scr);
}

function renderHome() {
  runCleanup();
  stopSpeak();
  app.innerHTML = '';
  const home = el('div', 'home');
  const crown = el('div', 'home-crown', '🏰👸🦄');
  const h1 = el('h1', '', 'משחקי הנסיכות והחיות');
  const sub = el('div', 'subtitle', 'בחרי משחק ומתחילים!');
  const grid = el('div', 'games-grid');
  const games = [
    { emoji: '🎨', name: 'בונים עולם', fn: renderWorld },
    { emoji: '🎈', name: 'בלונים', fn: renderBalloons },
    { emoji: '🧠', name: 'משחק זיכרון', fn: renderMemory },
    { emoji: '🍎', name: 'חנות הפירות', fn: renderShop },
    { emoji: '🔤', name: 'אותיות', fn: renderLetters },
    { emoji: '🔢', name: 'מספרים', fn: renderNumbers },
  ];
  games.forEach(g => {
    const c = el('button', 'game-card');
    c.append(el('div', 'emoji', g.emoji), el('div', 'name', g.name));
    c.onclick = () => { g.fn(); };
    grid.appendChild(c);
  });
  const snd = el('button', 'pill-btn', soundOn ? '🔊' : '🔇');
  snd.style.marginTop = '20px';
  snd.onclick = () => { soundOn = !soundOn; snd.textContent = soundOn ? '🔊' : '🔇'; if (!soundOn) stopSpeak(); };
  home.append(crown, h1, sub, grid, snd);
  app.appendChild(home);
}

// ---------- game 1: build a world ----------
function shapeSVG(shape, hex, size) {
  const s = size || 56;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', s); svg.setAttribute('height', s);
  svg.setAttribute('viewBox', '0 0 100 100');
  let node;
  if (shape === 'circle') {
    node = document.createElementNS(ns, 'circle');
    node.setAttribute('cx', 50); node.setAttribute('cy', 50); node.setAttribute('r', 44);
  } else if (shape === 'square') {
    node = document.createElementNS(ns, 'rect');
    node.setAttribute('x', 8); node.setAttribute('y', 8);
    node.setAttribute('width', 84); node.setAttribute('height', 84);
    node.setAttribute('rx', 14);
  } else if (shape === 'triangle') {
    node = document.createElementNS(ns, 'polygon');
    node.setAttribute('points', '50,6 94,90 6,90');
  } else if (shape === 'star') {
    node = document.createElementNS(ns, 'polygon');
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 46 : 19;
      const a = -Math.PI / 2 + i * Math.PI / 5;
      pts.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1));
    }
    node.setAttribute('points', pts.join(' '));
  } else {
    node = document.createElementNS(ns, 'path');
    node.setAttribute('d', 'M50 88 C10 60 4 30 22 18 C35 9 48 18 50 30 C52 18 65 9 78 18 C96 30 90 60 50 88 Z');
  }
  node.setAttribute('fill', hex);
  node.setAttribute('stroke', '#00000022');
  node.setAttribute('stroke-width', '3');
  svg.appendChild(node);
  return svg;
}

function renderWorld() {
  const area = el('div', 'game-area world-canvas');
  const wrap = el('div');
  const palette = el('div', 'palette');
  const placed = [];
  let selected = null;
  let mission = null;

  const tools = [];
  COLORS.forEach(c => SHAPES.forEach(s => tools.push({ kind: 'shape', shape: s, color: c, label: s.name + ' ' + c.name })));
  STICKERS.forEach(st => tools.push({ kind: 'sticker', sticker: st, label: st.name }));

  const banner = el('div', 'mission-banner hidden');
  area.appendChild(banner);

  function selectTool(btn, tool) {
    palette.querySelectorAll('.palette-item').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selected = tool;
    speak(tool.label);
  }
  tools.forEach(tool => {
    const b = el('button', 'palette-item');
    b.setAttribute('aria-label', tool.label);
    if (tool.kind === 'shape') b.appendChild(shapeSVG(tool.shape.id, tool.color.hex, 44));
    else b.textContent = tool.sticker.emoji;
    b.onclick = () => selectTool(b, tool);
    palette.appendChild(b);
  });

  function placeAt(x, y, tool) {
    const it = el('div', 'world-item');
    if (tool.kind === 'shape') it.appendChild(shapeSVG(tool.shape.id, tool.color.hex, randInt(48, 76)));
    else { it.textContent = tool.sticker.emoji; it.style.fontSize = randInt(44, 70) + 'px'; }
    it.style.left = x + 'px';
    it.style.top = y + 'px';
    area.appendChild(it);
    const rec = { node: it, tool };
    placed.push(rec);
    it.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      it.setPointerCapture(ev.pointerId);
      const rect = area.getBoundingClientRect();
      const move = mv => {
        it.style.left = Math.max(0, Math.min(rect.width, mv.clientX - rect.left)) + 'px';
        it.style.top = Math.max(0, Math.min(rect.height, mv.clientY - rect.top)) + 'px';
      };
      const up = () => {
        it.removeEventListener('pointermove', move);
        it.removeEventListener('pointerup', up);
      };
      it.addEventListener('pointermove', move);
      it.addEventListener('pointerup', up);
      if (mission && mission.type === 'where') checkWhere(rec);
    });
    if (mission && mission.type === 'place') checkPlace(rec);
  }

  area.addEventListener('pointerdown', ev => {
    if (ev.target !== area || !selected) return;
    const rect = area.getBoundingClientRect();
    placeAt(ev.clientX - rect.left, ev.clientY - rect.top, selected);
  });

  function newMission() {
    const placedShapes = placed.filter(p => p.tool.kind === 'shape');
    const wantWhere = placedShapes.length >= 2 && Math.random() < 0.4;
    if (wantWhere) {
      const target = pick(placedShapes);
      mission = { type: 'where', tool: target.tool };
      banner.textContent = '🎯 איפה ה' + target.tool.shape.name + ' ה' + target.tool.color.name + '? געי בו!';
      banner.classList.remove('hidden');
      speak('איפה ה' + target.tool.shape.name + ' ה' + target.tool.color.name + '?');
    } else {
      const shape = pick(SHAPES), color = pick(COLORS);
      mission = { type: 'place', shape, color };
      banner.textContent = '🎯 משימה: שימי ' + shape.name + ' ' + color.name + ' על המסך';
      banner.classList.remove('hidden');
      speak('שימי ' + shape.name + ' ' + color.name + ' על המסך');
      palette.querySelectorAll('.palette-item').forEach(b => b.classList.remove('selected'));
      selected = null;
    }
  }
  function checkPlace(rec) {
    if (!mission || mission.type !== 'place') return;
    if (rec.tool.kind === 'shape' && rec.tool.shape.id === mission.shape.id && rec.tool.color.name === mission.color.name) {
      banner.classList.add('hidden');
      mission = null;
      celebrate('כל הכבוד! השלמת את המשימה!');
      setTimeout(newMission, 2500);
    }
  }
  function checkWhere(rec) {
    if (!mission || mission.type !== 'where') return;
    if (rec.tool === mission.tool) {
      banner.classList.add('hidden');
      mission = null;
      celebrate('מצאת! כל הכבוד!');
      setTimeout(newMission, 2500);
    } else if (rec.tool.kind === 'shape') {
      speak('זה לא ה' + mission.tool.shape.name + ' ה' + mission.tool.color.name + '. נסי שוב');
    }
  }

  const btnRow = el('div');
  btnRow.style.cssText = 'display:flex;gap:10px;justify-content:center;padding:10px 0 0;';
  const missionBtn = el('button', 'big-action', '🎯 משימה');
  missionBtn.style.fontSize = '20px'; missionBtn.style.padding = '12px 26px';
  missionBtn.onclick = newMission;
  const clearBtn = el('button', 'pill-btn', '🧹 ניקוי');
  clearBtn.style.fontSize = '18px';
  clearBtn.onclick = () => { placed.splice(0).forEach(p => p.node.remove()); mission = null; banner.classList.add('hidden'); speak('המסך נקי!'); };
  btnRow.append(missionBtn, clearBtn);

  wrap.append(palette, area, btnRow);
  wrap.style.cssText = 'display:flex;flex-direction:column;flex:1;';
  area.style.minHeight = '280px';
  shell('בונים עולם', wrap, { prompt: 'בחרי צורה או חיה וגעי במסך כדי לשים אותה' });
  setTimeout(() => speak('בחרי צורה או חיה, וגעי במסך כדי לשים אותה בעולם שלך'), 300);
}

// ---------- game 2: balloons ----------
function renderBalloons() {
  const area = el('div', 'game-area');
  let round = 0, total = 5, lock = false, target = null;
  let promptBarHolder = null;

  function balloonNode(color, label) {
    const b = el('div', 'balloon');
    const ball = el('div', 'ball', label || '');
    ball.style.background = 'radial-gradient(circle at 30% 30%, #ffffff88, ' + color.hex + ')';
    b.appendChild(ball);
    b.appendChild(el('div', 'string'));
    b.style.right = randInt(4, 70) + '%';
    b.style.top = randInt(6, 62) + '%';
    b.style.animationDelay = (Math.random() * 1.5) + 's';
    return b;
  }

  function newRound() {
    round++;
    lock = false;
    area.innerHTML = '';
    const mode = pick(['letter', 'color', 'number']);
    const nBalloons = randInt(4, 5);
    const colorSet = shuffle(COLORS).slice(0, nBalloons);
    let labels = [];
    let promptText = '';
    if (mode === 'color') {
      target = { mode, color: pick(colorSet) };
      promptText = 'פוצצי את הבלון ה' + target.color.name;
    } else if (mode === 'letter') {
      const ls = shuffle(LETTERS).slice(0, nBalloons);
      target = { mode, letter: pick(ls) };
      labels = ls.map(l => l[0]);
      promptText = 'פוצצי את הבלון עם האות ' + target.letter[0];
    } else {
      const ns = shuffle([1,2,3,4,5,6,7,8,9,10]).slice(0, nBalloons);
      target = { mode, num: pick(ns) };
      labels = ns.map(String);
      promptText = 'פוצצי את הבלון עם המספר ' + target.num;
    }
    if (promptBarHolder) promptBarHolder.textContent = promptText;
    colorSet.forEach((c, i) => {
      const label = mode === 'color' ? '' : labels[i];
      const b = balloonNode(c, label);
      const isTarget = mode === 'color'
        ? c.name === target.color.name
        : (mode === 'letter' ? label === target.letter[0] : label === String(target.num));
      b.addEventListener('pointerdown', () => {
        if (lock) return;
        if (isTarget) {
          lock = true;
          b.classList.add('pop');
          speak(pick(['יופי!', 'כל הכבוד!', 'פופ! נפלא!']));
          confetti(10);
          setTimeout(() => { round >= total ? finish() : newRound(); }, 700);
        } else {
          b.style.animation = 'shake .35s';
          speak('נסי שוב! ' + promptText);
          setTimeout(() => { b.style.animation = ''; }, 400);
        }
      });
      area.appendChild(b);
    });
    setTimeout(() => speak(promptText), 250);
  }
  function finish() {
    area.innerHTML = '';
    celebrate('אלופה! פוצצת את כל הבלונים!');
    const again = el('button', 'big-action', '🎈 עוד פעם');
    again.onclick = () => { round = 0; again.remove(); newRound(); };
    again.style.position = 'absolute'; again.style.top = '40%'; again.style.right = '50%';
    again.style.transform = 'translateX(50%)';
    area.appendChild(again);
  }
  shell('בלונים', area, { prompt: 'מכינה בלונים...' });
  promptBarHolder = app.querySelector('.prompt-bar').firstChild;
  newRound();
}

// ---------- game 3: memory ----------
function renderMemory() {
  const area = el('div', 'game-area');
  const items = shuffle(MEMO_ITEMS).slice(0, 6);
  const deck = shuffle(items.concat(items));
  let open = [], matched = 0, lock = false;

  const grid = el('div', 'memory-grid');
  deck.forEach(item => {
    const card = el('button', 'mem-card');
    const inner = el('div', 'mem-inner');
    const back = el('div', 'mem-face mem-back', '🏰');
    const front = el('div', 'mem-face mem-front', item.emoji);
    inner.append(back, front);
    card.appendChild(inner);
    card.onclick = () => {
      if (lock || card.classList.contains('open')) return;
      card.classList.add('open');
      speak(item.name);
      open.push({ card, item });
      if (open.length === 2) {
        lock = true;
        if (open[0].item.name === open[1].item.name) {
          setTimeout(() => {
            open.forEach(o => o.card.classList.add('matched'));
            speak('זוג! ' + item.name + '!');
            confetti(8);
            matched++;
            open = []; lock = false;
            if (matched === 6) {
              setTimeout(() => {
                celebrate('כל הכבוד! מצאת את כל הזוגות!');
                const again = el('button', 'big-action', '🧠 עוד פעם');
                again.onclick = renderMemory;
                area.appendChild(again);
              }, 600);
            }
          }, 500);
        } else {
          setTimeout(() => {
            open.forEach(o => o.card.classList.remove('open'));
            open = []; lock = false;
          }, 1100);
        }
      }
    };
    grid.appendChild(card);
  });
  area.appendChild(grid);
  shell('משחק זיכרון', area, { prompt: 'מצאי זוגות של חיות ונסיכות' });
  setTimeout(() => speak('מצאי זוגות! הפכי שני קלפים ומצאי אותם'), 300);
}

// ---------- game 4: fruit shop ----------
function renderShop() {
  const area = el('div', 'game-area');
  let round = 0, total = 5, target = 0, count = 0, fruit = null, customer = null, mode = 'count';

  const top = el('div');
  top.style.cssText = 'text-align:center;padding-top:14px;font-size:60px;';
  const shelf = el('div', 'shop-shelf');
  const basket = el('div', 'basket-zone');
  const bLabel = el('div', 'basket-label', 'הסל שלי 🧺');
  const bFruits = el('div', 'basket-fruits');
  basket.append(bLabel, bFruits);
  const done = el('button', 'big-action', '✓ סיימתי');
  area.append(top, shelf, basket, done);

  function newRound() {
    round++;
    count = 0;
    bFruits.innerHTML = '';
    shelf.innerHTML = '';
    customer = pick(CUSTOMERS);
    fruit = pick(FRUITS);
    target = randInt(1, 10);
    mode = Math.random() < 0.35 ? 'sort' : 'count';
    top.textContent = customer.emoji;
    if (mode === 'count') {
      done.classList.remove('hidden');
      bLabel.textContent = 'הסל שלי 🧺 (0)';
      const fbtn = el('button', 'fruit-btn', fruit.emoji);
      fbtn.setAttribute('aria-label', fruit.name);
      fbtn.onclick = () => {
        count++;
        const f = el('span', '', fruit.emoji);
        bFruits.appendChild(f);
        bLabel.textContent = 'הסל שלי 🧺 (' + count + ')';
        speak(NUM_F[count - 1]);
      };
      shelf.appendChild(fbtn);
      const extra = pick(FRUITS.filter(f => f.name !== fruit.name));
      const ebtn = el('button', 'fruit-btn', extra.emoji);
      ebtn.onclick = () => speak('זה ' + extra.name + ', לא ' + fruit.name);
      shelf.appendChild(ebtn);
      setTimeout(() => speak(customer.name + ' אומר: אני רוצה ' + (fruit.gender === 'f' ? NUM_F[target - 1] : NUM_M[target - 1]) + ' ' + (target === 1 ? fruit.name : fruit.plural) + ', בבקשה!'), 250);
    } else {
      done.classList.add('hidden');
      bLabel.textContent = 'רק ' + fruit.plural + ' ' + fruit.emoji + ' בסל!';
      const others = shuffle(FRUITS.filter(f => f.name !== fruit.name)).slice(0, 2);
      const needed = randInt(3, 5);
      let inBasket = 0;
      const items = [];
      for (let i = 0; i < needed; i++) items.push(fruit);
      others.forEach(o => { for (let i = 0; i < randInt(1, 2); i++) items.push(o); });
      shuffle(items).forEach(f => {
        const b = el('button', 'fruit-btn', f.emoji);
        b.onclick = () => {
          if (f.name === fruit.name) {
            b.disabled = true; b.style.opacity = '0.25';
            inBasket++;
            const sp = el('span', '', f.emoji);
            bFruits.appendChild(sp);
            speak(NUM_F[inBasket - 1]);
            if (inBasket === needed) setTimeout(() => {
              if (round >= total) finish();
              else { celebrate('יופי! מיינת נכון!'); setTimeout(newRound, 1600); }
            }, 400);
          } else {
            speak('זה ' + f.name + ', לא ' + fruit.name + '. נסי שוב');
          }
        };
        shelf.appendChild(b);
      });
      setTimeout(() => speak('שימי רק ' + fruit.plural + ' בסל!'), 250);
    }
  }
  done.onclick = () => {
    if (mode !== 'count') return;
    if (count === target) {
      celebrate('תודה! בדיוק ' + target + '!');
      setTimeout(() => { round >= total ? finish() : newRound(); }, 1700);
    } else if (count < target) {
      speak('צריך עוד! שמנו ' + count + ', וצריך ' + target);
    } else {
      speak('יותר מדי! געי בפרי בסל כדי להחזיר אותו');
    }
  };
  bFruits.onclick = ev => {
    if (ev.target.tagName === 'SPAN' && mode === 'count') {
      ev.target.remove();
      count = Math.max(0, count - 1);
      bLabel.textContent = 'הסל שלי 🧺 (' + count + ')';
    }
  };
  function finish() {
    shelf.innerHTML = ''; done.classList.add('hidden');
    celebrate('חנות מעולה! כל הכבוד!');
    const again = el('button', 'big-action', '🍎 עוד פעם');
    again.onclick = renderShop;
    area.appendChild(again);
  }
  shell('חנות הפירות', area, { prompt: 'תני ללקוח בדיוק מה שהוא מבקש' });
  newRound();
}

// ---------- game 5: letters ----------
function renderLetters() { renderLettersLearn(); }
function modeTabs(learnFn, quizFn) {
  const tabs = el('div');
  tabs.style.cssText = 'display:flex;gap:10px;justify-content:center;padding-top:4px;';
  const learnBtn = el('button', 'pill-btn', '📖 לומדים');
  learnBtn.style.fontSize = '18px';
  const quizBtn = el('button', 'pill-btn', '🎮 משחק');
  quizBtn.style.fontSize = '18px';
  learnBtn.onclick = learnFn;
  quizBtn.onclick = quizFn;
  tabs.append(learnBtn, quizBtn);
  return tabs;
}
function renderLettersLearn() {
  const area = el('div', 'game-area');
  area.style.overflowY = 'auto';
  function showGrid() {
    area.innerHTML = '';
    const grid = el('div', 'pick-grid');
    LETTERS.forEach(([l]) => {
      const c = el('button', 'pick-cell', l);
      c.onclick = () => showLetter(l);
      grid.appendChild(c);
    });
    area.appendChild(grid);
    setTimeout(() => speak('בחרי אות ונלמד אותה!'), 200);
  }
  function showLetter(letter) {
    const idx = LETTERS.findIndex(x => x[0] === letter);
    const [l, word, emoji] = LETTERS[idx];
    area.innerHTML = '';
    const card = el('div', 'big-card');
    card.append(el('div', 'main', l), el('div', 'pic', emoji), el('div', 'word', l + ' - ' + word));
    const nav = el('div', 'nav-row');
    const prev = el('button', 'pill-btn', '→');
    const gridB = el('button', 'pill-btn', '🔤 כולן');
    const next = el('button', 'pill-btn', '←');
    prev.onclick = () => showLetter(LETTERS[(idx + 1) % LETTERS.length][0]);
    next.onclick = () => showLetter(LETTERS[(idx - 1 + LETTERS.length) % LETTERS.length][0]);
    gridB.onclick = showGrid;
    nav.append(prev, gridB, next);
    area.append(card, nav);
    speak(l + '. ' + word);
  }
  const wrap = el('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;flex:1;gap:10px;min-height:0;';
  wrap.append(modeTabs(renderLettersLearn, renderLettersQuiz), area);
  shell('אותיות', wrap, { prompt: 'בחרי אות' });
  showGrid();
}
function renderLettersQuiz() {
  const area = el('div', 'game-area');
  let round = 0, total = 5, lock = false;
  function newRound() {
    round++; lock = false;
    area.innerHTML = '';
    const opts = shuffle(LETTERS).slice(0, 4);
    const target = pick(opts);
    const pb = app.querySelector('.prompt-bar');
    if (pb) pb.firstChild.textContent = 'איפה האות ' + target[0] + '? (' + target[2] + ' ' + target[1] + ')';
    const qc = el('div', 'quiz-choices');
    opts.forEach(([l]) => {
      const b = el('button', 'quiz-choice', l);
      b.onclick = () => {
        if (lock) return;
        if (l === target[0]) {
          lock = true;
          b.classList.add('right');
          speak('נכון! ' + l + ' - ' + target[1]);
          confetti(10);
          setTimeout(() => { round >= total ? finish() : newRound(); }, 1400);
        } else {
          b.classList.add('wrong');
          speak('נסי שוב! איפה האות ' + target[0] + '?');
          setTimeout(() => b.classList.remove('wrong'), 500);
        }
      };
      qc.appendChild(b);
    });
    area.appendChild(qc);
    setTimeout(() => speak('איפה האות ' + target[0] + '?'), 250);
  }
  function finish() {
    area.innerHTML = '';
    celebrate('אלופה! יודעת אותיות!');
    const again = el('button', 'big-action', '🔤 עוד פעם');
    again.onclick = () => { round = 0; again.remove(); newRound(); };
    area.appendChild(again);
  }
  const wrap = el('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;flex:1;gap:10px;min-height:0;';
  wrap.append(modeTabs(renderLettersLearn, renderLettersQuiz), area);
  shell('אותיות', wrap, { prompt: '...' });
  newRound();
}

// ---------- game 6: numbers ----------
function renderNumbers() { renderNumbersLearn(); }
function renderNumbersLearn() {
  const area = el('div', 'game-area');
  area.style.overflowY = 'auto';
  const timers = [];
  onCleanup(() => timers.forEach(clearTimeout));
  function showGrid() {
    timers.forEach(clearTimeout);
    area.innerHTML = '';
    const grid = el('div', 'pick-grid');
    for (let n = 1; n <= 10; n++) {
      const c = el('button', 'pick-cell', String(n));
      c.onclick = () => showNumber(n);
      grid.appendChild(c);
    }
    area.appendChild(grid);
    setTimeout(() => speak('בחרי מספר ונספור ביחד!'), 200);
  }
  function showNumber(n) {
    timers.forEach(clearTimeout);
    area.innerHTML = '';
    const em = pick(COUNT_EMOJIS);
    const card = el('div', 'big-card');
    card.append(el('div', 'main', String(n)), el('div', 'word', NUM_F[n - 1]));
    const row = el('div', 'count-row');
    const spans = [];
    for (let i = 0; i < n; i++) {
      const s = el('span', '', em);
      s.style.animationDelay = (i * 0.08) + 's';
      spans.push(s);
      row.appendChild(s);
    }
    card.appendChild(row);
    const nav = el('div', 'nav-row');
    const prev = el('button', 'pill-btn', '→');
    const gridB = el('button', 'pill-btn', '🔢 הכול');
    const next = el('button', 'pill-btn', '←');
    prev.onclick = () => showNumber(n % 10 + 1);
    next.onclick = () => showNumber((n - 2 + 10) % 10 + 1);
    gridB.onclick = showGrid;
    nav.append(prev, gridB, next);
    area.append(card, nav);
    spans.forEach((s, i) => {
      timers.push(setTimeout(() => {
        spans.forEach(x => x.classList.remove('lit'));
        s.classList.add('lit');
        speak(NUM_F[i]);
      }, 500 + i * 900));
    });
  }
  const wrap = el('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;flex:1;gap:10px;min-height:0;';
  wrap.append(modeTabs(renderNumbersLearn, renderNumbersQuiz), area);
  shell('מספרים', wrap, { prompt: 'בחרי מספר' });
  showGrid();
}
function renderNumbersQuiz() {
  const area = el('div', 'game-area');
  let round = 0, total = 5, lock = false;
  function newRound() {
    round++; lock = false;
    area.innerHTML = '';
    const kind = Math.random() < 0.5 ? 'howmany' : 'findnum';
    const qc = el('div', 'quiz-choices');
    if (kind === 'howmany') {
      const n = randInt(1, 10);
      const em = pick(COUNT_EMOJIS);
      const stage = el('div');
      stage.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:18px 10px 0;font-size:44px;';
      for (let i = 0; i < n; i++) stage.appendChild(el('span', '', em));
      area.appendChild(stage);
      const opts = new Set([n]);
      while (opts.size < 4) opts.add(randInt(1, 10));
      shuffle([...opts]).forEach(v => {
        const b = el('button', 'quiz-choice', String(v));
        b.onclick = () => {
          if (lock) return;
          if (v === n) {
            lock = true; b.classList.add('right');
            speak('נכון! ' + NUM_F[n - 1] + '!');
            confetti(10);
            setTimeout(() => { round >= total ? finish() : newRound(); }, 1400);
          } else {
            b.classList.add('wrong');
            speak('ספרי שוב לאט');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        };
        qc.appendChild(b);
      });
      area.appendChild(qc);
      const pb = app.querySelector('.prompt-bar');
      if (pb) pb.firstChild.textContent = 'כמה ' + em + ' את רואה?';
      setTimeout(() => speak('כמה את רואה? ספרי וגעי במספר הנכון'), 250);
    } else {
      const n = randInt(1, 10);
      const opts = new Set([n]);
      while (opts.size < 4) opts.add(randInt(1, 10));
      shuffle([...opts]).forEach(v => {
        const b = el('button', 'quiz-choice', String(v));
        b.onclick = () => {
          if (lock) return;
          if (v === n) {
            lock = true; b.classList.add('right');
            speak('נכון! זה המספר ' + n);
            confetti(10);
            setTimeout(() => { round >= total ? finish() : newRound(); }, 1400);
          } else {
            b.classList.add('wrong');
            speak('נסי שוב! איפה המספר ' + n + '?');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        };
        qc.appendChild(b);
      });
      area.appendChild(qc);
      const pb = app.querySelector('.prompt-bar');
      if (pb) pb.firstChild.textContent = 'איפה המספר ' + n + '?';
      setTimeout(() => speak('איפה המספר ' + n + '?'), 250);
    }
  }
  function finish() {
    area.innerHTML = '';
    celebrate('אלופה! יודעת לספור!');
    const again = el('button', 'big-action', '🔢 עוד פעם');
    again.onclick = () => { round = 0; again.remove(); newRound(); };
    area.appendChild(again);
  }
  const wrap = el('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;flex:1;gap:10px;min-height:0;';
  wrap.append(modeTabs(renderNumbersLearn, renderNumbersQuiz), area);
  shell('מספרים', wrap, { prompt: '...' });
  newRound();
}

// ---------- boot ----------
renderHome();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
