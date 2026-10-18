/* Shared behaviour. Header = header.html, footer = footer.html, details = config.js */
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)],P=document.body.dataset.p;
const C={email:SITE.email,wa:SITE.whatsapp};
async function part(file,pos){let h;
  try{const r=await fetch(file);if(!r.ok)throw 0;h=await r.text()}
  catch{h=pos=="afterbegin"?'<header><div class="w"><a class="lg" href="index.html">Home</a><nav><a href="services.html">Services</a><a href="work.html">Work</a><a href="about.html">About</a><a href="contact.html">Contact</a></nav></div></header>':'<footer><div class="w"><p>© Surender Verma</p></div></footer>'}
  document.body.insertAdjacentHTML(pos,h.replace(/\{\{(\w+)\}\}/g,(m,k)=>SITE[k]??""))}
(async()=>{
document.body.insertAdjacentHTML("afterbegin",'<div id="pb"></div>');
await Promise.all([part("header.html","afterbegin"),part("footer.html","beforeend")]);
$$("nav [data-p]").forEach(a=>a.classList.toggle("on",a.dataset.p==P));
const wa="https://wa.me/"+SITE.whatsapp;
$$("[data-wa]").forEach(a=>a.href=wa);
$$("[data-c]").forEach(a=>{const k=a.dataset.c;
  if(k=="email"){a.href="mailto:"+SITE.email;a.textContent=SITE.email}
  if(k=="phone"){a.href="tel:"+SITE.phone;a.textContent="Call "+SITE.phoneText}
  if(k=="wa"){a.href=wa;a.textContent="WhatsApp "+SITE.phoneText}
  if(k=="site"){a.href=SITE.website;a.textContent=SITE.website.replace("https://","")}});
if($("#hd")){
const hd=$("#hd"),nv=$("#nv"),bg=$("#bg"),R=document.documentElement;
const shut=()=>{nv.classList.remove("open");document.body.style.overflow="";bg.textContent="☰"};
bg.onclick=()=>{const o=nv.classList.toggle("open");document.body.style.overflow=o?"hidden":"";bg.textContent=o?"✕":"☰"};
$$("#nv a").forEach(a=>a.addEventListener("click",shut));
$("#annx").onclick=()=>{$("#ann").classList.add("x");try{sessionStorage.setItem("ann","1")}catch{}};
try{if(sessionStorage.getItem("ann"))$("#ann").classList.add("x")}catch{}
let ly=0;addEventListener("scroll",()=>{const y=scrollY;hd.classList.toggle("sc",y>20);hd.classList.toggle("hide",y>ly&&y>300&&!nv.classList.contains("open"));ly=y},{passive:true});
try{const t=localStorage.getItem("theme");if(t)R.dataset.theme=t}catch{}
$("#th").onclick=()=>{const d=R.dataset.theme=="dark"?"light":"dark";R.dataset.theme=d;try{localStorage.setItem("theme",d)}catch{}};
const items=[["Home","index.html"],["Premium websites","services.html#websites"],["Business apps","services.html#apps"],["Custom CRM","services.html#crm"],["Chrome extensions","services.html#ext"],["Our work","work.html"],["About","about.html"],["Contact us","contact.html"],["Chat on WhatsApp",wa],["Send an email","mailto:"+SITE.email]];
const cp=$("#cp"),ci=$("#cpi"),cl=$("#cpl");let sel=0,cur=items;
const draw=()=>{cl.innerHTML=cur.map((x,i)=>`<li><a href="${x[1]}" class="${i==sel?"sel":""}">${x[0]}</a></li>`).join("")||"<li style='padding:14px'>No match</li>"};
const openP=()=>{cp.hidden=false;ci.value="";cur=items;sel=0;draw();ci.focus()},closeP=()=>cp.hidden=true;
$("#srch").onclick=openP;cp.onclick=e=>{if(e.target==cp)closeP()};cl.addEventListener("click",closeP);
ci.oninput=()=>{const q=ci.value.toLowerCase();cur=items.filter(x=>x[0].toLowerCase().includes(q));sel=0;draw()};
addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()=="k"){e.preventDefault();cp.hidden?openP():closeP()}
if(cp.hidden)return;if(e.key=="Escape")closeP();if(e.key=="ArrowDown"){e.preventDefault();sel=Math.min(sel+1,cur.length-1);draw()}if(e.key=="ArrowUp"){e.preventDefault();sel=Math.max(sel-1,0);draw()}if(e.key=="Enter"&&cur[sel])location.href=cur[sel][1]});
}
addEventListener("scroll",()=>{const h=document.documentElement;$("#pb").style.width=h.scrollTop/(h.scrollHeight-h.clientHeight)*100+"%"},{passive:1});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15});
$$(".rv,.bars").forEach((e,i)=>{e.style.transitionDelay=(i%4)*.08+"s";io.observe(e)});
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const t=+e.target.dataset.n,s=performance.now();(function f(n){const k=Math.min((n-s)/1600,1);e.target.textContent=Math.round(t*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(s)}));
$$("[data-n]").forEach(e=>co.observe(e));
$$(".card").forEach(c=>{c.onmousemove=e=>{const r=c.getBoundingClientRect();c.style.setProperty("--ry",((e.clientX-r.left)/r.width-.5)*8+"deg");c.style.setProperty("--rx",-((e.clientY-r.top)/r.height-.5)*8+"deg")};c.onmouseleave=()=>{c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")}});
$$(".fl button").forEach(b=>b.onclick=()=>{$$(".fl button").forEach(x=>x.setAttribute("aria-pressed",x==b));$$("[data-t]").forEach(c=>c.hidden=b.dataset.f!="all"&&c.dataset.t!=b.dataset.f)});
const f=$("#form");if(f)f.onsubmit=e=>{e.preventDefault();const d=new FormData(f);location.href=`mailto:${C.email}?subject=${encodeURIComponent("Project enquiry from "+d.get("n"))}&body=${encodeURIComponent(d.get("m")+"\n\nType: "+d.get("t")+"\nFrom: "+d.get("n")+" ("+d.get("e")+")")}`;$("#ok").textContent="Your email app should open with the message ready."};
const cv=$("#c");if(cv&&!matchMedia("(prefers-reduced-motion:reduce)").matches){const x=cv.getContext("2d");let W,H,m={x:-1e3,y:-1e3},N=[];const rs=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;N=Array.from({length:Math.min(70,W/14|0)},()=>({x:Math.random()*W,y:Math.random()*H,vx:Math.random()-.5,vy:Math.random()-.5}))};rs();addEventListener("resize",rs);cv.parentNode.onpointermove=e=>{const r=cv.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top};
(function d(){x.clearRect(0,0,W,H);N.forEach((a,i)=>{a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;const dm=Math.hypot(a.x-m.x,a.y-m.y);if(dm<160){a.x+=(m.x-a.x)*.01;a.y+=(m.y-a.y)*.01}x.fillStyle=dm<160?"#2f5bff":"#9bb2f5";x.beginPath();x.arc(a.x,a.y,2.2,0,7);x.fill();for(let j=i+1;j<N.length;j++){const b=N[j],l=Math.hypot(a.x-b.x,a.y-b.y);if(l<130){x.strokeStyle=`rgba(47,91,255,${.3-l/450})`;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}});requestAnimationFrame(d)})()}

const rt=$("#rot");if(rt){const q=["launch a website that converts?","track every lead and follow-up?","automate billing and bookings?","cut repetitive browser work?","look premium on every phone?","turn visitors into enquiries?"];let i=0;setInterval(()=>{rt.classList.add("out");setTimeout(()=>{i=(i+1)%q.length;rt.textContent=q[i];rt.classList.remove("out")},400)},2800)}
const vd=$(".vid button");if(vd)vd.onclick=()=>{const v=vd.parentNode;v.classList.toggle("on");vd.textContent=v.classList.contains("on")?"Pause":"Play preview"};

})();
