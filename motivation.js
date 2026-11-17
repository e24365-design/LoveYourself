/* Motivation Mode: quotes + "Remind You" affirmations on rotating paper backgrounds */
(()=>{
const REFRESH_MS=5*60*1000;
/* r = width/height of the image; box = clear paper area [left, top, width, height] in % */
const THEMES=[
 {f:'qbg-1.jpg',r:792/1270,box:[36,22,52,48],ink:'#4a3326',acc:'#8a5a3a'},
 {f:'qbg-8.jpg',r:700/1100,box:[20,26,62,52],ink:'#4e1220',acc:'#9b2b44'},
 {f:'qbg-3.jpg',r:694/1232,box:[26,33,48,36],ink:'#4a3320',acc:'#b0780f'},
 {f:'qbg-9.jpg',r:700/1100,box:[20,26,60,50],ink:'#2f4030',acc:'#5d7e5f'},
 {f:'qbg-5.jpg',r:570/1012,box:[22,30,44,44],ink:'#2e1a0c',acc:'#6e3412'},
 {f:'qbg-10.jpg',r:700/1100,box:[20,28,58,48],ink:'#3f2b4a',acc:'#7d5a96'},
 {f:'qbg-7.jpg',r:558/836,box:[32,20,54,52],ink:'#3e1018',acc:'#8e1f33'},
 {f:'qbg-2.jpg',r:670/1190,box:[20,28,56,42],ink:'#4a3326',acc:'#8a5a3a'},
 {f:'qbg-11.jpg',r:700/1100,box:[22,26,58,48],ink:'#4e1220',acc:'#8a5a14'},
 {f:'qbg-4.jpg',r:674/1012,box:[28,22,50,46],ink:'#3e2314',acc:'#9a3f58'},
 {f:'qbg-6.jpg',r:594/1056,box:[14,32,56,34],ink:'#2e1a0c',acc:'#6e3412'}
];
const $=id=>document.getElementById(id);
const poster=$('poster'),txt=$('txt'),qEl=$('q'),byEl=$('by'),leadEl=$('lead'),root=document.querySelector('.mot');
const bgs=[$('bgA'),$('bgB')];let bgOn=1;
let mode=LY.get('mot_mode','quotes');if(mode!=='remind')mode='quotes';
let cur=null,curTheme=null,nextAt=0,busy=false;

const data=m=>m==='quotes'?LY_QUOTES.map(([t,a])=>({t,a})):LY_AFFIRM.map(t=>({t,a:''}));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* every pick comes from a shuffled bag that is remembered, so nothing repeats until all have been seen */
function pickItem(m){
  const all=data(m),key='mot_bag_'+m;let bag=LY.get(key,[]);
  bag=bag.filter(i=>i<all.length);
  if(!bag.length){bag=shuffle(all.map((_,i)=>i));const last=LY.get('mot_last_'+m,-1);if(bag[bag.length-1]===last&&bag.length>1)bag.unshift(bag.pop())}
  const i=bag.pop();LY.set(key,bag);LY.set('mot_last_'+m,i);return all[i];
}
/* backgrounds alternate in order; a long quote skips papers that are too small to hold it */
function pickTheme(len){
  let k=LY.get('mot_theme',Math.floor(Math.random()*THEMES.length));
  const W=Math.min(innerWidth*.92,440);
  for(let n=0;n<THEMES.length;n++){
    k=(k+1)%THEMES.length;const t=THEMES[k];
    const area=(W*t.box[2]/100)*((W/t.r)*t.box[3]/100);
    if(area>=len*235)break;
  }
  LY.set('mot_theme',k);return THEMES[k];
}
function fit(){
  const W=poster.clientWidth;let s=Math.max(12,Math.min(W*(mode==='remind'?.075:.062),30));
  const lim=11;
  txt.style.fontSize=s+'px';
  while(s>lim&&(txt.scrollHeight>txt.clientHeight+1||txt.scrollWidth>txt.clientWidth+1)){s-=.5;txt.style.fontSize=s+'px'}
}
function place(t){
  poster.style.setProperty('--r',t.r);poster.style.setProperty('--ink-c',t.ink);poster.style.setProperty('--acc-c',t.acc);
  const [l,tp,w,h]=t.box;Object.assign(txt.style,{left:l+'%',top:tp+'%',width:w+'%',height:h+'%'});
}
function setBg(t,instant){
  return new Promise(res=>{const im=new Image();im.onload=im.onerror=()=>{
    const nb=bgs[1-bgOn],ob=bgs[bgOn];nb.style.backgroundImage=`url(${t.f})`;
    if(instant){nb.style.transition=ob.style.transition='none'}
    nb.classList.add('show');ob.classList.remove('show');bgOn=1-bgOn;
    if(instant)requestAnimationFrame(()=>{nb.style.transition=ob.style.transition=''});res()};im.src=t.f});
}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function show(instant){
  if(busy)return;busy=true;
  const item=pickItem(mode),t=pickTheme(item.t.length+(item.a||'').length+20);
  if(!instant){txt.classList.add('out');await sleep(350)}
  place(t);const bgP=setBg(t,instant);
  leadEl.textContent=mode==='remind'?'a little reminder':'';
  qEl.textContent=item.t;byEl.textContent=item.a?'— '+item.a:'';
  fit();await bgP;
  txt.classList.remove('out');cur=item;curTheme=t;nextAt=Date.now()+REFRESH_MS;favState();busy=false;
  /* warm up the next paper so the swap is smooth */
}
/* ---- tabs ---- */
function setMode(m,instant){
  mode=m;LY.set('mot_mode',m);root.dataset.mode=m;
  document.querySelectorAll('.seg button').forEach(b=>{const on=b.dataset.mode===m;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  $('sub').textContent=m==='quotes'?'a new thought every time you tap':'gentle words, just for you';
  show(instant);
}
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{if(b.dataset.mode!==mode)setMode(b.dataset.mode)});
$('next').onclick=()=>show();
poster.tabIndex=0;poster.setAttribute('role','button');poster.setAttribute('aria-label','Tap for another one');
poster.onclick=()=>show();
poster.onkeydown=e=>{if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){e.preventDefault();show()}};
/* ---- auto refresh every 5 minutes ---- */
setInterval(()=>{
  const left=nextAt-Date.now();
  if(left<=0&&!document.hidden){show();return}
  const s=Math.max(0,Math.ceil(left/1000));
  $('timer').textContent='a fresh '+(mode==='quotes'?'quote':'reminder')+' arrives in '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
},1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()>=nextAt)show()});
/* ---- favourites ---- */
const favs=()=>LY.get('mot_favs',[]);
const same=(a,b)=>a.t===b.t&&a.m===b.m;
function favState(){
  const on=cur&&favs().some(f=>same(f,{t:cur.t,m:mode}));
  const b=$('fav');b.setAttribute('aria-pressed',on);b.textContent=on?'♥ Saved':'♡ Save';renderFavs();
}
$('fav').onclick=()=>{
  if(!cur)return;let f=favs();const o={t:cur.t,a:cur.a,m:mode};
  f=f.some(x=>same(x,o))?f.filter(x=>!same(x,o)):[o,...f];LY.set('mot_favs',f);favState();
};
function renderFavs(){
  const f=favs();$('fcount').textContent=f.length?'('+f.length+')':'';
  $('flist').innerHTML=f.length?f.map((x,i)=>`<div class="fi"><p>${LY.esc(x.t)}${x.a?`<small>— ${LY.esc(x.a)}</small>`:''}</p><button data-i="${i}" aria-label="Remove">✕</button></div>`).join(''):'<p class="fempty">Tap ♡ Save on anything you want to keep close.</p>';
  $('flist').querySelectorAll('button').forEach(b=>b.onclick=()=>{const g=favs();g.splice(+b.dataset.i,1);LY.set('mot_favs',g);favState()});
}
addEventListener('resize',()=>{clearTimeout(window.__mr);window.__mr=setTimeout(fit,120)});
lyBackupBar($('backup'),()=>favState());
setMode(mode,true);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
})();
