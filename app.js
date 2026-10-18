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
$("#bg").onclick=()=>$("nav").classList.toggle("open");
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
