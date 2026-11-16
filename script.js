const lines=[
  "You are doing better than you think.",
  "Small steps still move you forward.",
  "Be as kind to yourself as you are to others.",
  "You are allowed to rest and still be proud of yourself.",
  "Good things take time, and so do you."
];
const el=document.getElementById('affirm');let i=0;
el.textContent=lines[0];
el.addEventListener('click',next);
function next(){el.style.opacity=0;setTimeout(()=>{i=(i+1)%lines.length;el.textContent=lines[i];el.style.opacity=1},300)}
setInterval(next,7000);
