const $=s=>document.querySelector(s),K='attJournal3';
const MN=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MG=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const WD=['вс','пн','вт','ср','чт','пт','сб'],WF=['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
const ACC=['#4f46e5','#0d9488','#e11d48','#d97706','#7c3aed'];
const TT={journal:'Журнал',students:'Ученики',quarters:'Четверти',settings:'Настройки'};
const D={students:[],marks:{},q:[['',''],['',''],['',''],['','']],theme:'auto',acc:ACC[0]};
try{Object.assign(D,JSON.parse(localStorage.getItem(K)||localStorage.getItem('attJournal2')||'{}'))}catch(e){}
const p2=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const dt=s=>new Date(s+'T00:00');
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const save=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){}};
const rng=d=>[iso(new Date(d.getFullYear(),d.getMonth(),1)),iso(new Date(d.getFullYear(),d.getMonth()+1,0))];
function wdays(a,b,all){if(!a||!b)return 0;const t=iso(new Date());if(!all&&b>t)b=t;let n=0;
 for(let d=dt(a);iso(d)<=b;d.setDate(d.getDate()+1))if(d.getDay())n++;return n}
function stat(id,a,b){let nb=0,up=0;
 for(const k in D.marks)if(k>=a&&k<=b){const v=D.marks[k][id];if(v==='nb')nb++;else if(v==='up')up++}
 const days=wdays(a,b);return{nb,up,days,pc:days?(nb/days*100).toFixed(1):'0.0'}}
let page='journal',sid=null,sel=iso(new Date()),cur=new Date(),ctr=true;cur.setDate(1);

function vJournal(){
 const y=cur.getFullYear(),m=cur.getMonth(),N=new Date(y,m+1,0).getDate(),today=iso(new Date());let strip='';
 for(let d=1;d<=N;d++){const k=y+'-'+p2(m+1)+'-'+p2(d),w=new Date(y,m,d).getDay(),
  n=Object.values(D.marks[k]||{}).filter(v=>v==='nb').length;
  strip+=`<button class="day${k===sel?' on':''}${w?'':' off'}${k===today?' now':''}" data-a="day" data-d="${k}"><small>${WD[w]}</small><b>${d}</b><i${n?'':' hidden'}></i></button>`}
 const d=dt(sel),mk=D.marks[sel]||{},nbn=Object.values(mk).filter(v=>v==='nb').length;
 const rows=D.students.map(s=>{const t=mk[s.id]||'';
  return `<div class="st"><span class="av">${esc(s.name[0].toUpperCase())}</span><span class="nm" data-a="open" data-s="${s.id}">${esc(s.name)}</span>
  <button class="nb${t==='nb'?' on':''}" data-a="mark" data-t="nb" data-s="${s.id}">НБ</button>
  <button class="up${t==='up'?' on':''}" data-a="mark" data-t="up" data-s="${s.id}">УП</button></div>`}).join('')
  ||'<div class="empty">Учеников пока нет.<br><br><button class="pri" data-a="go" data-p="students">Добавить ученика</button></div>';
 return `<div class="mon"><button data-a="mon" data-k="-1">◀</button><b>${MN[m]} ${y}</b><button class="tdy" data-a="today">Сегодня</button><button data-a="mon" data-k="1">▶</button></div>
 <div class="strip">${strip}</div>
 <div class="sum"><b>${WF[d.getDay()]}, ${d.getDate()} ${MG[d.getMonth()]}</b><small>НБ: ${nbn} из ${D.students.length}</small></div>${rows}`}

function vStudents(){
 return `<form id="addF" class="card add"><input type="text" id="name" placeholder="ФИО ученика" required autocomplete="off"><button class="pri">Добавить</button></form>`+
 (D.students.map(s=>`<div class="st" data-a="open" data-s="${s.id}"><span class="av">${esc(s.name[0].toUpperCase())}</span>
  <span class="nm">${esc(s.name)}<small>НБ всего: ${stat(s.id,'0000','9999').nb} · нажмите для статистики</small></span>
  <button class="x" data-a="del" data-s="${s.id}" aria-label="Удалить">🗑</button></div>`).join('')||'<div class="empty">Добавьте первого ученика</div>')}

function vStudent(){
 const s=D.students.find(x=>x.id===sid);if(!s){sid=null;return vStudents()}
 const t=new Date(),m=stat(s.id,...rng(t)),pm=stat(s.id,...rng(new Date(t.getFullYear(),t.getMonth()-1,1))),all=stat(s.id,'0000','9999');
 const qs=D.q.map((r,i)=>{const x=stat(s.id,r[0],r[1]);return `<tr><td>${i+1} четверть</td><td>${x.nb}</td><td>${x.up}</td><td>${x.days}</td><td class="${x.pc>=20?'hi':''}">${x.pc}%</td></tr>`}).join('');
 const ds=Object.keys(D.marks).filter(k=>D.marks[k][s.id]).sort().reverse().map(k=>{const v=D.marks[k][s.id],d=dt(k);
  return `<div class="dr"><span>${d.getDate()} ${MG[d.getMonth()]}, ${WD[d.getDay()]}</span><b class="${v}">${v==='nb'?'НБ':'УП'}</b><button class="x" data-a="rm" data-d="${k}" aria-label="Убрать">✕</button></div>`}).join('')||'<p class="mut">Отметок пока нет</p>';
 return `<div class="grid3"><div class="big"><b>${m.nb}</b><small>НБ в этом месяце<br>${m.pc}%</small></div>
 <div class="big"><b>${pm.nb}</b><small>НБ в прошлом месяце<br>${pm.pc}%</small></div><div class="big"><b>${all.nb}</b><small>НБ всего<br>УП: ${all.up}</small></div></div>
 <div class="card"><h2>По четвертям</h2><table><tr><th></th><th>НБ</th><th>УП</th><th>Дней</th><th>%</th></tr>${qs}</table>
 <p class="mut" style="font-size:13px;margin:10px 0 0">% = НБ ÷ учебные дни (пн–сб) до сегодня. Даты четвертей задаются на вкладке «Четверти».</p></div>
 <div class="card"><h2>Все отметки</h2>${ds}</div>`}

function vQuarters(){
 return D.q.map((r,i)=>`<div class="card"><h2>${i+1} четверть</h2><div class="qrow">с <input type="date" data-q="${i}" data-e="0" value="${r[0]}"> по <input type="date" data-q="${i}" data-e="1" value="${r[1]}"></div>
 <p class="mut" style="margin:10px 0 0;font-size:13px">${r[0]&&r[1]?'Учебных дней (пн–сб): '+wdays(r[0],r[1],1):'Укажите даты начала и конца'}</p></div>`).join('')}

function vSettings(){
 const th=[['light','Светлая'],['dark','Тёмная'],['auto','Авто']];
 return `<div class="card"><h2>Тема</h2><div class="seg">${th.map(x=>`<button data-a="theme" data-v="${x[0]}" class="${D.theme===x[0]?'on':''}">${x[1]}</button>`).join('')}</div></div>
 <div class="card"><h2>Цвет</h2><div class="sw">${ACC.map(c=>`<button data-a="acc" data-v="${c}" style="background:${c}" class="${D.acc===c?'on':''}" aria-label="Цвет"></button>`).join('')}</div></div>
 <div class="card"><h2>Данные</h2><button class="sec" data-a="csv">Скачать CSV (месяц из журнала)</button>
 <button class="sec" data-a="bak">Сохранить копию</button><label class="sec" style="display:inline-block;cursor:pointer">Загрузить копию<input type="file" id="file" accept=".json" hidden></label>
 <button class="sec" data-a="rst" style="color:var(--nb)">Очистить всё</button>
 <p class="mut" style="font-size:13px;margin:6px 0 0">Данные хранятся в этом браузере. Делайте копию, чтобы перенести журнал на другое устройство.</p></div>`}

function applyTheme(){
 const dk=D.theme==='dark'||(D.theme==='auto'&&matchMedia('(prefers-color-scheme:dark)').matches);
 document.documentElement.classList.toggle('dark',dk);document.documentElement.style.setProperty('--acc',D.acc)}
function render(){
 const o=$('.strip'),sl=o?o.scrollLeft:0,s=sid&&D.students.find(x=>x.id===sid);
 $('#ttl').textContent=s?s.name:TT[page];$('#back').hidden=!s;
 $('#view').innerHTML=({journal:vJournal,students:()=>sid?vStudent():vStudents(),quarters:vQuarters,settings:vSettings})[page]();
 document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.p===page));
 const n=$('.strip');
 if(n){const e=n.querySelector('.on');if(ctr&&e){n.scrollLeft=e.offsetLeft-n.clientWidth/2+e.offsetWidth/2;ctr=false}else n.scrollLeft=sl}
 applyTheme();save()}
async function dl(name,txt,type){const P=window.Capacitor&&Capacitor.Plugins;
 if(P&&P.Filesystem&&P.Share){try{const r=await P.Filesystem.writeFile({path:name,data:txt,directory:'CACHE',encoding:'utf8'});await P.Share.share({title:name,url:r.uri});return}catch(e){}}
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click()}

$('#view').onclick=e=>{const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,s=t.dataset.s;
 if(a==='day')sel=t.dataset.d;
 else if(a==='mark'){const m=D.marks[sel]=D.marks[sel]||{};m[s]===t.dataset.t?delete m[s]:m[s]=t.dataset.t;if(!Object.keys(m).length)delete D.marks[sel]}
 else if(a==='mon'){cur.setMonth(cur.getMonth()+ +t.dataset.k);const n=new Date();
  sel=iso(cur.getMonth()===n.getMonth()&&cur.getFullYear()===n.getFullYear()?n:cur);ctr=true}
 else if(a==='today'){cur=new Date();cur.setDate(1);sel=iso(new Date());ctr=true}
 else if(a==='open'){sid=s;page=(page==='journal')?'students':page;window.scrollTo(0,0)}
 else if(a==='go'){page=t.dataset.p}
 else if(a==='del'){const x=D.students.find(v=>v.id===s);
  if(!confirm('Удалить ученика «'+x.name+'» и все его отметки?'))return;
  D.students=D.students.filter(v=>v!==x);for(const k in D.marks){delete D.marks[k][s];if(!Object.keys(D.marks[k]).length)delete D.marks[k]}}
 else if(a==='rm'){const k=t.dataset.d;delete D.marks[k][sid];if(!Object.keys(D.marks[k]).length)delete D.marks[k]}
 else if(a==='theme')D.theme=t.dataset.v;
 else if(a==='acc')D.acc=t.dataset.v;
 else if(a==='csv'){const y=cur.getFullYear(),m=cur.getMonth(),N=new Date(y,m+1,0).getDate(),[f,l]=rng(cur);
  const r=[['Ученик',...Array.from({length:N},(_,i)=>i+1),'НБ за месяц']];
  D.students.forEach(s=>r.push([s.name,...Array.from({length:N},(_,i)=>{const v=(D.marks[y+'-'+p2(m+1)+'-'+p2(i+1)]||{})[s.id];return v==='nb'?'НБ':v==='up'?'УП':''}),stat(s.id,f,l).nb]));
  dl(`journal-${y}-${p2(m+1)}.csv`,'\uFEFF'+r.map(x=>x.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(';')).join('\n'),'text/csv');return}
 else if(a==='bak'){dl('journal-backup.json',JSON.stringify(D),'application/json');return}
 else if(a==='rst'){if(!confirm('Удалить всех учеников и все отметки?'))return;D.students=[];D.marks={};D.q=[['',''],['',''],['',''],['','']];sid=null}
 render()};
$('#view').onsubmit=e=>{e.preventDefault();const n=$('#name').value.trim();if(!n)return;
 D.students.push({id:'s'+Date.now(),name:n});D.students.sort((a,b)=>a.name.localeCompare(b.name,'ru'));render()};
$('#view').onchange=e=>{const t=e.target;
 if(t.dataset.q){D.q[+t.dataset.q][+t.dataset.e]=t.value;render()}
 else if(t.id==='file'&&t.files[0]){const r=new FileReader();
  r.onload=()=>{try{const j=JSON.parse(r.result);if(!Array.isArray(j.students))throw 0;Object.assign(D,j);render();alert('Копия загружена')}catch(x){alert('Не удалось прочитать файл')}};
  r.readAsText(t.files[0])}};
$('#tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;page=b.dataset.p;sid=null;ctr=true;render();window.scrollTo(0,0)};
$('#back').onclick=()=>{sid=null;render()};
render();
