'use strict';
// Animal families: all instructions are bundled recordings, with no network TTS at play time.
const ANIMAL_FAMILIES = [
  {id:'dog', parent:'כלבה', baby:'גור כלבים', q:'איפה הגור של הכלבה? געי בתינוק שלה.', ok:'כל הכבוד! לכלבה יש גור. געי בחץ כדי להמשיך.'},
  {id:'cat', parent:'חתולה', baby:'גור חתולים', q:'איפה הגור של החתולה? געי בתינוק שלה.', ok:'כל הכבוד! לחתולה יש גור חתולים. געי בחץ כדי להמשיך.'},
  {id:'cow', parent:'פרה', baby:'עגל', q:'איפה העגל של הפרה? געי בתינוק שלה.', ok:'כל הכבוד! לפרה יש עגל. געי בחץ כדי להמשיך.'},
  {id:'sheep', parent:'כבשה', baby:'טלה', q:'איפה הטלה של הכבשה? געי בתינוק שלה.', ok:'כל הכבוד! לכבשה יש טלה. געי בחץ כדי להמשיך.'},
  {id:'hen', parent:'תרנגולת', baby:'אפרוח', q:'איפה האפרוח של התרנגולת? געי בתינוק שלה.', ok:'כל הכבוד! לתרנגולת יש אפרוח. געי בחץ כדי להמשיך.'},
  {id:'duck', parent:'ברווזה', baby:'ברווזון', q:'איפה הברווזון של הברווזה? געי בתינוק שלה.', ok:'כל הכבוד! לברווזה יש ברווזון. געי בחץ כדי להמשיך.'}
];
function familyArt(kind, baby) {
  const outline='#573d36', eye='#302d39';
  const colors={dog:'#d6a365',cat:'#f6b66b',cow:'#fff9ee',sheep:'#fff9ef',hen:baby?'#ffe077':'#fff7e9',duck:baby?'#ffe077':'#f8fbef'};
  let details='', head='', feet='';
  const face=(x,y,r=3)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${eye}" stroke="none"/>`;
  if(kind==='hen'||kind==='duck') {
    feet='<path d="M85 142v14m-8 0h16m20-14v14m-8 0h16" fill="none" stroke="#d5873c"/>';
    details=kind==='hen'&&!baby?'<path d="M100 40q-12-25-18-8q-10-12-15 3l10 19" fill="#ee6868"/>':'';
    head=`<circle cx="93" cy="70" r="31" fill="${colors[kind]}"/>${face(83,67)}${face(105,67)}${kind==='duck'?'<ellipse cx="96" cy="83" rx="19" ry="8" fill="#f3a23b"/>':'<path d="M88 80l16 0-8 12z" fill="#efa13a"/>'}`;
    details+='<path d="M73 111q15 22 32 1" fill="none" stroke="#d5b877"/>';
  } else {
    feet='<path d="M70 134v19h15v-16m30-3v19h15v-19" fill="'+colors[kind]+'"/>';
    if(kind==='cat') head='<path d="M60 58l3-33 28 25m18 0 28-25 2 36" fill="#f6b66b"/><path d="M68 44l1-10 11 14m41 0 10-13 2 12" stroke="#e88e96" fill="none"/>';
    if(kind==='dog') head='<ellipse cx="62" cy="65" rx="15" ry="30" transform="rotate(18 62 65)" fill="#925d3c"/><ellipse cx="139" cy="65" rx="15" ry="30" transform="rotate(-18 139 65)" fill="#925d3c"/>';
    if(kind==='cow') head='<path d="M70 49q-28-20-30-1 5 20 30 12m60-12q28-20 30-1-5 20-30 12" fill="#f3b0ac"/><path d="M72 43l-2-18 16 15m28 0 16-15-2 18" fill="#e0b97b"/>';
    if(kind==='sheep') head='<path d="M73 54q-30-17-31 3 12 20 31 7m54-10q30-17 31 3-12 20-31 7" fill="#d7b5a0"/>';
    head+=`<ellipse cx="100" cy="72" rx="${baby?37:40}" ry="34" fill="${kind==='sheep'?'#d9b99b':colors[kind]}"/>`;
    if(kind==='sheep') head+='<path d="M64 56q-8-22 13-23 4-18 22-7 17-12 24 6 21 2 13 25" fill="#fff9ef"/>';
    head+=face(84,68)+face(116,68);
    if(kind==='cow') head+='<ellipse cx="100" cy="86" rx="28" ry="15" fill="#f5b8bb"/><circle cx="88" cy="85" r="2"/><circle cx="112" cy="85" r="2"/>';
    else head+='<path d="M94 82q6-6 12 0l-6 6z" fill="#573d36"/><path d="M88 91q12 10 24 0" fill="none" stroke-width="2"/>';
    if(kind==='cat') head+='<path d="M76 84l-20-4m20 10-20 4m68-10 20-4m-20 10 20 4" stroke-width="2"/>';
    if(kind==='cow') details='<ellipse cx="74" cy="112" rx="14" ry="18" fill="#6b6668"/><ellipse cx="130" cy="124" rx="12" ry="16" fill="#6b6668"/>';
    if(kind==='sheep') details='<path d="M61 108q-14-17 5-25 5-17 20-7 14-14 28 0 19-8 22 12 17 8 5 23 12 16-7 23-8 15-24 5-17 13-28-2-21 7-23-12" fill="#fff9ef"/>';
  }
  return `<svg viewBox="0 0 200 175" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="100" cy="160" rx="62" ry="8" fill="#254a3020"/><g stroke="${outline}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" transform="${baby?'translate(15 23) scale(.85)':''}">${feet}<ellipse cx="100" cy="116" rx="47" ry="32" fill="${colors[kind]}"/>${details}${head}${baby?'<path d="M87 109l13 6-13 7zm26 0-13 6 13 7z" fill="#b083cf" stroke-width="2"/>':''}</g></svg>`;
}
function renderFamilies() {
  const area=el('div','family-area');
  shell('חיות והגורים שלהן',area,{prompt:'בואי נחבר בין החיות לגורים שלהן. הסתכלי על האמא, וגעי בתינוק שלה. אפשר לשמוע שוב בכפתור הרמקול.'});
  let active=true, round=0, solved=false;
  const order=shuffle(ANIMAL_FAMILIES);
  onCleanup(()=>{active=false;});
  const intro=el('div','family-intro');
  const pair=el('div','family-intro-pair');
  pair.innerHTML=familyArt('hen',false)+familyArt('hen',true);
  const start=el('button','family-next','▶');
  start.setAttribute('aria-label','מתחילים');
  start.onclick=()=>newRound();
  intro.append(el('h2','','חיות והגורים שלהן'),pair,el('p','','מחברים כל אמא לתינוק שלה'),start);
  area.append(intro);
  speakTaskIfOn();
  function speakTaskIfOn(){if(soundOn)speakTask();}
  function progress(){
    const bar=el('div','family-progress');
    bar.setAttribute('aria-label',`${round} מתוך 6 משפחות`);
    for(let i=0;i<6;i++)bar.append(el('span',i<round?'filled':'',i<round?'♥':'♡'));
    return bar;
  }
  function newRound(){
    if(!active)return;
    if(round===order.length){finish();return;}
    solved=false;
    const target=order[round];
    area.innerHTML='';area.append(progress());
    const parent=el('div','family-parent');parent.innerHTML=familyArt(target.id,false);
    parent.append(el('div','family-parent-label',target.parent));
    const question=el('div','family-question','?');
    const choices=el('div','family-choices');
    const options=shuffle([target,...shuffle(ANIMAL_FAMILIES.filter(a=>a!==target)).slice(0,2)]);
    const status=el('div','family-status');status.setAttribute('aria-live','polite');
    options.forEach(animal=>{
      const b=el('button','family-choice');b.dataset.animal=animal.id;
      b.setAttribute('aria-label',animal.baby);b.innerHTML=familyArt(animal.id,true);
      b.onclick=()=>{
        if(solved||!active)return;
        if(animal!==target){
          b.classList.add('family-retry');b.disabled=true;status.textContent='💛 נסי שוב';speak('נסי שוב');return;
        }
        solved=true;round++;
        b.classList.add('family-correct');choices.querySelectorAll('button').forEach(x=>x.disabled=true);
        area.firstChild.replaceWith(progress());
        status.textContent='♥ '+target.parent+' ו'+target.baby;
        confetti(10);setTask(target.ok,'כל הכבוד! המשפחה יחד ♥');speakTaskIfOn();
        const next=el('button','family-next','←');next.setAttribute('aria-label','למשפחה הבאה');next.onclick=newRound;area.append(next);next.focus({preventScroll:true});
      };choices.append(b);
    });
    area.append(parent,question,choices,status);
    setTask(target.q);speakTaskIfOn();
  }
  function finish(){
    area.innerHTML='';area.append(progress());
    const collection=el('div','family-collection');
    order.forEach(a=>{const pair=el('div','family-collected');pair.innerHTML=familyArt(a.id,false)+familyArt(a.id,true);collection.append(pair);});
    const again=el('button','family-next','♥');again.setAttribute('aria-label','עוד פעם');again.onclick=renderFamilies;
    area.append(el('h2','family-finish','כל המשפחות יחד!'),collection,again);
    setTask('אלופה! חיברת את כל המשפחות. געי בלב כדי לשחק שוב.','אלופה! כל המשפחות יחד ♥');confetti();speakTaskIfOn();
  }
}
