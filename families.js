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
  if(EXTRA_FAMILY_IDS.has(kind)) return extraFamilyArt(kind,baby);
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
  const order=takeFamilySession();
  onCleanup(()=>{active=false;});
  const intro=el('div','family-intro');
  const pair=el('div','family-intro-pair');
  pair.innerHTML=familyArt('hen',false)+familyArt('hen',true);
  const start=el('button','family-next','▶');
  start.setAttribute('aria-label','מתחילים');
  start.onclick=()=>newRound();
  intro.append(el('h2','','חיות והגורים שלהן'),pair,el('p','','18 משפחות חיות · 6 בכל סיבוב'),start);
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

ANIMAL_FAMILIES.push(...[{"id": "rabbit", "parent": "ארנבת", "baby": "ארנבון", "q": "איפה התינוק של הארנבת? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! ארנבת וארנבון. לחצי על החץ כדי להמשיך."}, {"id": "horse", "parent": "סוסה", "baby": "סייח", "q": "איפה התינוק של הסוסה? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! סוסה וסייח. לחצי על החץ כדי להמשיך."}, {"id": "lion", "parent": "לביאה", "baby": "גור אריות", "q": "איפה התינוק של הלביאה? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! לביאה וגור אריות. לחצי על החץ כדי להמשיך."}, {"id": "elephant", "parent": "פילה", "baby": "פילון", "q": "איפה התינוק של הפילה? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! פילה ופילון. לחצי על החץ כדי להמשיך."}, {"id": "monkey", "parent": "קופה", "baby": "גור קופים", "q": "איפה התינוק של הקופה? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! קופה וגור קופים. לחצי על החץ כדי להמשיך."}, {"id": "pig", "parent": "חזירה", "baby": "חזרזיר", "q": "איפה התינוק של החזירה? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! חזירה וחזרזיר. לחצי על החץ כדי להמשיך."}, {"id": "goat", "parent": "עז", "baby": "גדי", "q": "איפה התינוק של העז? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! עז וגדי. לחצי על החץ כדי להמשיך."}, {"id": "bear", "parent": "דובה", "baby": "גור דובים", "q": "איפה התינוק של הדובה? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! דובה וגור דובים. לחצי על החץ כדי להמשיך."}, {"id": "penguin", "parent": "פינגווינית", "baby": "אפרוח פינגווין", "q": "איפה התינוק של הפינגווינית? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! פינגווינית ואפרוח פינגווין. לחצי על החץ כדי להמשיך."}, {"id": "turtle", "parent": "צבה", "baby": "צב קטן", "q": "איפה התינוק של הצבה? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! צבה וצב קטן. לחצי על החץ כדי להמשיך."}, {"id": "giraffe", "parent": "ג׳ירפה", "baby": "גור ג׳ירפות", "q": "איפה התינוק של הג׳ירפה? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! ג׳ירפה וגור ג׳ירפות. לחצי על החץ כדי להמשיך."}, {"id": "zebra", "parent": "זברה", "baby": "גור זברות", "q": "איפה התינוק של הזברה? בחרי בתמונה המתאימה.", "ok": "כל הכבוד! זברה וגור זברות. לחצי על החץ כדי להמשיך."}]);
const EXTRA_FAMILY_IDS=new Set(["rabbit", "horse", "lion", "elephant", "monkey", "pig", "goat", "bear", "penguin", "turtle", "giraffe", "zebra"]);
let familyBag=[];
function takeFamilySession(){if(familyBag.length<6)familyBag=shuffle(ANIMAL_FAMILIES);return familyBag.splice(0,6);}
function extraFamilyArt(kind,baby){
 const color={rabbit:'#f2ddc6',horse:'#b78256',lion:'#d6a04f',elephant:'#b2b7ca',monkey:'#b88962',pig:'#f0b1bb',goat:'#ead9bf',bear:'#9b795c',penguin:'#555e72',turtle:'#8cb878',giraffe:'#efc267',zebra:'#fff8ec'}[kind];
 const stroke='#573d36';let back='',face='',body='',ears='';
 if(kind==='rabbit')ears='<ellipse cx="79" cy="32" rx="12" ry="32" fill="'+color+'"/><ellipse cx="121" cy="32" rx="12" ry="32" fill="'+color+'"/><path d="M79 14v31m42-31v31" stroke="#d99aa6" stroke-width="6"/>';
 if(kind==='horse'||kind==='zebra')ears='<path d="M68 49l-2-29 21 20m26 0 21-20-2 29" fill="'+color+'"/><path d="M82 44q18-30 37 1" fill="#6e5145"/>';
 if(kind==='giraffe')ears='<path d="M77 48l-2-21m49 21 2-21"/><circle cx="75" cy="25" r="6" fill="#a4784f"/><circle cx="126" cy="25" r="6" fill="#a4784f"/><path d="M69 54q-30-18-30-3 2 17 31 15m60-12q30-18 30-3-2 17-31 15" fill="'+color+'"/>';
 if(kind==='goat')ears='<path d="M76 43q-8-32 7-27l6 28m23 0q10-33 17-27l-7 28" fill="#b5a18b"/><path d="M68 55q-31-16-28 0 8 17 32 10m56-10q31-16 28 0-8 17-32 10" fill="'+color+'"/>';
 if(kind==='elephant')ears='<ellipse cx="53" cy="77" rx="31" ry="38" fill="'+color+'"/><ellipse cx="147" cy="77" rx="31" ry="38" fill="'+color+'"/>';
 if(kind==='monkey'||kind==='bear')ears='<circle cx="62" cy="56" r="20" fill="'+color+'"/><circle cx="138" cy="56" r="20" fill="'+color+'"/><circle cx="62" cy="56" r="11" fill="#e5c7a5"/><circle cx="138" cy="56" r="11" fill="#e5c7a5"/>';
 if(kind==='pig')ears='<path d="M66 55L48 22l36 16m32 0 36-16-18 33" fill="'+color+'"/>';
 if(kind==='lion')ears='<circle cx="67" cy="46" r="14" fill="'+color+'"/><circle cx="133" cy="46" r="14" fill="'+color+'"/>';
 body='<path d="M68 130v22h17v-16m30-6v22h17v-22" fill="'+color+'"/><ellipse cx="100" cy="118" rx="43" ry="29" fill="'+color+'"/>';
 if(kind==='giraffe')body+='<path d="M86 122V84h27v39" fill="'+color+'"/><circle cx="77" cy="124" r="7" fill="#b17f46"/><circle cx="123" cy="114" r="6" fill="#b17f46"/>';
 if(kind==='penguin'){
  body='<path d="M79 144l-13 12h25m18-12-2 12h26" fill="#eab14e"/><ellipse cx="100" cy="106" rx="45" ry="48" fill="'+color+'"/><path d="M62 95l-18 28 25-13m69-15 18 28-25-13" fill="'+color+'"/><ellipse cx="100" cy="117" rx="28" ry="32" fill="#fff8ec"/>';
  face='<ellipse cx="100" cy="66" rx="35" ry="31" fill="'+color+'"/><path d="M69 65q8-34 31-7 23-27 31 7v17H69Z" fill="#fff8ec"/><path d="M91 79h18l-9 12Z" fill="#eab14e"/>';
 }else if(kind==='turtle'){
  body='<ellipse cx="60" cy="140" rx="17" ry="10" fill="'+color+'"/><ellipse cx="140" cy="140" rx="17" ry="10" fill="'+color+'"/><ellipse cx="100" cy="116" rx="54" ry="35" fill="#6a9356"/><path d="M82 90h36l15 23-16 23H82l-15-23Z" fill="#a5c27c"/><path d="M82 90L64 96m53 40 15 10m-50-10-16 10m52-56 18 6" fill="none"/>';
  face='<ellipse cx="100" cy="70" rx="31" ry="27" fill="'+color+'"/>';
 }else{
  face='<ellipse cx="100" cy="71" rx="'+(['horse','zebra','giraffe'].includes(kind)?33:39)+'" ry="'+(['horse','zebra','giraffe'].includes(kind)?38:33)+'" fill="'+color+'"/>';
  if(kind==='monkey')face+='<path d="M72 62q11-25 28-6 17-19 28 6v21q-28 31-56 0Z" fill="#e5c7a5"/>';
  if(kind==='pig')face+='<ellipse cx="100" cy="84" rx="24" ry="15" fill="#d58b9b"/><circle cx="92" cy="84" r="3"/><circle cx="108" cy="84" r="3"/>';
  if(kind==='elephant')face+='<path d="M89 80v35q2 24 21 15l8-9-8-8q-8 12-8-2V80" fill="'+color+'"/>';
  if(['horse','zebra','giraffe'].includes(kind))face+='<ellipse cx="100" cy="94" rx="27" ry="18" fill="#dfbd99"/><circle cx="88" cy="93" r="2"/><circle cx="112" cy="93" r="2"/>';
  if(kind==='zebra')face+='<path d="M73 52l16 10m-20 3 17 8m42-21-17 10m20 3-17 8m-17-31 3 15m-29 63 19 4m37-6-18 6" fill="none" stroke="#655e5a" stroke-width="6"/>';
  if(kind==='giraffe')face+='<circle cx="82" cy="48" r="5" fill="#b17f46"/><circle cx="117" cy="53" r="6" fill="#b17f46"/>';
  if(kind==='goat')face+='<path d="M91 96l9 19 9-19" fill="#b4a18a"/>';
  if(!['pig','elephant','horse','zebra','giraffe'].includes(kind))face+='<path d="M94 82q6-5 12 0l-6 7Z" fill="'+stroke+'"/><path d="M91 92q9 8 18 0" fill="none" stroke-width="2"/>';
 }
 const eyes='<circle cx="85" cy="68" r="3" fill="#302d39" stroke="none"/><circle cx="115" cy="68" r="3" fill="#302d39" stroke="none"/>';
 return '<svg viewBox="0 0 200 175" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="100" cy="160" rx="62" ry="8" fill="#254a3020"/><g stroke="'+stroke+'" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" transform="'+(baby?'translate(15 23) scale(.85)':'')+'">'+body+back+ears+face+eyes+(baby?'<path d="M87 115l13 6-13 7zm26 0-13 6 13 7z" fill="#b083cf" stroke-width="2"/>':'')+'</g></svg>';
}
