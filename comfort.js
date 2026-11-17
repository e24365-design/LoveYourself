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
let ct=null;function chirpOn(){clearTimeout(ct);const go=()=>{if(!soundOn||st.scene!=='forest')return;const night=st.mode==='night';try{const k=night?3:1+Math.floor(Math.random()*3);for(let i=0;i<k;i++){const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+i*(night?.09:.13),b=night?4300:2400+Math.random()*1400;o.type='sine';o.frequency.setValueAtTime(b,t);if(!night)o.frequency.exponentialRampToValueAtTime(b*1.35,t+.09);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(night?.012:.03,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.11);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.14)}}catch(e){}ct=setTimeout(go,night?900+Math.random()*1200:2500+Math.random()*5000)};ct=setTimeout(go,800)}
function stopSound(){clearTimeout(ct);nodes.forEach(n=>{try{n.stop&&n.stop();n.disconnect()}catch(e){}});nodes=[]}
function startSound(){stopSound();if(!soundOn||false)return;
 if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();buf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 if(ac.state==='suspended')ac.resume();
 const s=ac.createBufferSource();s.buffer=buf;s.loop=true;const g=ac.createGain(),f=ac.createBiquadFilter();
 if(st.scene==='forest'){f.type='bandpass';f.frequency.value=st.mode==='night'?900:2600;f.Q.value=.4;g.gain.value=.07;const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=.09;lg.gain.value=.05;l.connect(lg);lg.connect(g.gain);l.start();nodes.push(l,lg);chirpOn()}else if(st.scene==='beach'){f.type='lowpass';f.frequency.value=800;g.gain.value=.16;const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=.11;lg.gain.value=.15;l.connect(lg);lg.connect(g.gain);l.start();nodes.push(l,lg)}else if(st.scene==='mountain'){f.type='lowpass';f.frequency.value=520;g.gain.value=.2;const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=.13;lg.gain.value=.12;l.connect(lg);lg.connect(g.gain);l.start();nodes.push(l,lg)}else if(st.weather==='rain'){f.type='bandpass';f.frequency.value=1800;f.Q.value=.5;g.gain.value=.2}else{f.type='lowpass';f.frequency.value=240;g.gain.value=.3}
 s.connect(f);f.connect(g);g.connect(ac.destination);s.start();nodes=[s,f,g];
 if(st.scene==='room'&&st.weather!=='rain'){const o=ac.createOscillator(),og=ac.createGain();o.frequency.value=110;og.gain.value=.012;o.connect(og);og.connect(ac.destination);o.start();nodes.push(o,og)}}
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
 const rug=`<ellipse cx="200" cy="474" rx="118" ry="20" fill="#d98e9a" opacity=".75"/><ellipse cx="200" cy="474" rx="96" ry="14" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 6"/>`;
 const hot=(id,x,y,wd,h,l)=>`<g class="hot" id="${id}" tabindex="0" role="button" aria-label="${l}"><rect x="${x}" y="${y}" width="${wd}" height="${h}" rx="12" fill="transparent"/><rect class="tapme" x="${x-2}" y="${y-2}" width="${wd+4}" height="${h+4}" rx="14"/></g>`;
 const motes=[[90,200],[300,150],[180,350],[150,130]].map(([x,y],i)=>`<circle class="spark" style="animation-delay:${i*.7}s" cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join('');
 return `<svg id="room" class="${LY.get('song',null)&&st.playing?'playing':''}" viewBox="0 0 400 500" role="img" aria-label="cosy room">${sky}<rect width="400" height="500" fill="${wall}"/><rect y="440" width="400" height="60" fill="${floor}"/><path d="M0 30Q100 66 200 44T400 34" stroke="${n?'#d9c0a0':'#c9a98a'}" stroke-width="2" fill="none"/>${out}${shelf}${seat}${decor}${cab}${rec}${lamp}${rug}${catG()}${lights}
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

/* ---------- the cat ---------- */
const cat={x:236,y:462,dir:1,pose:'sleep',t:null};
const CF='#f3e2cf',CD='#7a5a4a';
function catSVG(){const f=cat.dir===1?'':'scale(-1,1)';
 if(cat.pose==='walk')return `<g transform="${f}"><path class="tailw" d="M20 -2Q36 -8 32 -24" stroke="${CF}" stroke-width="6" fill="none" stroke-linecap="round"/><g class="legA"><rect x="-16" y="4" width="5" height="12" rx="2.5" fill="#e6cfb4"/><rect x="8" y="4" width="5" height="12" rx="2.5" fill="#e6cfb4"/></g><g class="legB"><rect x="-8" y="4" width="5" height="12" rx="2.5" fill="${CF}"/><rect x="14" y="4" width="5" height="12" rx="2.5" fill="${CF}"/></g><ellipse rx="23" ry="10" fill="${CF}"/><ellipse cx="6" cy="-3" rx="9" ry="5" fill="#e8b98f" opacity=".7"/><circle cx="-25" cy="-7" r="9.5" fill="${CF}"/><path d="M-32-13l2-9 6 6M-24-15l5-8 3 9" fill="${CF}"/><circle cx="-29" cy="-8" r="1.4" fill="${CD}"/><circle cx="-22" cy="-8" r="1.4" fill="${CD}"/><path d="M-27-4q1.5 1.5 3 0" stroke="${CD}" stroke-width="1.2" fill="none"/></g>`;
 if(cat.pose==='sit')return `<g transform="${f}"><path class="tailw" d="M10 8Q28 10 26-8" stroke="${CF}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-2" rx="12" ry="16" fill="${CF}"/><ellipse cx="3" cy="-4" rx="6" ry="9" fill="#e8b98f" opacity=".6"/><circle cx="-2" cy="-24" r="10" fill="${CF}"/><path d="M-10-30l1-9 7 6M2-33l7-6 2 10" fill="${CF}"/><circle cx="-6" cy="-25" r="1.5" fill="${CD}"/><circle cx="2" cy="-25" r="1.5" fill="${CD}"/><path d="M-4-21q1.5 1.5 3 0" stroke="${CD}" stroke-width="1.2" fill="none"/><ellipse cx="-5" cy="12" rx="4" ry="3" fill="#e6cfb4"/><ellipse cx="4" cy="12" rx="4" ry="3" fill="#e6cfb4"/></g>`;
 return `<g transform="${f}"><path d="M22 4q14-2 10-14" stroke="${CF}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="6" rx="24" ry="11" fill="${CF}"/><ellipse cx="6" cy="3" rx="10" ry="5" fill="#e8b98f" opacity=".6"/><circle cx="-24" cy="4" r="10" fill="${CF}"/><path d="M-31-3l2-8 6 6M-23-5l4-7 4 8" fill="${CF}"/><path d="M-29 4q2 2 4 0M-22 4q2 2 4 0" stroke="${CD}" stroke-width="1.3" fill="none"/><text class="zz" x="-34" y="-12" font-size="9" fill="#fff" opacity=".8">z</text></g>`}
const catG=()=>`<g id="cat" class="hot" tabindex="0" role="button" aria-label="the cat" style="transform:translate(${cat.x}px,${cat.y}px)">${catSVG()}<rect x="-40" y="-36" width="80" height="60" fill="transparent"/></g>`;
function catSet(pose,x,dur){const g=$('cat');if(!g)return;cat.pose=pose;if(x!=null){cat.dir=x<cat.x?1:-1;cat.x=x}
 g.innerHTML=catSVG()+'<rect x="-40" y="-36" width="80" height="60" fill="transparent"/>';g.style.transition=dur?`transform ${dur}s linear`:'none';g.style.transform=`translate(${cat.x}px,${cat.y}px)`}
function catLoop(){clearTimeout(cat.t);if(st.scene!=='room')return;const pick=a=>a[Math.floor(Math.random()*a.length)];
 const act=Math.random();
 if(act<.55){const tx=96+Math.random()*250,dur=Math.max(1.5,Math.abs(tx-cat.x)/26);catSet('walk',tx,dur);cat.t=setTimeout(()=>{catSet(pick(['sit','sleep','sit']));cat.t=setTimeout(catLoop,4000+Math.random()*7000)},dur*1000)}
 else{catSet(pick(['sit','sleep']));cat.t=setTimeout(catLoop,3500+Math.random()*6000)}}
function petCat(){clearTimeout(cat.t);catSet('sit');toast(['meow~ 🐱💗','purrrr…','the cat likes you 💗','mrrp!'][Math.floor(Math.random()*4)]);cat.t=setTimeout(catLoop,4500)}
/* ---------- mountain + flower garden ---------- */
const FC=['#ff8fb1','#ffd95e','#b38cf0','#ffffff','#e8505b','#ffa45c'];
const fpos=i=>{const x=26+((i*97)%348),y=366+((i*53)%104);return{x,y,s:.55+(y-366)/104*.75}};
function garden(k){return LY.get('garden_'+(k||st.scene),[])}
const fposF=i=>{const l=i%2===0,j=Math.floor(i/2),x=l?20+((j*61)%118):262+((j*61)%118),y=376+((j*47)%96);return{x,y,s:.55+(y-376)/96*.7}};
function mountain(){const n=st.mode==='night';
 const sky=n?['#12154d','#5b3a8c','#f0a3b8']:['#78c0ff','#bfe5ff','#eaf8ff'];
 let o=`<defs><linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".6" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient></defs><rect width="400" height="500" fill="url(#msky)"/>`;
 if(n){o+=Array.from({length:26},(_,i)=>`<circle class="spark" style="animation-delay:${(i*.37%3).toFixed(2)}s" cx="${(i*83)%400}" cy="${20+(i*47)%210}" r="${1+(i%3)*.6}" fill="#fff6d8"/>`).join('')+`<circle cx="310" cy="96" r="22" fill="#fffbe8"/><circle cx="319" cy="89" r="19" fill="#2a2a70"/>`+`<ellipse cx="200" cy="330" rx="260" ry="80" fill="#ff9dc0" opacity=".28"/>`}
 else o+=`<circle cx="318" cy="92" r="44" fill="#fff6bf" opacity=".5"/><circle cx="318" cy="92" r="26" fill="#ffd966"/><g class="cloud" fill="#fff" opacity=".95"><ellipse cx="70" cy="90" rx="38" ry="14"/><ellipse cx="96" cy="80" rx="24" ry="14"/></g><g class="cloud" style="animation-duration:34s" fill="#fff" opacity=".9"><ellipse cx="220" cy="150" rx="34" ry="12"/><ellipse cx="240" cy="142" rx="20" ry="11"/></g><path class="bird" d="M60 60q6-8 12 0q6-8 12 0" stroke="#4a5a7a" stroke-width="2" fill="none"/><path class="bird b2" d="M110 46q5-6 10 0q5-6 10 0" stroke="#4a5a7a" stroke-width="2" fill="none"/>`;
 const m1=n?'#3b3b86':'#a9bde0',m2=n?'#2a2a6a':'#8aa3cf',cap=n?'#cfd2ff':'#ffffff';
 o+=`<path d="M-10 320L70 200l30 40 40-70 60 150z" fill="${m1}"/><path d="M-10 340L110 170l40 60 50-100 60 70 40-50 110 150v70H-10z" fill="${m2}"/><path d="M200 130l-24 44 18-8 12 16 12-14 16 10z" fill="${cap}"/><path d="M110 170l-18 32 14-6 10 12 10-14z" fill="${cap}"/><path d="M300 150l-16 30 12-5 8 10 10-10z" fill="${cap}"/>`;
 o+=`<path d="M0 335Q110 300 210 330T400 318V500H0z" fill="${n?'#31545a':'#9fd68a'}"/>`;
 [[22,330,1],[46,338,.8],[372,322,1.1],[350,334,.8],[8,345,.7]].forEach(([x,y,s])=>o+=`<g transform="translate(${x},${y}) scale(${s})"><path d="M0 0l-12 34h24z" fill="${n?'#1e4046':'#4d9a64'}"/><path d="M0 -16l-10 26h20z" fill="${n?'#25505a':'#5fb176'}"/></g>`);
 o+=`<path d="M0 392Q150 362 400 396V500H0z" fill="${n?'#264d4c':'#86c872'}"/>`;
 if(n)o+=Array.from({length:10},(_,i)=>`<circle class="spark" style="animation-delay:${(i*.5).toFixed(1)}s" cx="${30+(i*71)%340}" cy="${380+(i*37)%90}" r="2.2" fill="#ffe98a"/>`).join('');
 o+=flowersSVG('mountain',n);
 return `<svg id="room" viewBox="0 0 400 500" role="img" aria-label="mountain meadow">${o}</svg>`}
function drawGarden(){const el=$('garden');if(st.scene==='beach'){el.hidden=false;const c=got();el.innerHTML=`<h3 style="font-family:'Great Vibes',cursive;font-weight:400;color:var(--wine);font-size:2rem;text-align:center">Shell collection</h3><p class="sub" style="margin:0 0 .6rem">${c.length} of ${SHELLS.length} found</p><div class="shells">${SHELLS.map((_,i)=>`<span class="${c.includes(i)?'on':''}">${c.includes(i)?'🐚':'○'}</span>`).join('')}</div>`;return}if(st.scene!=='mountain'&&st.scene!=='forest'){el.hidden=true;return}el.hidden=false;const g=garden(),F=st.scene==='forest';
 el.innerHTML=`<h3 style="font-family:'Great Vibes',cursive;font-weight:400;color:var(--wine);font-size:2rem;text-align:center">${F?'Enchanted garden':'Flower garden'}</h3><p class="sub" style="margin:0 0 .6rem">write one good thing about today, and ${F?'a glowing flower blooms':'a flower blooms'}${g.length?` · ${g.length} so far 🌸`:''}</p><textarea class="note" id="gt" placeholder="Today something good was…"></textarea><div class="row"><button class="pill" id="gb">Plant a flower 🌸</button></div>`+(g.length?`<div style="margin-top:.8rem">${g.slice(-4).reverse().map(e=>`<div class="entry"><div><p>${esc(e.t)}</p><time>${esc(e.when)}</time></div></div>`).join('')}</div>`:'');
 $('gb').onclick=()=>{const t=$('gt').value.trim();if(!t)return toast('Write one good thing first 💗');const s=LY.stamp(),a=garden();a.push({t,when:s.text,iso:s.iso,k:Math.floor(Math.random()*6)});LY.set('garden_'+st.scene,a);render();toast(st.scene==='forest'?'A flower bloomed in the forest ✨':'A flower bloomed 🌸')};if(F)wishPanel(el)}
function bindGarden(){document.querySelectorAll('.fl').forEach(f=>{const sh=()=>{const e=garden()[+f.dataset.i];if(e)toast(`🌸 ${e.t} · ${e.when}`)};f.onclick=sh;f.onkeydown=ev=>{if(ev.key==='Enter')sh()}})}

function flowersSVG(sc,n){const all=garden(sc),gd=all.slice(-70),pf=sc==='forest'?fposF:fpos;let o='';const fl=gd.map((e,k)=>({e,i:all.length-gd.length+k})).map(({e,i})=>({...pf(i),k:e.k,i})).sort((a,b)=>a.y-b.y);
 fl.forEach(f=>{const c=FC[f.k%6];o+=`<g transform="translate(${f.x},${f.y}) scale(${f.s.toFixed(2)})">${n&&sc==='forest'?`<circle cx="0" cy="-30" r="15" fill="${c}" opacity=".35"/>`:''}<g class="sway fl" data-i="${f.i}" style="cursor:pointer" tabindex="0" role="button" aria-label="a good thing from your day"><path d="M0 0V-26" stroke="#4f9a5a" stroke-width="2.6"/><path d="M0-8q-9-1-10-9M0-13q9-1 10-9" stroke="#4f9a5a" stroke-width="2" fill="none"/>${[0,72,144,216,288].map(a=>`<circle cx="${(Math.cos(a*Math.PI/180)*6.5).toFixed(1)}" cy="${(-30+Math.sin(a*Math.PI/180)*6.5).toFixed(1)}" r="5" fill="${c}" stroke="${f.k%6===3?'#e6d5df':'none'}"/>`).join('')}<circle cx="0" cy="-30" r="3.6" fill="${f.k%6===1?'#d98e2b':'#ffd95e'}"/><circle cx="0" cy="-28" r="16" fill="transparent"/></g></g>`});
 return o}
/* ---------- enchanted forest ---------- */
const lit=()=>st.lit==null?st.mode==='night':st.lit;
const KIND=['You are allowed to rest here 🌿','Small steps still move you forward 💗','Breathe in the green, breathe out the noise','You are doing better than you think ✨','Nothing to fix right now. Just be.','The forest is glad you came 🍄'];
function forest(){const n=st.mode==='night',L=lit();let o='';
 o+=`<defs><linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${n?'#08152a':'#2a6a48'}"/><stop offset=".55" stop-color="${n?'#12405a':'#86c288'}"/><stop offset="1" stop-color="${n?'#2c6c78':'#e3f3c0'}"/></linearGradient>
 <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${n?'#bfe8ff':'#fffbd0'}" stop-opacity=".75"/><stop offset="1" stop-color="${n?'#bfe8ff':'#fffbd0'}" stop-opacity="0"/></linearGradient>
 <radialGradient id="fglow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".95"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
 <radialGradient id="hz"><stop offset="0" stop-color="${n?'#8ff0dc':'#fffbd8'}" stop-opacity="${n?.4:.85}"/><stop offset="1" stop-color="${n?'#8ff0dc':'#fffbd8'}" stop-opacity="0"/></radialGradient></defs><rect width="400" height="500" fill="url(#fsky)"/>`;
 o+=`<ellipse cx="200" cy="290" rx="130" ry="170" fill="url(#hz)"/>`;
 // far trees
 [[128,10],[160,8],[236,9],[262,11],[110,7],[290,8],[190,6],[216,6]].forEach(([x,w],i)=>o+=`<rect x="${x}" y="${150+i%3*14}" width="${w}" height="190" fill="${n?'#1a4458':'#6fa879'}" opacity=".5"/>`);
 // rays
 o+=`<g class="rays">`+[[250,0,34,360],[300,0,26,380],[200,0,22,330],[340,0,30,360],[150,0,18,300]].map(([x,y,w,h],i)=>`<polygon class="ray" style="animation-delay:${i*1.3}s" points="${x},${y} ${x+w},${y} ${x-70-i*14+w},${h+40} ${x-120-i*14},${h+40}" fill="url(#ray)"/>`).join('')+`</g>`;
 // mid trees
 [[96,20,60],[304,22,50],[150,14,110],[258,15,100]].forEach(([x,w,t],i)=>o+=`<path d="M${x} ${t}h${w}l${i%2?4:-4} 300h-${w+6}z" fill="${n?'#0f2a3a':'#3f7048'}" opacity="${i<2?.95:.8}"/>`);
 // mid foliage
 [[110,70,34],[320,86,30],[165,128,26],[250,120,26]].forEach(([x,y,r],i)=>o+=`<g class="sway" style="animation-delay:${i*.7}s"><circle cx="${x}" cy="${y}" r="${r}" fill="${n?'#14465a':'#58a068'}" opacity=".7"/><circle cx="${x+r*.7}" cy="${y+r*.3}" r="${r*.7}" fill="${n?'#1a5468':'#74b87a'}" opacity=".6"/></g>`);
 // ground + path
 o+=`<path d="M0 340Q100 322 200 332T400 326V500H0z" fill="${n?'#12384a':'#5fa060'}"/>`;
 o+=`<path d="M92 500Q170 440 190 372Q197 330 199 318L204 318Q208 332 216 372Q230 440 320 500z" fill="${n?'#2c6a70':'#cfeaa0'}"/><path d="M130 500Q180 450 196 392M270 500Q226 450 210 392" stroke="${n?'#3f8a8a':'#a8cf7a'}" stroke-width="3" fill="none" opacity=".6"/>`;
 // dappled light on path (day) / moon pool (night)
 o+=[[196,430,34,7],[206,380,18,4],[186,470,26,6]].map(([x,y,rx,ry],i)=>`<ellipse class="spark" style="animation-delay:${i*.9}s" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${n?'#c8f6ff':'#fffde0'}" opacity=".6"/>`).join('');
 // ferns
 const fern=(x,y,s,f)=>`<g transform="translate(${x},${y}) scale(${f?-s:s} ${s})"><g class="sway" fill="none" stroke="${n?'#2f8a74':'#3f9a56'}" stroke-width="3" stroke-linecap="round"><path d="M0 0Q-24-30-50-34"/><path d="M0 0Q-8-40-14-62"/><path d="M0 0Q22-30 46-30"/><path d="M0 0Q-30-12-58-8"/></g></g>`;
 o+=fern(118,462,1,false)+fern(290,456,.9,true)+fern(60,420,.8,false)+fern(348,420,.8,true);
 // mossy rock + mushrooms
 o+=`<path d="M262 452q4-30 36-34q34-2 46 34z" fill="${n?'#1d3e48':'#7a8f7a'}"/><path d="M264 446q8-22 34-24q28 0 40 22q-26-12-74 2z" fill="${n?'#2f7a64':'#6bb26f'}"/>`;
 const mush=(id,x,y,s,col,lab)=>`<g class="hot" id="${id}" tabindex="0" role="button" aria-label="${lab}" transform="translate(${x},${y}) scale(${s})"><g class="mi">${n?`<circle class="spark" cx="0" cy="-10" r="22" fill="${col}" opacity=".18"/>`:''}<rect x="-4" y="-12" width="8" height="14" rx="3" fill="#fff4e6"/><path d="M-16 -10a16 14 0 0 1 32 0z" fill="${col}"/><circle cx="-6" cy="-16" r="2.2" fill="#fff" opacity=".85"/><circle cx="5" cy="-14" r="1.8" fill="#fff" opacity=".85"/></g><rect x="-22" y="-26" width="44" height="34" fill="transparent"/></g>`;
 o+=mush('m1',316,424,1.3,n?'#7af0d8':'#e8505b','mushroom: a little chime')+mush('m2',92,474,1.1,n?'#ff9fe0':'#ff8fb1','mushroom: a little chime')+mush('m3',326,470,.8,n?'#a8b8ff':'#ffa45c','mushroom: a little chime');
 // wild glowing flowers (decor)
 o+=[[40,452],[58,468],[78,440],[104,456],[128,486],[272,478],[298,490],[330,452],[352,474],[366,440],[250,440],[150,470]].map(([x,y],i)=>{const c=['#ff8a3d','#ff6f61','#ffb347','#e9a0ff'][i%4],h=10+(i*7)%8;return `<g class="sway" style="animation-delay:${i*.4}s">${n?`<circle cx="${x}" cy="${y-h}" r="8" fill="${c}" opacity=".3"/>`:''}<path d="M${x} ${y}V${y-h}" stroke="#4f9a5a" stroke-width="1.6"/><circle cx="${x}" cy="${y-h}" r="3.6" fill="${c}"/><circle cx="${x}" cy="${y-h}" r="1.3" fill="#fff2b0"/></g>`}).join('');
 // flowers (user's garden)
 o+=flowersSVG('forest',n);
 // near trunks + canopy
 const tr=n?'#0b1d2a':'#3a4a30',tr2=n?'#13303f':'#55703c';
 o+=`<path d="M-10 0H58Q74 180 54 330Q44 420 78 500H-10z" fill="${tr}"/><path d="M14 0Q24 180 12 330Q8 420 24 500" stroke="${tr2}" stroke-width="5" fill="none" opacity=".6"/><path d="M42 40Q38 200 34 300" stroke="${tr2}" stroke-width="3" fill="none" opacity=".5"/>
 <path d="M408 0H350Q334 160 352 300Q362 420 330 500H408z" fill="${tr}"/><path d="M382 0Q372 160 384 300Q388 420 376 500" stroke="${tr2}" stroke-width="5" fill="none" opacity=".6"/>`;
 o+=`<path d="M52 150Q82 134 112 138" stroke="${tr}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M352 96Q326 84 300 92" stroke="${tr}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
 [[-8,10,56],[40,6,50],[96,-6,44],[160,-10,40],[220,-8,44],[280,-4,48],[340,8,54],[392,14,56],[70,40,34],[330,50,36],[18,58,30],[382,70,30]].forEach(([x,y,r],i)=>o+=`<g class="sway" style="animation-delay:${i*.5}s"><circle cx="${x}" cy="${y}" r="${r}" fill="${n?'#0e3a44':'#2f6e3e'}"/><circle cx="${x+r*.3}" cy="${y+r*.35}" r="${r*.7}" fill="${n?'#14505a':'#4d9a55'}" opacity=".8"/></g>`);
 // lanterns
 const lan=(id,x,y,lab)=>`<g class="hot" id="${id}" tabindex="0" role="button" aria-label="${lab}"><path d="M${x} ${y-22}V${y}" stroke="#c9a98a" stroke-width="1.6"/>${L?`<circle cx="${x}" cy="${y+12}" r="${n?46:30}" fill="url(#fglow)"/>`:''}<rect x="${x-9}" y="${y}" width="18" height="24" rx="6" fill="${L?'#ffe29a':'#d9c9a8'}" stroke="#a8825a" stroke-width="2.2"/><path d="M${x-6} ${y}v-4h12v4" fill="#a8825a"/><rect x="${x-24}" y="${y-24}" width="48" height="56" fill="transparent"/></g>`;
 o+=lan('l1',98,152,'lantern: light or dim')+lan('l2',304,96,'lantern: light or dim');
 // fairy lights along canopy
 o+=[[30,86],[70,96],[120,70],[170,52],[230,50],[280,64],[330,88],[372,100]].map(([x,y],i)=>`<circle class="bulb" cx="${x}" cy="${y}" r="3.6" fill="${['#ffd27a','#ffb3c1','#fff1b0'][i%3]}" opacity="${L?1:.35}"/>`).join('');
 // fog
 o+=`<g class="cloud" style="animation-duration:30s" fill="${n?'#9ad8e0':'#ffffff'}" opacity="${n?.07:.14}"><ellipse cx="120" cy="352" rx="110" ry="12"/><ellipse cx="150" cy="360" rx="150" ry="16"/><ellipse cx="260" cy="400" rx="130" ry="14"/><ellipse cx="270" cy="408" rx="90" ry="9"/></g>`;
 // motes / fireflies
 o+=Array.from({length:n?16:12},(_,i)=>`<circle class="mote" style="animation-delay:${(i*.9).toFixed(1)}s;animation-duration:${9+i%5*2}s" cx="${40+(i*67)%330}" cy="${150+(i*83)%300}" r="${n?2.4:1.8}" fill="${n?'#ffe98a':'#fffbd0'}"/>`).join('');
 // butterflies
 const bf=(cls,c1,c2,id)=>`<g class="bfly ${cls}"><g class="hot" id="${id}" tabindex="0" role="button" aria-label="a butterfly"><g class="flap"><ellipse cx="-5" cy="-2" rx="6" ry="8" fill="${c1}"/><ellipse cx="5" cy="-2" rx="6" ry="8" fill="${c1}"/><ellipse cx="-4" cy="5" rx="4" ry="5" fill="${c2}"/><ellipse cx="4" cy="5" rx="4" ry="5" fill="${c2}"/></g><rect x="-1" y="-6" width="2" height="14" rx="1" fill="#4a3a30"/><circle r="22" fill="transparent"/></g></g>`;
 o+=bf('b1',n?'#8ff0ff':'#ffb347',n?'#c6a8ff':'#ff7a59','bf1')+bf('b2',n?'#ffa8e8':'#ffe066',n?'#8ff0ff':'#ffb347','bf2');
 // fox (unlocked by flowers)
 if(garden('forest').length>=5)o+=`<g class="hot" id="fox" tabindex="0" role="button" aria-label="the fox" transform="translate(150,488) scale(1.15)"><path class="tailw" d="M-22 -4Q-46 -10 -42 -28Q-30 -22 -20 -12z" fill="#e8873a"/><path d="M-42 -28q4-6 9-2q-3 5-9 2z" fill="#fff"/><ellipse cx="0" cy="-8" rx="22" ry="11" fill="#e8873a"/><ellipse cx="6" cy="-4" rx="10" ry="5" fill="#fff2e0"/><rect x="-14" y="-2" width="5" height="10" rx="2.5" fill="#7a4a2a"/><rect x="10" y="-2" width="5" height="10" rx="2.5" fill="#7a4a2a"/><circle cx="22" cy="-18" r="10" fill="#e8873a"/><path d="M14 -25l-1-12 8 7zM26 -27l5-11 3 13z" fill="#e8873a"/><path d="M26 -14q6 0 8 4q-5 4-12 2z" fill="#fff2e0"/><circle cx="19" cy="-19" r="1.5" fill="#3a2a22"/><circle cx="32" cy="-12" r="1.6" fill="#3a2a22"/><rect x="-30" y="-40" width="70" height="52" fill="transparent"/></g>`;
 // wish stars (night)
 if(n)o+=LY.get('wishes',[]).slice(-24).map((w,i,a)=>{const x=86+((i*53)%228),y=12+((i*37)%104);return `<g class="hot wstar" data-w="${LY.get('wishes',[]).length-a.length+i}" tabindex="0" role="button" aria-label="a wish star"><path class="spark" style="animation-delay:${(i*.37%2).toFixed(2)}s" d="M${x} ${y-8}l2.4 5.2 5.6.8-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.6-.8z" fill="#ffe27a"/><circle cx="${x}" cy="${y}" r="14" fill="transparent"/></g>`}).join('');
 // portals
 const fnd=LY.get('portals',[]);
 o+=PORT.map((P,i)=>`<g class="hot" id="p${i}" tabindex="0" role="button" aria-label="a glowing spot"><circle class="spark" style="animation-delay:${i*.6}s" cx="${P.x}" cy="${P.y}" r="${fnd.includes(i)?5:3.4}" fill="${fnd.includes(i)?'#ffd1e8':'#fff6c8'}"/><circle cx="${P.x}" cy="${P.y}" r="${fnd.includes(i)?15:10}" fill="${fnd.includes(i)?'#ff9ad0':'#fff6c8'}" opacity=".22"/><circle cx="${P.x}" cy="${P.y}" r="17" fill="transparent"/></g>`).join('');
 // rabbit
 o+=`<g class="rab" id="rab" tabindex="0" role="button" aria-label="a rabbit"><g class="hop"><ellipse cx="0" cy="-8" rx="11" ry="7" fill="#f4ece4"/><circle cx="-10" cy="-13" r="6" fill="#f4ece4"/><path d="M-12-18q-3-14 0-16q4 3 3 15zM-7-18q0-14 4-14q2 4-1 15z" fill="#f4ece4"/><path d="M-11-20q-1-8 0-10" stroke="#ffb3c1" stroke-width="1.6" fill="none"/><circle cx="-12" cy="-14" r="1.3" fill="#3a2a22"/><circle cx="11" cy="-10" r="4" fill="#fff"/><ellipse cx="2" cy="-2" rx="5" ry="3" fill="#e6d8cc"/></g><circle cx="0" cy="-10" r="22" fill="transparent"/></g>`;
 // fairy
 o+=`<g id="fairy" pointer-events="none" transform="translate(${fp.x.toFixed(1)},${fp.y.toFixed(1)})"><circle r="22" fill="url(#fglow)"/><g class="flap"><ellipse cx="-6" cy="-3" rx="6" ry="9" fill="#fff" opacity=".75" transform="rotate(-25 -6 -3)"/><ellipse cx="6" cy="-3" rx="6" ry="9" fill="#ffd1f0" opacity=".75" transform="rotate(25 6 -3)"/></g><circle r="3.4" fill="#fffbe6"/></g>`;
 o+=`<rect width="400" height="500" fill="#06101c" opacity="${n?(L?.1:.28):0}" pointer-events="none"/>`;
 return `<svg id="room" viewBox="0 0 400 500" role="img" aria-label="enchanted forest">${o}</svg>`}
const PORT=[{x:74,y:236,n:'The Owl Post',s:'Harry Potter',e:'🦉✉️',t:'A tawny owl drops a letter, sealed with wax and addressed just to you: “You were always meant to find a place like this.”'},
 {x:330,y:214,n:'The Pine Tree',s:'Percy Jackson',e:'🌲⚡',t:'The old pine glows gold for a heartbeat. Somewhere a camp fire is lit, and there is always a bunk saved for you.'},
 {x:144,y:306,n:'The Silk Ribbon',s:'Shatter Me',e:'🎀💗',t:'A ribbon drifts down from the branches. Soft things can be strong things, and you are allowed to be both.'},
 {x:266,y:268,n:'The Moonlit Meadow',s:'Twilight',e:'🌕🌫️',t:'Mist curls over a quiet clearing and the moonlight sparkles on the grass. Nothing here is in a hurry.'},
 {x:42,y:372,n:'The Ivy Gate',s:'Maze Runner',e:'🌿🚪',t:'A gate opens in the ivy. Every maze has a way out, and you never have to run it alone.'}];
const fp={x:200,y:220,tx:200,ty:220,last:0,next:0,run:false};
const FAIRY=['I found a quiet spot, come rest here ✨','You have done enough for today 💗','Look up. The light is on your side.','Breathe slowly with me 🌿','You are my favourite human to follow ✨'];
function fairyLoop(){if(st.scene!=='forest'){fp.run=false;return}const g=$('fairy'),t=Date.now();
 if(g){if(t-fp.last>3500){fp.tx=200+Math.sin(t/2300)*120;fp.ty=230+Math.cos(t/1700)*70}
  fp.x+=(fp.tx-fp.x)*.06;fp.y+=(fp.ty-fp.y)*.06;g.setAttribute('transform',`translate(${fp.x.toFixed(1)},${(fp.y+Math.sin(t/260)*3).toFixed(1)})`);
  if(t>fp.next){if(fp.next)toast(FAIRY[Math.floor(Math.random()*FAIRY.length)]);fp.next=t+28000}}
 requestAnimationFrame(fairyLoop)}
let rabT=null;
function rabbitSoon(first){clearTimeout(rabT);rabT=setTimeout(()=>{if(st.scene!=='forest')return;const r=$('rab');if(r){r.dataset.got='';r.classList.remove('run');void r.getBoundingClientRect();r.classList.add('run')}rabbitSoon()},first?6000:18000+Math.random()*20000)}
function wishPanel(el){const w=LY.get('wishes',[]),pf=LY.get('portals',[]),cl=LY.get('clovers',0),nf=garden('forest').length;
 el.insertAdjacentHTML('beforeend',`<hr style="border:0;border-top:2px dashed var(--rose);margin:1rem 0"><h3 style="font-family:'Great Vibes',cursive;font-weight:400;color:var(--wine);font-size:2rem;text-align:center">Wish lantern</h3><p class="sub" style="margin:0 0 .6rem">write a wish and it floats away${w.length?` · ${w.length} shining as stars at night ✨`:' · it becomes a star at night ✨'}</p><textarea class="note" id="wt" placeholder="I wish…"></textarea><div class="row"><button class="pill" id="wb">Release lantern 🏮</button></div><p class="sub" style="margin:.8rem 0 0">✨ portals ${pf.length}/${PORT.length} · 🍀 clovers ${cl} · 🦊 ${nf>=5?'the fox is here':`plant ${5-nf} more flower${5-nf>1?'s':''} for a shy visitor`}</p>`);
 $('wb').onclick=()=>{const t=$('wt').value.trim();if(!t)return toast('Write a wish first 💗');const a=LY.get('wishes',[]);a.push({t,when:LY.stamp().text});LY.set('wishes',a);
  const sv=$('room');if(sv){sv.insertAdjacentHTML('beforeend',`<g class="wl"><rect x="-9" y="-12" width="18" height="24" rx="6" fill="#ffe29a" stroke="#a8825a" stroke-width="2"/><circle r="28" fill="url(#fglow)"/></g>`)}
  toast(st.mode==='night'?'Your wish floats up and becomes a star ✨':'Your wish floats up. It will shine as a star tonight ✨');setTimeout(()=>{if(st.scene==='forest')render()},4700)}}
const NOTES=[523.25,587.33,659.25,783.99,880];
function chime(i){try{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)()}if(ac.state==='suspended')ac.resume();
 [1,2].forEach(m=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=NOTES[i%5]*m;g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(m===1?.16:.04,ac.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+1.6);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+1.7)})}catch(e){}}
let mi=0;
function bindForest(){const a=(id,f)=>{const e=$(id);if(!e)return;e.onclick=f;e.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();f()}}};
 ['m1','m2','m3'].forEach(id=>a(id,()=>{chime(mi);toast(KIND[mi%KIND.length]);mi++;const e=$(id).querySelector('.mi');e.classList.remove('pop');void e.getBoundingClientRect();e.classList.add('pop')}));
 ['l1','l2'].forEach(id=>a(id,()=>{st.lit=!lit();render();toast(st.lit?'Lantern glowing 🏮':'Lanterns resting')}));
 ['bf1','bf2'].forEach(id=>a(id,()=>{chime(mi+2);mi++;toast(['A butterfly landed on your hand 🦋','It stayed a moment, just for you 🦋','Soft wings, soft day 🦋'][mi%3])}));
 PORT.forEach((P,i)=>a('p'+i,()=>{const f=LY.get('portals',[]);if(!f.includes(i)){f.push(i);LY.set('portals',f)}chime(i);render();modal(`<h2>${P.n}</h2><p class="sub" style="margin:0">${P.s}</p><div style="font-size:3.4rem;text-align:center;margin:.6rem">${P.e}</div><p style="text-align:center;line-height:1.5">${P.t}</p><p class="sub" style="margin:.6rem 0 0">✨ portals found: ${f.length}/${PORT.length}</p>`)}));
 a('fox',()=>{chime(mi);mi++;toast(['The fox leans into your hand 🦊💗','The fox curls its tail around you','A tiny happy fox sound 🦊'][mi%3])});
 a('rab',()=>{const r=$('rab');if(!r||r.dataset.got)return;r.dataset.got='1';const c=LY.get('clovers',0)+1;LY.set('clovers',c);chime(4);toast('The rabbit left you a clover 🍀 ('+c+')');drawGarden()});
 document.querySelectorAll('.wstar').forEach(e=>{const f=()=>{const w=LY.get('wishes',[])[+e.dataset.w];if(w)toast('✨ '+w.t+' · '+w.when)};e.onclick=f;e.onkeydown=ev=>{if(ev.key==='Enter')f()}});
 bindGarden();
 if(!fp.run){fp.run=true;fp.last=0;requestAnimationFrame(fairyLoop)}rabbitSoon(true)}

/* ---------- beach + shells ---------- */
const SHELLS=[[60,414],[132,448],[212,424],[292,458],[338,404],[172,484],[252,396],[98,474]],SCOL=['#ffb3c1','#fff4e6','#ffc08a','#e8c6ff'];
const got=()=>LY.get('shells',[]);
function beach(){const n=st.mode==='night',c=got();
 const sky=n?['#10124a','#4b3a8c','#f0a3b8']:['#6ec6ff','#ffd9a8','#ffe9c4'];
 let o=`<defs><linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".7" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient><linearGradient id="bsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${n?'#1b2a6b':'#46bfd8'}"/><stop offset="1" stop-color="${n?'#34508a':'#9aeadf'}"/></linearGradient></defs><rect width="400" height="500" fill="url(#bsky)"/>`;
 if(n)o+=Array.from({length:22},(_,i)=>`<circle class="spark" style="animation-delay:${(i*.41%3).toFixed(2)}s" cx="${(i*79)%400}" cy="${14+(i*43)%200}" r="${1+(i%3)*.6}" fill="#fff6d8"/>`).join('')+`<circle cx="300" cy="86" r="22" fill="#fffbe8"/><circle cx="309" cy="79" r="19" fill="#1d2060"/>`;
 else o+=`<circle cx="268" cy="214" r="52" fill="#fff0b0" opacity=".5"/><circle cx="268" cy="214" r="28" fill="#ffd25e"/><g class="cloud" fill="#fff" opacity=".9"><ellipse cx="90" cy="90" rx="36" ry="13"/><ellipse cx="114" cy="80" rx="22" ry="13"/></g><path class="bird" d="M40 60q6-8 12 0q6-8 12 0" stroke="#5a6a8a" stroke-width="2" fill="none"/><path class="bird b2" d="M90 44q5-6 10 0q5-6 10 0" stroke="#5a6a8a" stroke-width="2" fill="none"/>`;
 o+=`<rect y="248" width="400" height="130" fill="url(#bsea)"/>`;
 if(n)o+=`<g opacity=".7">${Array.from({length:9},(_,i)=>`<rect class="spark" style="animation-delay:${(i*.3).toFixed(1)}s" x="${296-i*2}" y="${256+i*10}" width="${16-i}" height="2.4" rx="1.2" fill="#fffbe8"/>`).join('')}</g>`;
 else o+=Array.from({length:18},(_,i)=>`<path class="spark" style="animation-delay:${(i*.27%3).toFixed(2)}s" d="M${(i*53)%380+10} ${256+(i*29)%100}l3 0M${(i*53)%380+10+1.5} ${255+(i*29)%100}l0 3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`).join('');
 o+=`<g class="boat"><g class="bob"><path d="M-22 0h44l-8 11h-28z" fill="${n?'#8a4b5a':'#d9576b'}"/><path d="M0 -2V-40" stroke="#6b4a3a" stroke-width="2.4"/><path d="M2 -38q18 18 18 34h-18z" fill="${n?'#d9d3ea':'#ffffff'}"/><path d="M-2 -32q-12 14-14 28h14z" fill="${n?'#b8a8d8':'#ffe0e6'}"/></g></g>`;
 o+=`<g class="fishj"><path d="M0 0q8-6 16 0q-8 6-16 0zM16 0l7-5v10z" fill="${n?'#bcd0ff':'#ff9a5c'}"/></g><g class="fishs" opacity=".55"><path d="M0 0q6-5 12 0q-6 5-12 0zM12 0l5-4v8z" fill="#ffffff"/></g>`;
 o+=`<g class="wave"><path d="M-60 352q20-10 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0V392H-60z" fill="${n?'#4a67a8':'#c8f2f0'}" opacity=".85"/></g><g class="wave w2"><path d="M-60 366q20-10 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0V406H-60z" fill="${n?'#6a86c4':'#e6fbf8'}" opacity=".9"/></g>`;
 o+=`<path d="M0 384Q100 366 200 380T400 372V500H0z" fill="${n?'#8a7a95':'#f6dca0'}"/><path d="M0 440Q150 420 400 446V500H0z" fill="${n?'#7a6a88':'#efcf8c'}"/>`;
 const palm=(x,y,s,fl)=>`<g transform="translate(${x},${y}) scale(${fl?-s:s} ${s})"><path d="M0 0Q-22-100 24-220" stroke="${n?'#5a3d4a':'#a8744a'}" stroke-width="13" fill="none" stroke-linecap="round"/><g class="sway" style="transform-origin:24px -220px"><g fill="${n?'#2c6a58':'#4fae6a'}"><path d="M24-220Q-30-262-66-214Q-14-236 24-220z"/><path d="M24-220Q-10-286-58-282Q-6-268 24-220z"/><path d="M24-220Q30-296 72-296Q40-272 24-220z"/><path d="M24-220Q84-262 112-222Q66-240 24-220z"/><path d="M24-220Q60-196 104-182Q62-196 24-220z" fill="${n?'#245a4c':'#3f9a5c'}"/><path d="M24-220Q-12-190-44-178Q-6-190 24-220z" fill="${n?'#245a4c':'#3f9a5c'}"/></g><circle cx="18" cy="-216" r="6.5" fill="#6b4226"/><circle cx="30" cy="-214" r="6.5" fill="#7b4c2e"/></g></g>`;
 o+=palm(66,486,.62,false)+palm(348,458,.44,true);
 SHELLS.forEach(([x,y],i)=>{if(c.includes(i))return;const col=SCOL[i%4];o+=`<g class="shell" data-i="${i}" transform="translate(${x},${y})" tabindex="0" role="button" aria-label="a shell" style="cursor:pointer"><path d="M0 0q-10-2-12-12q10-7 12-2q2-5 12 2q-2 10-12 12z" fill="${col}" stroke="#d98e9a" stroke-width="1"/><path d="M0 0l-6-10M0 0l0-12M0 0l6-10" stroke="#d98e9a" stroke-width=".9"/><circle cx="0" cy="-8" r="16" fill="transparent"/></g>`});
 return `<svg id="room" viewBox="0 0 400 500" role="img" aria-label="beach">${o}</svg>`}
function bindBeach(){document.querySelectorAll('.shell').forEach(e=>{const f=()=>{const c=got();c.push(+e.dataset.i);LY.set('shells',c);render();toast(c.length>=SHELLS.length?'You found every shell! 🐚💗':`Shell collected 🐚 ${c.length}/${SHELLS.length}`)};e.onclick=f;e.onkeydown=ev=>{if(ev.key==='Enter')f()}})}
/* ---------- wiring ---------- */
function bind(){const a=(id,f)=>{const e=$(id);if(!e)return;e.onclick=f;e.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();f()}}};
 a('cat',petCat);a('hLamp',()=>{st.cosy=!st.cosy;render();toast(st.cosy?'Cosy mode 🕯️':'Bright mode ☀️')});
 a('hWin',()=>{st.weather=WE[(WE.indexOf(st.weather)+1)%4];render();startSound();toast('Outside: '+WN[st.weather])});
 a('hBook',openBooks);a('hRec',()=>{if(LY.get('song',null)&&st.playing){stopYT();render();toast('Paused');return}if(LY.get('song',null)&&ytId(LY.get('song').url))playSong();else openSong()});
 const r=$('hRec');if(r)r.addEventListener('contextmenu',e=>{e.preventDefault();openSong()})}
function render(){const stg=$('stage');
 document.querySelectorAll('#scenes .pill').forEach(b=>b.classList.toggle('on',b.dataset.s===st.scene));
 $('dn').textContent=st.mode==='day'?'☀️ Day':'🌙 Night';$('snd').textContent=soundOn?'🔊 sound on':'🔇 sound off';
 if(st.scene==='room'){stg.innerHTML=room();bind();$('hint').textContent='tap the lamp, window, bookshelf, record player or the cat';if(!cat.t)catLoop()}
 else{clearTimeout(cat.t);cat.t=null;
  if(st.scene==='mountain'){stg.innerHTML=mountain();bindGarden();$('hint').textContent='tap a flower to remember its good thing'}
  else if(st.scene==='beach'){stg.innerHTML=beach();bindBeach();$('hint').textContent='tap the shells on the sand to collect them'}
  else{stg.innerHTML=forest();bindForest();$('hint').textContent='follow the fairy · tap mushrooms, lanterns, butterflies and glowing spots · write below to grow flowers and send wishes'}}
 drawGarden()}
$('scenes').innerHTML=SC.map(([k,l])=>`<button class="pill" data-s="${k}">${l}</button>`).join('');
$('stage').addEventListener('pointermove',ev=>{const sv=$('room');if(st.scene!=='forest'||!sv)return;const r=sv.getBoundingClientRect();fp.tx=(ev.clientX-r.left)/r.width*400+14;fp.ty=(ev.clientY-r.top)/r.height*500-14;fp.last=Date.now()});
$('scenes').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;st.scene=b.dataset.s;render();startSound()};
$('dn').onclick=()=>{st.lit=null;st.mode=st.mode==='day'?'night':'day';render()};
$('snd').onclick=()=>{soundOn=!soundOn;render();if(soundOn)startSound();else stopSound()};
lyBackupBar($('backup'),()=>render());
render();
})();
