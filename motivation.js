(()=>{
const $=id=>document.getElementById(id),Q=LYQUOTES,B=LYBG,esc=LY.esc;
const AFF=["I am doing the best I can, and that is enough.","I am allowed to rest without earning it.","My feelings are valid, and they will pass.","I am learning, and learning takes time.","I deserve kindness, especially from myself.","Small steps still move me forward.","I am proud of how far I have come.","I can do hard things, one gentle step at a time.","It is okay to ask for help.","I am more than my worst days.","My worth is not measured by my marks.","I choose progress over perfection.","I am safe in this moment.","Mistakes are proof that I am trying.","I am allowed to take up space.","I can start again whenever I need to.","My best looks different every day, and that is okay.","I am growing at my own pace.","I am worthy of love, just as I am.","Today I will be as gentle with myself as I am with others.","I trust that things are working out, even slowly.","I have survived every hard day so far.","I am becoming someone I will be proud of.","My dreams are valid, and I am working towards them.","I let go of what I cannot control.","I am calm, I am capable, I am enough.","Good things are coming my way.","I am allowed to change my mind.","I celebrate my little wins.","I am loved more than I know."];
const GR=[['#ffe3e8','#fff1d6'],['#e9d8f5','#ffe3e8'],['#d9ecff','#f3e1ff'],['#ffe0cc','#ffd1da'],['#d8f0e2','#fff4d4'],['#ffd6e6','#e6ddff']];
/* deck: never repeats until every quote has been shown */
let deck=LY.get('qdeck',null);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function nextIdx(){if(!deck||deck.i>=deck.o.length||deck.o.length!==Q.length)deck={o:shuffle([...Q.keys()]),i:0};const v=deck.o[deck.i++];LY.set('qdeck',deck);return v}
let cur=-1,bgI=LY.get('qbg',-1),hist=[],favs=LY.get('favq',[]),tmr=300;
function fit(){const c=$('qcard'),t=$('qtext'),W=c.clientWidth;let fs=W*.075;t.style.fontSize=fs+'px';const p=$('q');
 for(let i=0;i<40&&t.scrollHeight>t.clientHeight+1&&fs>W*.032;i++){fs-=W*.002;t.style.fontSize=fs+'px'}}
function show(idx,newBg=true){const t=$('qtext');t.classList.add('out');
 setTimeout(()=>{cur=idx;if(newBg){bgI=(bgI+1)%B.length;LY.set('qbg',bgI)}const b=B[bgI],[x0,y0,x1,y1]=b.r,c=$('qcard');
  c.style.setProperty('--ar',b.ar);c.style.backgroundImage=`url(${b.f})`;
  Object.assign(t.style,{left:x0*100+'%',top:y0*100+'%',width:(x1-x0)*100+'%',height:(y1-y0)*100+'%'});
  $('q').textContent='“'+Q[idx].q+'”';$('qa').textContent=Q[idx].a;fit();t.classList.remove('out');
  $('fav').textContent=favs.includes(idx)?'♥ Saved':'♡ Save';$('fav').classList.toggle('on',favs.includes(idx));tmr=300},newBg?250:0)}
function go(){const i=nextIdx();if(cur>=0)hist.push(cur);show(i)}
$('next').onclick=go;
$('prev').onclick=()=>{if(hist.length)show(hist.pop())};
$('fav').onclick=()=>{const k=favs.indexOf(cur);if(k>=0)favs.splice(k,1);else favs.unshift(cur);LY.set('favq',favs);$('fav').textContent=favs.includes(cur)?'♥ Saved':'♡ Save';$('fav').classList.toggle('on',favs.includes(cur));drawFavs()};
$('copy').onclick=async()=>{const s=`“${Q[cur].q}” — ${Q[cur].a}`;try{await navigator.clipboard.writeText(s);$('copy').textContent='✓ Copied'}catch(e){$('copy').textContent='Select & copy'}setTimeout(()=>$('copy').textContent='⧉ Copy',1800)};
function drawFavs(){$('favs').innerHTML=favs.length?favs.map(i=>`<div class="fq"><div><p>“${esc(Q[i].q)}”</p><small>— ${esc(Q[i].a)}</small></div><button data-i="${i}" aria-label="remove">✕</button></div>`).join(''):'<p class="empty sub">tap ♡ Save to keep the ones that hit home</p>';
 document.querySelectorAll('#favs button').forEach(b=>b.onclick=()=>{favs=favs.filter(x=>x!==+b.dataset.i);LY.set('favq',favs);drawFavs();$('fav').textContent=favs.includes(cur)?'♥ Saved':'♡ Save'})}
/* auto refresh every 5 minutes */
setInterval(()=>{tmr--;if(tmr<=0){go();return}$('timer').textContent=`next quote in ${Math.floor(tmr/60)}:${String(tmr%60).padStart(2,'0')}`},1000);
window.addEventListener('resize',fit);
/* Remind You */
let mine=LY.get('myaff',[]),ai=-1,ad=shuffle([...AFF.keys()]),ap=0;
function aff(){const all=[...AFF,...mine];let t;if(mine.length&&Math.random()<.3)t=mine[Math.floor(Math.random()*mine.length)];else{t=AFF[ad[ap++%ad.length]]}
 const g=GR[Math.floor(Math.random()*GR.length)],e=$('aff');e.style.setProperty('--g1',g[0]);e.style.setProperty('--g2',g[1]);e.textContent=t}
$('anext').onclick=aff;$('aff').onclick=aff;
function drawMine(){$('mine').innerHTML=mine.map((m,i)=>`<div class="mine"><span>${esc(m)}</span><button data-i="${i}" aria-label="remove">✕</button></div>`).join('');
 document.querySelectorAll('#mine button').forEach(b=>b.onclick=()=>{mine.splice(+b.dataset.i,1);LY.set('myaff',mine);drawMine()})}
$('aadd').onclick=()=>{const t=prompt('Write something kind to tell yourself:');if(t&&t.trim()){mine.unshift(t.trim());LY.set('myaff',mine);drawMine();aff()}};
lyBackupBar($('backup'),()=>{favs=LY.get('favq',[]);mine=LY.get('myaff',[]);drawFavs();drawMine()});
drawFavs();drawMine();aff();show(nextIdx());
})();
