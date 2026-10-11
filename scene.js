import * as THREE from './assets/three.module.js';
const canvas=document.querySelector('#scene');
const frame=document.querySelector('#scene-frame');
const toggle=document.querySelector('#motion-toggle');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches, renderer,scrollProgress=0;
function syncPause(){toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Play animations':'Pause animations');toggle.querySelector('span').textContent=paused?'▷':'Ⅱ';}
syncPause();
try {
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setClearColor(0xf7f8f2,0);renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(33,1,.1,30);camera.position.set(0,0,9.5);
 const envScene=new THREE.Scene();envScene.background=new THREE.Color(0xe4e8de);
 const whiteMat=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide});
 const lightPlane=new THREE.Mesh(new THREE.PlaneGeometry(6,8),whiteMat);lightPlane.position.set(-4,4,2);lightPlane.lookAt(0,0,0);envScene.add(lightPlane);
 const pinkPlane=new THREE.Mesh(new THREE.PlaneGeometry(4,7),new THREE.MeshBasicMaterial({color:0xa5b09a,side:THREE.DoubleSide}));pinkPlane.position.set(5,0,0);pinkPlane.lookAt(0,0,0);envScene.add(pinkPlane);
 const topPlane=new THREE.Mesh(new THREE.PlaneGeometry(8,4),whiteMat);topPlane.position.set(0,6,-2);topPlane.lookAt(0,0,0);envScene.add(topPlane);
 const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(envScene,.04);scene.environment=env.texture;
 scene.add(new THREE.AmbientLight(0xf0efdd,.8));
 const key=new THREE.DirectionalLight(0xfff9e9,2);key.position.set(-3,5,5);scene.add(key);
 const fill=new THREE.DirectionalLight(0xbdcbb4,1);fill.position.set(4,0,1);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xe8e9dc,1.5);rim.position.set(0,-2,-4);scene.add(rim);
 const root=new THREE.Group();root.position.y=.12;scene.add(root);
 const satin=new THREE.MeshPhysicalMaterial({color:0x687d63,metalness:.05,roughness:.72,clearcoat:0});
 const silver=new THREE.MeshPhysicalMaterial({color:0xd9d7ca,metalness:.02,roughness:.78,clearcoat:0});
 const blue=new THREE.MeshPhysicalMaterial({color:0x8c9c88,metalness:.05,roughness:.7,clearcoat:0});
 const connected=new THREE.Group();
 const outline=new THREE.Shape();outline.moveTo(-1.08,-1.4);outline.lineTo(1.08,-1.4);outline.lineTo(1.08,1.4);outline.lineTo(-1.08,1.4);outline.closePath();
 const opening=new THREE.Path();opening.moveTo(-.72,-1.04);opening.lineTo(-.72,1.04);opening.lineTo(.72,1.04);opening.lineTo(.72,-1.04);opening.closePath();outline.holes.push(opening);
 const portal=new THREE.ExtrudeGeometry(outline,{depth:.18,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035});portal.center();
 for(let i=0;i<3;i++){const panel=new THREE.Mesh(portal,[silver,blue,satin][i]);panel.position.set((i-1)*.58,(i-1)*.12,(i-1)*.58);connected.add(panel);}
 connected.rotation.set(.12,.48,-.12);
 const pedestal=new THREE.Mesh(new THREE.BoxGeometry(2.95,.12,2.3),silver);pedestal.position.set(0,-1.63,0);connected.add(pedestal);
 const layers=new THREE.Group();
 for(let i=0;i<6;i++){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.2,.115,20,120),i%2?blue:silver);ring.rotation.x=Math.PI/2;ring.position.y=(i-2.5)*.38;ring.scale.setScalar(1-Math.abs(i-2.5)*.11);layers.add(ring);
 }
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.61,1),satin);layers.add(core);layers.rotation.set(.2,0,-.3);
 const flow=new THREE.Group();
 for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.68,.68,.68),i%3===0?silver:satin);const a=i/8*Math.PI*2;m.position.set(Math.cos(a)*1.27,Math.sin(a)*1.27,Math.sin(a*2)*.35);m.rotation.set(.3,a,.35);flow.add(m);}
 const loop=new THREE.Mesh(new THREE.TorusGeometry(1.27,.034,12,100),blue);flow.add(loop);flow.rotation.set(.1,.35,0);
 const forms={connected,layers,flow};root.add(connected,layers,flow);layers.visible=false;flow.visible=false;
 let selected='connected',angle=-.08,tilt=0,last=0,dragging=false,startX=0,startY=0,visible=true,raf=0,dirty=true;
 function resize(){const w=frame.clientWidth,h=frame.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();root.scale.setScalar(w<350?.83:1);invalidate();}
 const observer=new ResizeObserver(resize);observer.observe(frame);resize();
 function invalidate(){dirty=true;if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(render);}
 function render(time){raf=0;if(!visible||document.hidden)return;const moving=!paused&&!dragging;if(dirty||time-last>=33){const delta=Math.min((time-last)/1000,.05);last=time;if(moving)angle+=delta*.07;const travel=paused||reduced.matches?0:scrollProgress;root.rotation.y=angle+travel*.7;root.rotation.x=tilt-travel*.16;camera.position.z=9.5-travel*2;for(let i=0;i<3;i++){const panel=connected.children[i];panel.position.x=(i-1)*(.58+travel*.9);panel.position.z=(i-1)*(.58+travel*.5);panel.rotation.y=(i-1)*travel*.3;}renderer.render(scene,camera);dirty=false;}if(moving)raf=requestAnimationFrame(render);}
 const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)invalidate();});visibility.observe(frame);
 window.addEventListener('portfolio-scroll',e=>{scrollProgress=e.detail;invalidate();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)invalidate();});
 function pointDown(e){if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;startX=e.clientX;startY=e.clientY;canvas.setPointerCapture(e.pointerId);}
 canvas.addEventListener('pointerdown',pointDown);
 canvas.addEventListener('pointermove',e=>{if(!dragging)return;angle+=(e.clientX-startX)*.007;tilt=THREE.MathUtils.clamp(tilt+(e.clientY-startY)*.003,-.55,.55);startX=e.clientX;startY=e.clientY;invalidate();});
 function stopDrag(){dragging=false;invalidate();}canvas.addEventListener('pointerup',stopDrag);canvas.addEventListener('pointercancel',stopDrag);
 canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();angle+=e.key==='ArrowLeft'?-.18:.18;invalidate();}});
 toggle.addEventListener('click',()=>{paused=!paused;syncPause();invalidate();});reduced.addEventListener('change',()=>{paused=reduced.matches;syncPause();invalidate();});
 const titles={connected:'Simple pieces. Thoughtfully arranged.',layers:'A different perspective.',flow:'Each part has a place.'};
 for(const button of document.querySelectorAll('[data-form]'))button.addEventListener('click',()=>{selected=button.dataset.form;for(const [key,form]of Object.entries(forms))form.visible=key===selected;document.querySelector('#scene-title').textContent=titles[selected];for(const item of document.querySelectorAll('[data-form]')){item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));}invalidate();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();frame.classList.remove('webgl-ready');canvas.style.visibility='hidden';document.querySelector('.drag-hint').textContent='3D preview unavailable';toggle.disabled=true;});
 frame.classList.add('webgl-ready');canvas.dataset.ready='true';invalidate();
}catch(error){canvas.hidden=true;toggle.hidden=true;document.querySelector('.scene-controls').hidden=true;document.querySelector('.drag-hint').textContent='Sculptural study';console.info('3D enhancement unavailable; static artwork remains.');}
