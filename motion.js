(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const cards=[...document.querySelectorAll('.project-card')];
 const hero=document.querySelector('.hero');
 const motionButton=document.querySelector('#motion-toggle');
 let frame=0;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 function update(){
  frame=0;
  const disabled=reduced.matches||motionButton.getAttribute('aria-pressed')==='true';
  const vh=innerHeight;
  const extent=document.documentElement.scrollHeight-vh;
  document.documentElement.style.setProperty('--reading',extent>0?String(scrollY/extent):'0');
  window.dispatchEvent(new CustomEvent('portfolio-scroll',{detail:disabled?0:clamp(-hero.getBoundingClientRect().top/hero.offsetHeight,0,1)}));
  cards.forEach((card,index)=>{
   const rect=card.getBoundingClientRect();
   const progress=clamp((vh/2-(rect.top+rect.height/2))/(vh*.9),-1,1);
   const active=!disabled&&rect.bottom>0&&rect.top<vh;
   const strength=innerWidth>900?1:.3;
   const visual=card.querySelector('.project-visual');
   visual.style.setProperty('--rx',`${active?-progress*9*strength:0}deg`);
   visual.style.setProperty('--ry',`${active?(index%2?-1:1)*Math.abs(progress)*15*strength:0}deg`);
   visual.style.setProperty('--lift',`${active?-progress*30*strength:0}px`);
   card.style.setProperty('--copy-lift',`${active?-progress*18*strength:0}px`);
  });
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);
 new MutationObserver(schedule).observe(motionButton,{attributes:true,attributeFilter:['aria-pressed']});
 cards.forEach(card=>{
  const visual=card.querySelector('.project-visual');
  visual.addEventListener('pointermove',event=>{
   if(reduced.matches||!fine.matches||motionButton.getAttribute('aria-pressed')==='true')return;
   const r=visual.getBoundingClientRect();
   visual.style.setProperty('--rx',`${clamp((.5-(event.clientY-r.top)/r.height)*9,-5,5)}deg`);
   visual.style.setProperty('--ry',`${clamp(((event.clientX-r.left)/r.width-.5)*12,-7,7)}deg`);
  });
  visual.addEventListener('pointerleave',schedule);
 });
 schedule();
})();
