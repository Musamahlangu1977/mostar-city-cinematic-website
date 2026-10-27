document.addEventListener('DOMContentLoaded',()=>{
 const gallery=document.querySelector('#gallery');
 const scenes=[...gallery.querySelectorAll('.photo-scene')];
 const tabs=[...gallery.querySelectorAll('[data-photo]')];
 const count=gallery.querySelector('.photo-count');
 const stage=gallery.querySelector('.photo-stage');
 const names=['Stari Most','Kujundžiluk','Koski Mehmed Pasha Mosque','Kajtaz House','Halebija & memory','Neretva & the old city'];
 let current=0;
 function show(index){
   current=(index+scenes.length)%scenes.length;
   scenes.forEach((scene,i)=>{const active=i===current;scene.classList.toggle('is-current',active);scene.inert=!active;scene.setAttribute('aria-hidden',String(!active));});
   tabs.forEach((tab,i)=>{if(i===current)tab.setAttribute('aria-current','true');else tab.removeAttribute('aria-current');});
   count.textContent=String(current+1).padStart(2,'0')+' / 06 · '+names[current];
 }
 tabs.forEach((tab,i)=>tab.addEventListener('click',()=>show(i)));
 gallery.querySelector('.photo-prev').addEventListener('click',()=>show(current-1));
 gallery.querySelector('.photo-next').addEventListener('click',()=>show(current+1));
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1));}});
 let x=0,y=0;
 stage.addEventListener('touchstart',e=>{x=e.changedTouches[0].clientX;y=e.changedTouches[0].clientY;},{passive:true});
 stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)show(current+(dx<0?1:-1));},{passive:true});
 window.MostarGallery={open(index){show(index);gallery.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused')?'instant':'smooth'});gallery.focus({preventScroll:true});}};
 // Suspend compositor work on the cinematic scene while the photo chapter is in view.
 const cinema=document.querySelector('.cinema-scroll');
 new IntersectionObserver(entries=>{for(const entry of entries)cinema.classList.toggle('outside-view',!entry.isIntersecting);},{rootMargin:'100px'}).observe(cinema);
});
