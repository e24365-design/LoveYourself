(()=>{
const JARS={
 compliment:{t:'Compliment Jar',p:'a kind thing you heard today',img:'jar_stars',ph:'Someone said…',s:'every kind word'},
 achievement:{t:'Achievement Jar',p:'an academic achievement to be proud of',img:'jar_empty',ph:'I achieved…',s:'academic achievements'},
 loved:{t:'Loved Today Jar',p:'something you loved today',img:'jar_hearts',ph:'Today I loved…',s:'little joys'},
 books:{t:'Book Wins Jar',p:'a win from your books and studies',img:'jar_empty',ph:'I finished / understood / aced…',s:'study & book wins',books:1}};
const jarImg=(j,c)=>`<div class="ji"><img class="j${j.books?' tint':''}" src="assets/${j.img}.png" alt="">${j.books?'<img class="inbook" src="openbook.png" style="left:12%;transform:rotate(-8deg)" alt=""><img class="inbook" src="bookvase.png" style="left:46%;bottom:20%;width:30%" alt="">':''}</div>`;
const list=document.getElementById('list');
if(!list){ // hub
 const bk=document.getElementById('backup');lyBackupBar(bk,()=>location.reload());
 document.getElementById('jars').innerHTML=Object.entries(JARS).map(([id,j])=>{const n=LY.get('jar_'+id,[]).length;
  return `<a class="jarcard card" href="jar.html?j=${id}">${jarImg(j)}<h3>${j.t}</h3><small>${n} ${n===1?'win':'wins'} saved · ${j.s}</small></a>`}).join('');
}else{
 const id=new URLSearchParams(location.search).get('j'),j=JARS[id]||JARS.compliment,K='jar_'+(JARS[id]?id:'compliment');
 let items=LY.get(K,[]);const $=x=>document.getElementById(x);
 document.title=j.t+' · LoveYourself';$('head').innerHTML=jarImg(j);$('title').textContent=j.t;$('prompt').textContent='add '+j.p;$('txt').placeholder=j.ph;
 lyBackupBar($('backup'),()=>{items=LY.get(K,[]);draw()});
 const tick=()=>$('now').textContent='🕒 '+LY.stamp().text;tick();setInterval(tick,30000);
 function draw(){$('count').textContent=items.length?`${items.length} in your jar`:'';
  list.innerHTML=items.length?items.map((e,i)=>`<div class="entry"><div><p>${LY.esc(e.text)}</p><time>${LY.esc(e.when)}</time></div><button data-i="${i}" title="remove" aria-label="remove">✕</button></div>`).join(''):'<p class="empty">your jar is waiting for its first one 💗</p>';
  list.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(confirm('Remove this from the jar?')){items.splice(+b.dataset.i,1);LY.set(K,items);draw()}})}
 $('add').onclick=()=>{const t=$('txt').value.trim();if(!t)return;const s=LY.stamp();items.unshift({text:t,when:s.text,iso:s.iso});LY.set(K,items);$('txt').value='';draw()};
 draw();
}})();
