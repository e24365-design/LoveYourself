(()=>{
const $=id=>document.getElementById(id),esc=LY.esc;
const hr=new Date().getHours(); const st={scene:'room',mode:(hr>=6&&hr<18)?'day':'night',cosy:false,weather:'clear'};
const WE=['clear','rain','sunset','snow'],WN={clear:'clear sky',rain:'rainy',sunset:'sunset',snow:'snowy'};
const SKY={day:{clear:['#9fd8ff','#e6f6ff'],rain:['#9aa9bb','#cdd6e0'],sunset:['#ff9f80','#ffd9a0'],snow:['#cfdbe8','#f0f5fa']},
 night:{clear:['#1b1f5c','#6a4a9a'],rain:['#222a45','#3d4668'],sunset:['#4a2a6a','#e08a9c'],snow:['#26335a','#55648c']}};
const SC=[['room','🏠 Room'],['mountain','⛰ Mountain'],['forest','🌲 Forest'],['beach','🏖 Beach']];
const PAL=['#a8324a','#d97a8e','#7a1f33','#e8b4a0','#5b7f95','#8aa17b','#c9a14a','#6b4c7a','#e07a5f','#3d5a80'];
function toast(t){$('toast').textContent=t;clearTimeout(toast.t);toast.t=setTimeout(()=>$('toast').textContent='',3500)}
/* ---------- books ---------- */
const SEED=[['Shatter Me series','Tahereh Mafi'],['Twisted series','Ana Huang'],['Enchantra duology',''],['Harry Potter series','J.K. Rowling'],['Percy Jackson','Rick Riordan'],['The Chemist','Stephenie Meyer'],['Maze Runner','James Dashner'],['Powerless series','Lauren Roberts'],['Twilight series','Stephenie Meyer']];
function books(){let b=LY.get('books',null);if(!b){b=SEED.map(([t,a])=>({t,a,s:'finished',r:0,q:''}));LY.set('books',b)}return b}
/* ---------- audio ---------- */
let ac,buf,nodes=[],soundOn=false;
function stopSound(){nodes.forEach(n=>{try{n.stop&&n.stop();n.disconnect()}catch(e){}});nodes=[]}
function startSound(){stopSound();if(!soundOn||st.scene!=='room')return;
 if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();buf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 if(ac.state==='suspended')ac.resume();
 const s=ac.createBufferSource();s.buffer=buf;s.loop=true;const g=ac.createGain(),f=ac.createBiquadFilter();
 if(st.weather==='rain'){f.type='bandpass';f.frequency.value=1800;f.Q.value=.5;g.gain.value=.2}else{f.type='lowpass';f.frequency.value=240;g.gain.value=.3}
 s.connect(f);f.connect(g);g.connect(ac.destination);s.start();nodes=[s,f,g];
 if(st.weather!=='rain'){const o=ac.createOscillator(),og=ac.createGain();o.frequency.value=110;og.gain.value=.012;o.connect(og);og.connect(ac.destination);o.start();nodes.push(o,og)}}
/* ---------- room svg ---------- */
function room(){
 const n=st.mode==='night',w=st.weather,[c1,c2]=SKY[st.mode][w],bk=books().slice(0,24);
 const wall=n?'#4a3552':'#fbeee6',floor=n?'#6b4a45':'#e4c3a0',dark={day:[0,.26],night:[.2,.46]}[st.mode][st.cosy?1:0];
 let sky=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
 <radialGradient id="glow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".95"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
 <clipPath id="win"><path d="M120 300V160a80 80 0 0 1 160 0V300z"/></clipPath></defs>`;
 let out=`<g clip-path="url(#win)"><rect x="120" y="70" width="160" height="240" fill="url(#sky)"/>`;
 if(w==='clear'&&!n)out+=`<circle cx="236" cy="132" r="34" fill="#fff3b0" opacity=".5"/><circle cx="236" cy="132" r="20" fill="#ffd966"/>`;
 if(w==='sunset')out+=`<circle cx="200" cy="262" r="${n?18:30}" fill="${n?'#f7c6d0':'#ff9a5c'}" opacity=".95"/>`;
 if(n&&w!=='rain'&&w!=='snow')out+=`<circle cx="238" cy="125" r="16" fill="#fffbe6"/><circle cx="244" cy="120" r="14" fill="${c1}"/>`+[[150,110],[175,150],[215,100],[255,160],[140,200],[190,180],[262,105]].map(([x,y],i)=>`<path class="spark" style="animation-delay:${i*.4}s" d="M${x} ${y-5}l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#fff6c8"/>`).join('');
 if(w==='rain'||w==='snow'||(w==='clear'&&!n))out+=`<g class="cloud" fill="${w==='rain'?(n?'#4a5578':'#8996a8'):(n?'#6a6a9a':'#fff')}" opacity=".95"><ellipse cx="160" cy="125" rx="26" ry="11"/><ellipse cx="178" cy="118" rx="18" ry="12"/><ellipse cx="236" cy="190" rx="28" ry="11"/><ellipse cx="252" cy="184" rx="16" ry="10"/></g>`;
 out+=`<path d="M120 275Q160 238 200 266T280 252V310H120z" fill="${n?'#2e2a4a':'#9ccf9a'}"/><path d="M120 292Q170 262 220 286T280 276V310H120z" fill="${n?'#241f3c':'#7fba85'}"/>`;
 if(w==='rain')out+=Array.from({length:14},(_,i)=>`<line class="drop" style="animation-delay:${(i*.13).toFixed(2)}s" x1="${126+i*10.5}" y1="70" x2="${123+i*10.5}" y2="84" stroke="#e8f3ff" stroke-width="1.6" opacity=".8"/>`).join('');
 if(w==='snow')out+=Array.from({length:16},(_,i)=>`<circle class="flake" style="animation-delay:${(i*.35).toFixed(2)}s" cx="${126+i*9.5}" cy="80" r="${2+(i%3)*.8}" fill="#fff"/>`).join('');
 out+=`</g><path d="M120 300V160a80 80 0 0 1 160 0V300z" fill="none" stroke="#fffaf5" stroke-width="9"/><path d="M200 80V300M120 195H280" stroke="#fffaf5" stroke-width="5"/><rect x="106" y="298" width="188" height="12" rx="5" fill="#fffaf5"/>`;
 const lights=[[16,40],[62,56],[110,62],[158,54],[206,46],[254,42],[302,40],[350,40],[386,38]].map(([x,y],i)=>`<circle class="bulb" cx="${x}" cy="${y}" r="4.5" fill="${['#ffd27a','#ffb3c1','#fff1b0'][i%3]}"/>`).join('');
 let shelf=`<rect x="12" y="108" width="98" height="226" rx="6" fill="#f3e6d8" stroke="#c9a98a" stroke-width="3"/>`;
 [[114,168],[174,228],[234,288]].forEach(([a,b],r)=>{shelf+=`<rect x="12" y="${b}" width="98" height="6" fill="#c9a98a"/>`;let x=18;for(let i=0;i<8&&r*8+i<bk.length;i++){const h=34+((r*8+i)*7)%18,wd=8+((r*8+i)*5)%6;if(x+wd>104)break;shelf+=`<rect x="${x}" y="${b-h}" width="${wd}" height="${h}" rx="1.5" fill="${PAL[(r*8+i)%PAL.length]}"/>`;x+=wd+2}});
 shelf+=`<rect x="12" y="294" width="98" height="40" rx="4" fill="#e9d5c0" stroke="#c9a98a" stroke-width="3"/><circle cx="61" cy="314" r="3" fill="#a07a58"/>`;
 const seat=`<rect x="124" y="356" width="152" height="72" rx="8" fill="#fff7ef" stroke="#e0c9b3" stroke-width="3"/><rect x="118" y="324" width="164" height="34" rx="12" fill="#e7a3b2"/><path d="M130 341h140" stroke="#fff" stroke-width="2" stroke-dasharray="3 6"/><rect x="132" y="300" width="40" height="38" rx="12" fill="#d97a8e" transform="rotate(-6 152 319)"/><rect x="228" y="302" width="40" height="36" rx="12" fill="#b8475c" transform="rotate(6 248 320)"/><rect x="176" y="308" width="46" height="30" rx="12" fill="#f7d9a8"/>`;
 const decor=`<g class="sway"><rect x="132" y="286" width="18" height="13" rx="3" fill="#c97b5a"/><path d="M141 286q-9-16-2-22M141 286q4-18 12-20M141 286q-1-20 3-26" stroke="#5d9a62" stroke-width="4" fill="none" stroke-linecap="round"/></g><rect x="242" y="286" width="16" height="13" rx="3" fill="#fff"/><path d="M258 289q7 1 0 8" stroke="#fff" stroke-width="2.5" fill="none"/><rect x="243" y="288" width="14" height="4" fill="#c58a5b"/><path class="steam" d="M246 282q-3-6 0-10M252 282q-3-6 0-10" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>`;
 const cab=`<rect x="286" y="374" width="108" height="70" rx="6" fill="#e9d5c0" stroke="#c9a98a" stroke-width="3"/><path d="M340 380v58" stroke="#c9a98a" stroke-width="2"/><circle cx="334" cy="410" r="2.5" fill="#a07a58"/><circle cx="346" cy="410" r="2.5" fill="#a07a58"/>`;
 const rec=`<g id="rec"${LY.get('song',null)?'':''}><rect x="294" y="346" width="64" height="28" rx="5" fill="#8a4b5a"/><g class="spin"><circle cx="316" cy="360" r="12" fill="#2b1a1e"/><circle cx="316" cy="360" r="4.5" fill="#f4ae3a"/><path d="M316 349v6" stroke="#6b5b5b" stroke-width="1.5"/></g><path d="M346 350l-12 10" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="346" cy="350" r="3" fill="#fff"/></g>`;
 const lamp=`<rect x="365" y="238" width="4" height="136" fill="#c9a98a"/><ellipse cx="367" cy="374" rx="12" ry="4" fill="#c9a98a"/><path d="M346 238l8-42h26l8 42z" fill="${st.cosy?'#ffd98c':'#ffe9b8'}" stroke="#e0b46a" stroke-width="2"/>`;
 const rug=`<ellipse cx="200" cy="474" rx="118" ry="20" fill="#d98e9a" opacity=".75"/><ellipse cx="200" cy="474" rx="96" ry="14" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 6"/><g><ellipse cx="236" cy="470" rx="24" ry="11" fill="#f3e2cf"/><circle cx="212" cy="466" r="10" fill="#f3e2cf"/><path d="M205 459l3-8 5 6M214 457l4-7 3 8" fill="#f3e2cf"/><path d="M212 466q2 2 4 0" stroke="#7a5a4a" stroke-width="1.3" fill="none"/><path d="M258 470q10-2 8-12" stroke="#f3e2cf" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
 const hot=(id,x,y,wd,h,l)=>`<g class="hot" id="${id}" tabindex="0" role="button" aria-label="${l}"><rect x="${x}" y="${y}" width="${wd}" height="${h}" rx="12" fill="transparent"/><rect class="tapme" x="${x-2}" y="${y-2}" width="${wd+4}" height="${h+4}" rx="14"/></g>`;
 const motes=[[90,200],[300,150],[180,350],[150,130]].map(([x,y],i)=>`<circle class="spark" style="animation-delay:${i*.7}s" cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join('');
 return `<svg id="room" class="${LY.get('song',null)&&st.playing?'playing':''}" viewBox="0 0 400 500" role="img" aria-label="cosy room">${sky}<rect width="400" height="500" fill="${wall}"/><rect y="440" width="400" height="60" fill="${floor}"/><path d="M0 30Q100 66 200 44T400 34" stroke="${n?'#d9c0a0':'#c9a98a'}" stroke-width="2" fill="none"/>${out}${shelf}${seat}${decor}${cab}${rec}${lamp}${rug}${lights}
 <rect width="400" height="500" fill="#2a1030" opacity="${dark}" pointer-events="none"/><circle cx="367" cy="230" r="${st.cosy?120:50}" fill="url(#glow)" opacity="${st.cosy?1:.35}" pointer-events="none"/>${motes}
 ${hot('hWin',112,70,176,238,'window: change the weather')}${hot('hBook',10,106,102,230,'bookshelf: my books')}${hot('hRec',292,344,70,32,'record player: my song')}${hot('hLamp',342,190,50,54,'lamp: bright or cosy')}</svg>`}
/* ---------- modal ---------- */
function modal(h){$('mbody').innerHTML=h;$('modal').hidden=false}
function closeM(){$('modal').hidden=true;$('mbody').innerHTML=''}
$('mx').onclick=closeM;$('modal').onclick=e=>{if(e.target.id==='modal')closeM()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeM()});
const ST={reading:'📖 Reading',finished:'✅ Finished',want:'🌱 Want to read'};
function openBooks(){const b=books();let sel=0;
 const draw=()=>{modal(`<h2>My Books</h2><p class="sub" style="margin:0 0 .4rem">${b.length} on your shelf</p>`+
 b.map((x,i)=>`<div class="bk" style="border-color:${PAL[i%PAL.length]}"><div><b>${esc(x.t)}</b><small>${esc(x.a||'author?')}</small><span class="badge">${ST[x.s]}</span> <span>${'♥'.repeat(x.r)}${'♡'.repeat(5-x.r)}</span>${x.q?`<q>“${esc(x.q)}”</q>`:''}</div><div><button class="pill" data-e="${i}" style="padding:.15rem .6rem">edit</button></div></div>`).join('')+
 `<div class="frm" id="f"><b>${'Add or edit a book'}</b><input id="bt" placeholder="Title"><input id="ba" placeholder="Author"><select id="bs"><option value="reading">📖 Reading</option><option value="finished">✅ Finished</option><option value="want">🌱 Want to read</option></select><div class="hearts" id="bh">${[1,2,3,4,5].map(n=>`<button data-h="${n}" class="">♥</button>`).join('')}</div><textarea id="bq" rows="2" placeholder="A favourite quote (optional)"></textarea><div class="row"><button class="pill" id="bsave">Save book 💗</button><button class="pill" id="bdel" hidden>Remove</button></div></div>`);
 let ed=-1,rate=0;const paint=()=>document.querySelectorAll('#bh button').forEach(x=>x.classList.toggle('on',+x.dataset.h<=rate));
 document.querySelectorAll('#bh button').forEach(x=>x.onclick=()=>{rate=+x.dataset.h===rate?0:+x.dataset.h;paint()});
 document.querySelectorAll('[data-e]').forEach(x=>x.onclick=()=>{ed=+x.dataset.e;const k=b[ed];$('bt').value=k.t;$('ba').value=k.a;$('bs').value=k.s;$('bq').value=k.q;rate=k.r;paint();$('bdel').hidden=false;$('f').scrollIntoView({behavior:'smooth'})});
 $('bsave').onclick=()=>{const t=$('bt').value.trim();if(!t)return;const o={t,a:$('ba').value.trim(),s:$('bs').value,r:rate,q:$('bq').value.trim()};if(ed>=0)b[ed]=o;else b.push(o);LY.set('books',b);draw();render()};
 $('bdel').onclick=()=>{if(ed>=0&&confirm('Remove this book?')){b.splice(ed,1);LY.set('books',b);draw();render()}}};draw()}
let yt=null;
const ytId=u=>{const m=String(u).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);return m&&m[1]};
function playSong(){const s=LY.get('song',null);if(!s)return;const id=ytId(s.url);if(!id)return toast('That link doesn’t look like a YouTube link');stopYT();yt=document.createElement('iframe');yt.className='yt';yt.allow='autoplay';yt.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&loop=1&playlist=${id}`;document.body.appendChild(yt);st.playing=true;render();toast('♪ '+(s.title||'your song'))}
function stopYT(){if(yt){yt.remove();yt=null}st.playing=false}
function openSong(){const s=LY.get('song',{title:'',url:''});
 modal(`<h2>My Song</h2><div class="rec"><span style="font-size:3rem">💿</span></div><div class="frm"><input id="sn" placeholder="Song name" value="${esc(s.title)}"><input id="su" placeholder="Paste the YouTube link" value="${esc(s.url)}"><div class="row"><button class="pill" id="sp">▶ Play</button><button class="pill" id="ss">Stop</button><button class="pill" id="sv">Save</button></div><small style="opacity:.7;text-align:center">Your link is saved on this device only. The song plays from YouTube.</small></div>`);
 $('sv').onclick=()=>{LY.set('song',{title:$('sn').value.trim(),url:$('su').value.trim()});toast('Song saved 💗');closeM();render()};
 $('sp').onclick=()=>{LY.set('song',{title:$('sn').value.trim(),url:$('su').value.trim()});closeM();playSong()};
 $('ss').onclick=()=>{stopYT();closeM();render()}}
/* ---------- wiring ---------- */
function bind(){const a=(id,f)=>{const e=$(id);if(!e)return;e.onclick=f;e.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();f()}}};
 a('hLamp',()=>{st.cosy=!st.cosy;render();toast(st.cosy?'Cosy mode 🕯️':'Bright mode ☀️')});
 a('hWin',()=>{st.weather=WE[(WE.indexOf(st.weather)+1)%4];render();startSound();toast('Outside: '+WN[st.weather])});
 a('hBook',openBooks);a('hRec',()=>{if(LY.get('song',null)&&st.playing){stopYT();render();toast('Paused');return}if(LY.get('song',null)&&ytId(LY.get('song').url))playSong();else openSong()});
 const r=$('hRec');if(r)r.addEventListener('contextmenu',e=>{e.preventDefault();openSong()})}
function render(){const stg=$('stage');
 document.querySelectorAll('#scenes .pill').forEach(b=>b.classList.toggle('on',b.dataset.s===st.scene));
 $('dn').textContent=st.mode==='day'?'☀️ Day':'🌙 Night';$('snd').textContent=soundOn?'🔊 sound on':'🔇 sound off';
 if(st.scene==='room'){stg.innerHTML=room();bind();$('hint').textContent='tap the lamp, window, bookshelf or record player'}
 else{stg.innerHTML=`<div class="soon">${SC.find(s=>s[0]===st.scene)[1]}<br><small style="font-style:normal;font-family:Quicksand">is still growing 🌿<br>for now, the cosy room is ready for you</small></div>`;$('hint').textContent='the room is ready · the other places are on their way'}}
$('scenes').innerHTML=SC.map(([k,l])=>`<button class="pill${k==='room'?'':' later'}" data-s="${k}">${l}${k==='room'?'':' <small>soon</small>'}</button>`).join('');
$('scenes').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;st.scene=b.dataset.s;render();startSound()};
$('dn').onclick=()=>{st.mode=st.mode==='day'?'night':'day';render()};
$('snd').onclick=()=>{soundOn=!soundOn;render();if(soundOn)startSound();else stopSound()};
lyBackupBar($('backup'),()=>render());
render();
})();
