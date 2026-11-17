/* hero line: gentle affirmations (shared with the Remind You tab), shuffled, tap for another */
const lines=(typeof LY_AFFIRM!=='undefined'?LY_AFFIRM.slice():["You are doing better than you think."]);
for(let k=lines.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[lines[k],lines[j]]=[lines[j],lines[k]]}
const el=document.getElementById('affirm');let i=0;
el.textContent=lines[0];
el.addEventListener('click',next);
function next(){el.style.opacity=0;setTimeout(()=>{i=(i+1)%lines.length;el.textContent=lines[i];el.style.opacity=1},300)}
setInterval(next,7000);
/* "a thought for right now" teaser: a different quote on every visit, refreshes every 5 minutes */
(function(){
  if(typeof LY_QUOTES==='undefined')return;
  const q=document.getElementById('tq'),a=document.getElementById('ta'),box=document.getElementById('thought');
  function pick(){const k=LY_QUOTES.filter(x=>x[0].length<=140);const r=k[Math.floor(Math.random()*k.length)];
    box.style.opacity=0;setTimeout(()=>{q.textContent=r[0];a.textContent='— '+r[1];box.style.opacity=1},350)}
  pick();setInterval(pick,5*60*1000);
})();
