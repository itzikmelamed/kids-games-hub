'use strict';
// Self-paced hide-and-seek: no countdown or moving targets, and unlimited peeks.
function renderHide() {
  const area=el('div','hide-area');
  shell('מחבואים עם חיות',area,{prompt:'החיות משחקות מחבואים! הסתכלי איפה החיה נמצאת. כשאת מוכנה, לחצי על העלה כדי להסתיר אותה.'});
  let active=true,round=0,target=0,locked=false;
  const animals=shuffle(ANIMAL_FAMILIES).slice(0,6);
  onCleanup(()=>{active=false;});
  const intro=el('div','hide-intro');
  const art=el('div','hide-intro-art');art.innerHTML=familyArt('dog',true)+bushSVG();
  const start=el('button','hide-action','▶');start.setAttribute('aria-label','מתחילים מחבואים');start.onclick=newRound;
  intro.append(el('h2','','מי מתחבא בשיח?'),art,el('p','','מסתכלים, מסתירים ומוצאים!'),start);area.append(intro);
  if(soundOn)speakTask();
  function progress(){
    const p=el('div','hide-progress');p.setAttribute('aria-label',`${round} מתוך 6 חיות`);
    for(let i=0;i<6;i++)p.append(el('span',i<round?'found':'',i<round?'★':'☆'));
    return p;
  }
  function newRound(){
    if(!active)return;if(round===6){finish();return;}
    locked=false;area.innerHTML='';area.append(progress());
    const n=round<2?2:3;target=randInt(0,n-1);
    const field=el('div','hide-field');field.classList.add(n===2?'two-bushes':'three-bushes');
    const status=el('div','hide-status');status.setAttribute('aria-live','polite');
    const controls=el('div','hide-controls');
    let covered=false;
    const slots=[];
    for(let i=0;i<n;i++){
      const b=el('button','hide-bush');b.setAttribute('aria-label',`שיח ${i+1}`);b.dataset.slot=i;
      const critter=el('div','hide-critter');if(i===target)critter.innerHTML=familyArt(animals[round].id,true);
      const bush=el('div','hide-leaves');bush.innerHTML=bushSVG();
      b.append(critter,bush);b.onclick=()=>{
        if(!covered||locked||b.disabled||!active)return;
        if(i!==target){b.classList.add('empty-bush');b.disabled=true;status.textContent='עוד ניסיון ♥';speak('נסי שוב');return;}
        locked=true;round++;area.firstChild.replaceWith(progress());
        b.classList.add('animal-found');slots.forEach(s=>s.disabled=true);
        status.textContent='מצאת! '+animals[round-1].baby+' ♥';
        controls.innerHTML='';const next=el('button','hide-action','←');next.setAttribute('aria-label','לחיה הבאה');next.onclick=newRound;controls.append(next);
        setTask('מצאת! כל הכבוד! לחצי על החץ כדי להמשיך.','מצאת! כל הכבוד!');if(soundOn)speakTask();confetti(8);
      };slots.push(b);field.append(b);
    }
    function look(){
      covered=false;field.classList.remove('covered');slots.forEach(b=>{b.disabled=true;b.classList.remove('empty-bush');});
      status.textContent='איפה '+animals[round].baby+'?';controls.innerHTML='';
      const hide=el('button','hide-action','♣');hide.innerHTML='<svg viewBox="0 0 64 64" aria-hidden="true" width="44" height="44"><path d="M10 48C4 18 32 6 55 8C58 33 44 57 17 52Z" fill="#c5edaa" stroke="white" stroke-width="3"/><path d="M8 58L46 19M24 42l-2-15m9 8 15-2" stroke="#547f50" stroke-width="4" fill="none"/></svg>';hide.setAttribute('aria-label','להסתיר את החיה');hide.onclick=cover;controls.append(hide);
      setTask('איפה החיה מתחבאת? הסתכלי טוב, ואז לחצי על העלה.','מסתכלים... ואז מסתירים');if(soundOn)speakTask();
    }
    function cover(){
      if(locked)return;covered=true;field.classList.add('covered');slots.forEach(b=>b.disabled=false);status.textContent='מי מתחבא כאן?';controls.innerHTML='';
      const peek=el('button','hide-peek','◉');peek.innerHTML=hideEyeSVG();peek.setAttribute('aria-label','להציץ שוב');peek.onclick=look;controls.append(peek);
      setTask('איפה החיה? געי בשיח שהיא מתחבאת מאחוריו. אפשר ללחוץ על העין כדי להציץ שוב.','איפה החיה? בחרי שיח');if(soundOn)speakTask();
    }
    area.append(field,status,controls);look();
  }
  function finish(){
    area.innerHTML='';area.append(progress(),el('h2','hide-finish','מצאת את כל החיות!'));
    const row=el('div','hide-collection');animals.forEach(a=>{const pic=el('div');pic.innerHTML=familyArt(a.id,true);row.append(pic);});
    const again=el('button','hide-action','◉');again.innerHTML=hideEyeSVG();again.setAttribute('aria-label','מחבואים עוד פעם');again.onclick=renderHide;area.append(row,again);
    setTask('אלופה! מצאת את כל החיות! לחצי על העין כדי לשחק שוב.','אלופה! מצאת את כולן');if(soundOn)speakTask();confetti();
  }
}
function bushSVG(){return '<svg viewBox="0 0 200 125" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="100" cy="112" rx="84" ry="9" fill="#254a3020"/><path d="M24 104C-2 93 3 55 31 52C26 20 62 9 82 31C100 0 139 12 144 37C177 22 202 54 181 77C207 101 169 116 150 109H49Z" fill="#78b87b" stroke="#3d764c" stroke-width="4"/><path d="M44 78q20-22 37 0m30-21q21-21 37 2M87 99q13-20 28-4" fill="none" stroke="#528c5d" stroke-width="5" stroke-linecap="round"/><circle cx="39" cy="91" r="4" fill="#efb9ca"/><circle cx="156" cy="76" r="4" fill="#efb9ca"/></svg>';}

function hideEyeSVG(){return '<svg viewBox="0 0 64 48" aria-hidden="true" width="46" height="38"><path d="M3 24Q32-9 61 24Q32 57 3 24Z" fill="white" stroke="#735091" stroke-width="4"/><circle cx="32" cy="24" r="12" fill="#735091"/><circle cx="35" cy="20" r="4" fill="white"/></svg>';}
