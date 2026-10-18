'use strict';
/* Pre-generated Hebrew audio clips with speechSynthesis fallback.
   speak(text) is split into known clips (greedy longest match); digits are read as numbers.
   One shared <audio> element is unlocked on the first tap (iOS needs that; HTMLAudio also plays with the silent switch on). */
(function () {
  const CLIPS = window.AUDIO_CLIPS || {};
  const NUM_F = ['אחת','שתיים','שלוש','ארבע','חמש','שש','שבע','שמונה','תשע','עשר'];
  const MAXN = Math.max.apply(null, Object.keys(CLIPS).map(k => k.split(' ').length));
  const audio = new Audio();
  audio.preload = 'auto';
  audio.setAttribute('playsinline', '');
  const blobs = {};      // file -> Promise<objectURL>
  let token = 0;         // cancels older sequences
  let unlocked = false;
  const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  window.AUDIO_DEBUG = { events: [], lastError: null };
  function log(e) { const d = window.AUDIO_DEBUG; d.events.push(e); if (d.events.length > 200) d.events.shift(); }
  ['play','playing','ended','error','pause'].forEach(ev => audio.addEventListener(ev, () => log(ev + ':' + (audio.getAttribute('data-clip') || ''))));

  function unlock() {
    if (unlocked) return;
    unlocked = true; // set first so only one attempt per gesture burst
    try {
      audio.src = SILENT;
      const p = audio.play();
      if (p && p.catch) p.catch(() => { unlocked = false; });
    } catch (e) { unlocked = false; }
  }
  ['pointerdown','touchstart','touchend','click','keydown'].forEach(ev =>
    document.addEventListener(ev, unlock, { capture: true, passive: true }));

  function norm(t) {
    return String(t).replace(/ג׳/g, 'ג\u0001').replace(/[!?.,:;\-–()"'׳]/g, ' ').replace(/\u0001/g, 'ג׳')
      .replace(/\d+/g, m => { const n = parseInt(m, 10); return NUM_F[n - 1] || m; })
      .replace(/\s+/g, ' ').trim();
  }
  // returns array of clip files, or null if some word has no clip
  function plan(text) {
    const w = norm(text).split(' ').filter(Boolean);
    const out = [];
    let i = 0;
    while (i < w.length) {
      let hit = null;
      for (let n = Math.min(MAXN, w.length - i); n >= 1; n--) {
        const k = w.slice(i, i + n).join(' ');
        if (CLIPS[k]) { hit = { f: CLIPS[k], n }; break; }
      }
      if (!hit) return null;
      out.push(hit.f); i += hit.n;
    }
    return out.length ? out : null;
  }
  function load(f) {
    const emb = window.AUDIO_DATA && window.AUDIO_DATA[f];
    if (emb) return Promise.resolve(emb);
    if (!blobs[f]) {
      blobs[f] = fetch('audio/' + f).then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.blob(); })
        .then(b => URL.createObjectURL(b));
      blobs[f].catch(() => { delete blobs[f]; });
    }
    return blobs[f];
  }
  function webSpeech(text, rate) {
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'he-IL';
      const v = speechSynthesis.getVoices().find(x => x.lang && x.lang.toLowerCase().startsWith('he'));
      if (v) u.voice = v;
      u.rate = rate || 0.9; u.pitch = 1.15;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function stop() {
    token++;
    try { audio.pause(); } catch (e) {}
    if ('speechSynthesis' in window) try { speechSynthesis.cancel(); } catch (e) {}
  }
  function playFile(f, my) {
    return load(f).then(url => new Promise((res, rej) => {
      if (my !== token) return res();
      audio.setAttribute('data-clip', f);
      let timer = null;
      const cleanup = () => { clearTimeout(timer); audio.removeEventListener('ended', done); audio.removeEventListener('error', fail); audio.removeEventListener('playing', started); };
      const done = () => { cleanup(); res(); };
      const fail = () => { cleanup(); rej(new Error('audio error')); };
      // if playback never starts (blocked or stalled), give up so the speech fallback can take over
      const started = () => { clearTimeout(timer); timer = setTimeout(fail, 20000); };
      timer = setTimeout(fail, 4000);
      audio.addEventListener('ended', done); audio.addEventListener('error', fail); audio.addEventListener('playing', started);
      audio.src = url;
      const p = audio.play();
      if (p && p.catch) p.catch(e => { cleanup(); rej(e); });
    }));
  }
  function say(text, opts) {
    stop();
    const my = token;
    const files = plan(text);
    if (!files) { window.AUDIO_DEBUG.lastError = 'no clip plan: ' + text; webSpeech(text, opts && opts.rate); return Promise.resolve('fallback'); }
    files.forEach(load); // prefetch the rest while the first plays
    let chain = Promise.resolve();
    files.forEach(f => { chain = chain.then(() => (my === token ? playFile(f, my) : null)); });
    return chain.then(() => 'clips').catch(e => {
      window.AUDIO_DEBUG.lastError = String(e && e.message || e);
      if (my === token) webSpeech(text, opts && opts.rate);
      return 'fallback';
    });
  }
  window.KidsAudio = { say, stop, plan, norm, unlock, audioEl: audio };
})();
