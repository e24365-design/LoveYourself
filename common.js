/* LoveYourself shared storage: everything saved in this browser; backup/restore as a file */
const LY={
  get(k,d){try{const v=localStorage.getItem('ly_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('ly_'+k,JSON.stringify(v));return true}catch(e){return false}},
  backup(){const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('ly_'))o[k]=localStorage.getItem(k)}
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'}));
    a.download='LoveYourself-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click()},
  restore(file,done){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);Object.keys(o).forEach(k=>k.startsWith('ly_')&&localStorage.setItem(k,o[k]));done&&done()}catch(e){alert('That file could not be read')}};r.readAsText(file)},
  stamp(){const d=new Date();return{iso:d.toISOString(),text:d.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})+' · '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}},
  esc:s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))
};
function lyBackupBar(el,onDone){el.innerHTML='<button class="pill" id="bk">⬇ Backup</button><label class="pill">⬆ Restore<input type="file" accept=".json" hidden id="rs"></label>';
  el.querySelector('#bk').onclick=LY.backup;el.querySelector('#rs').onchange=e=>e.target.files[0]&&LY.restore(e.target.files[0],()=>{onDone&&onDone();alert('Restored 💗')})}
