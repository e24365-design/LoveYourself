(()=>{
const MOODS={happy:['Happy','#d97373'],excited:['Excited','#f3b844'],soso:['So so','#a4b97c'],sad:['Sad','#a9a8d4'],depressed:['Depressed','#b79678'],angry:['Angry','#dc675b']};
const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MS=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct',null,'dec'];
const K='mood'; let data=LY.get(K,{}); const T=new Date();
let vy=T.getFullYear(),vm=T.getMonth(),sel=T.getDate(),brush=null;
const $=id=>document.getElementById(id), key=(y,m,d)=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const dim=(y,m)=>new Date(y,m+1,0).getDate();
const F={happy:'<path d="M16 31q4-4 8 0M36 31q4-4 8 0M25 40q5 5 10 0"/>',
 excited:'<circle cx="20" cy="31" r="2" fill="#2b1a1e"/><circle cx="40" cy="31" r="2" fill="#2b1a1e"/><path d="M24 38q6 9 12 0z" fill="#fff"/>',
 soso:'<path d="M16 31h8M36 31h8M25 41h10"/>',
 sad:'<circle cx="20" cy="32" r="2" fill="#2b1a1e"/><circle cx="40" cy="32" r="2" fill="#2b1a1e"/><path d="M25 43q5-5 10 0"/>',
 depressed:'<path d="M15 30l9 3M45 30l-9 3M25 44q5-6 10 0"/>',
 angry:'<path d="M15 28l9 4M45 28l-9 4M23 40h14l-2 5h-3l-1-3-1 3h-3z" fill="#fff"/>'};
const cat=(m,d)=>{const c=m?MOODS[m][1]:'#fff',tall=d%3!==0;
 return `<svg viewBox="0 0 60 64"><path d="M5 62V${tall?24:30}L10 ${tall?6:12}l11 11h18L50 ${tall?6:12}l5 ${tall?18:18}V62z" fill="${c}" stroke="#2b1a1e" stroke-width="2.6" stroke-linejoin="round"/><g fill="none" stroke="#2b1a1e" stroke-width="2" stroke-linecap="round">${m?F[m]:''}</g></svg>`};
function render(){
 const n=dim(vy,vm); $('year').textContent=vy;
 const f=MS[vm]; $('msticker').innerHTML=f?`<img class="msticker" src="ly_m_${f}.png" alt="${MN[vm]}" onerror="this.outerHTML='<div class=mfall>${MN[vm].toUpperCase()}</div>'">`:`<div class="novw"><img class="msticker" src="ly_m_nov.png" alt="November"><span>November</span></div>`;
 const per=Math.ceil(n/4); let h='',d=1;
 for(let r=0;r<4&&d<=n;r++){h+='<div class="shelf">';for(let i=0;i<per&&d<=n;i++,d++){
  const e=data[key(vy,vm,d)],isT=vy===T.getFullYear()&&vm===T.getMonth()&&d===T.getDate();
  h+=`<button class="day${d===sel?' sel':''}${isT?' today':''}" data-d="${d}" aria-label="${MN[vm]} ${d}">${cat(e&&e.m,d)}<b>${d}</b></button>`}h+='</div>'}
 $('shelves').innerHTML=h;
 document.querySelectorAll('.day').forEach(b=>b.onclick=()=>{sel=+b.dataset.d;const e=data[key(vy,vm,sel)];brush=e?e.m:null;$('note').value=e?e.n||'':'';render()});
 $('selbar').textContent=`${MN[vm]} ${sel}, ${vy}`+(data[key(vy,vm,sel)]?' · '+MOODS[data[key(vy,vm,sel)].m][0]:'');
 $('legend').innerHTML=Object.entries(MOODS).map(([k,[l,c]])=>`<button class="lg${brush===k?' on':''}" data-m="${k}"><i style="background:${c}"></i><svg viewBox="12 24 36 24" fill="none" stroke="#2b1a1e" stroke-width="2.4" stroke-linecap="round">${F[k]}</svg>${l}</button>`).join('');
 document.querySelectorAll('.lg').forEach(b=>b.onclick=()=>{brush=b.dataset.m;render()});
 const tl={},mk=Object.keys(data).filter(k=>k.startsWith(`${vy}-${String(vm+1).padStart(2,'0')}`));
 mk.forEach(k=>tl[data[k].m]=(tl[data[k].m]||0)+1);
 $('tally').innerHTML=mk.length?Object.entries(tl).sort((a,b)=>b[1]-a[1]).map(([m,c])=>`<span class="pill" style="border-color:${MOODS[m][1]};margin:.2rem">${MOODS[m][0]} × ${c}</span>`).join(''):'<p class="empty">nothing saved for this month yet</p>';
 history()}
function history(){
 const g={};Object.keys(data).forEach(k=>{const [y,m]=k.split('-');(g[y+'-'+m]=g[y+'-'+m]||[]).push(k)});
 const ks=Object.keys(g).sort().reverse();
 $('hist').innerHTML=ks.length?ks.map(k=>{const [y,m]=k.split('-');return `<div class="hm" data-y="${y}" data-m="${+m-1}"><b>${MN[+m-1]} ${y}</b><div class="dots">${g[k].sort().map(x=>`<s style="background:${MOODS[data[x].m][1]}"></s>`).join('')}</div><small>${g[k].length} day${g[k].length>1?'s':''}</small></div>`}).join(''):'<p class="empty" style="grid-column:1/-1">your history will appear here ♥</p>';
 document.querySelectorAll('.hm').forEach(b=>b.onclick=()=>{vy=+b.dataset.y;vm=+b.dataset.m;sel=1;brush=null;render();scrollTo({top:0,behavior:'smooth'})})}
function flash(t){$('msg').textContent=t;setTimeout(()=>$('msg').textContent='',2500)}
$('save').onclick=()=>{if(!brush)return flash('pick a mood first 🌸');
 data[key(vy,vm,sel)]={m:brush,n:$('note').value.trim(),t:LY.stamp().iso};if(LY.set(K,data))flash('Saved forever ✓');else flash('Could not save (private browsing?)');render()};
$('clear').onclick=()=>{delete data[key(vy,vm,sel)];brush=null;$('note').value='';LY.set(K,data);render()};
const mv=x=>{vm+=x;if(vm<0){vm=11;vy--}if(vm>11){vm=0;vy++}sel=1;brush=null;$('note').value='';render()};
$('prev').onclick=()=>mv(-1);$('next').onclick=()=>mv(1);
$('now').onclick=()=>{vy=T.getFullYear();vm=T.getMonth();sel=T.getDate();brush=null;render()};
lyBackupBar($('backup'),()=>{data=LY.get(K,{});render()});
const e0=data[key(vy,vm,sel)];if(e0){brush=e0.m;$('note').value=e0.n||''}
render();
})();
