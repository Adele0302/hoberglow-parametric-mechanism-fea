/* HoberGlow conceptual light-path overlay.
 * Visual explanation only: not physically traced rays, measured optical data,
 * nor an estimate of refraction angles or photometric performance.
 * The original Three.js lamp runtime and model assets remain untouched.
 */
(()=>{
  'use strict';
  const svg=document.getElementById('light-paths-svg');
  const layer=document.getElementById('lp-rays');
  const button=document.getElementById('light-path-toggle');
  const note=document.getElementById('light-path-note');
  if(!svg||!layer||!button)return;

  let enabled=true, initialized=false, unavailable=false;
  let rayGroups=[], cachedPetals=[], cachedEmitters=[];
  let lastFrame=0;
  const NS='http://www.w3.org/2000/svg';
  const create=(tag,attributes={})=>{
    const el=document.createElementNS(NS,tag);
    for(const [name,value] of Object.entries(attributes))el.setAttribute(name,String(value));
    return el;
  };
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const formatPoint=p=>p.x.toFixed(1)+','+p.y.toFixed(1);
  const mix=(a,b,t)=>a.clone().lerp(b,t);

  function makeRay(){
    const group=create('g',{'class':'lp-ray'});
    const incomingGlow=create('path',{'class':'lp-incident-glow'});
    const incoming=create('path',{'class':'lp-incident'});
    const redirectedGlow=create('path',{'class':'lp-outgoing-glow'});
    const redirected=create('path',{'class':'lp-outgoing','marker-end':'url(#lp-arrow)'});
    const sparkle=create('circle',{'class':'lp-intersection-glow',r:7});
    const hit=create('circle',{'class':'lp-intersection',r:2.5});
    const source=create('circle',{'class':'lp-source',r:1.65});
    group.append(incomingGlow,redirectedGlow,incoming,redirected,sparkle,hit,source);
    layer.append(group);
    return {group,incomingGlow,incoming,redirectedGlow,redirected,sparkle,hit,source};
  }
  function setEnabled(value){
    enabled=!!value;
    button.setAttribute('aria-pressed',String(enabled));
    button.textContent=enabled?'Rays on':'Rays off';
    svg.classList.toggle('is-visible',enabled&&initialized);
    if(note)note.hidden=!enabled||!initialized;
  }
  button.addEventListener('click',()=>setEnabled(!enabled));

  function worldCenter(mesh){
    if(!mesh?.geometry)return null;
    try{
      if(!mesh.geometry.boundingSphere)mesh.geometry.computeBoundingSphere();
      if(!mesh.geometry.boundingSphere)return null;
      return mesh.geometry.boundingSphere.center.clone().applyMatrix4(mesh.matrixWorld);
    }catch(error){return null;}
  }
  function initialize(lamp){
    const petals=(lamp.petals||[]).filter(p=>p.mesh&&(p.group===36||p.group===39));
    const emitters=(lamp.originals||[]).filter(p=>p.mesh&&p.group===414);
    if(!petals.length){unavailable=true;button.disabled=true;return;}
    cachedPetals=petals;
    cachedEmitters=emitters;
    for(let i=0;i<8;i++)rayGroups.push(makeRay());
    initialized=true;
    button.disabled=false;
    setEnabled(enabled);
  }
  function screenPoint(vector,camera,width,height){
    const v=vector.clone().project(camera);
    if(!Number.isFinite(v.x)||!Number.isFinite(v.y)||!Number.isFinite(v.z)
       ||v.z<=-1||v.z>=1)return null;
    return {x:(v.x+1)*width/2,y:(1-v.y)*height/2,depth:v.z};
  }
  function pickEven(items,limit){
    if(items.length<=limit)return items;
    const chosen=[];
    for(let i=0;i<limit;i++)chosen.push(items[Math.floor((i+.5)*items.length/limit)]);
    return chosen;
  }
  function frame(now){
    requestAnimationFrame(frame);
    const lamp=window.__LAMP__;
    if(!lamp?.loaded||unavailable)return;
    if(!initialized)initialize(lamp);
    if(!enabled||!initialized||document.hidden)return;
    if(now-lastFrame<42)return;
    lastFrame=now;
    try{
      const width=window.innerWidth,height=window.innerHeight;
      if(width<20||height<20)return;
      svg.setAttribute('viewBox','0 0 '+width+' '+height);
      lamp.model.updateMatrixWorld(true);
      lamp.camera.updateMatrixWorld(true);
      const candidates=cachedPetals.map(p=>({
        group:p.group,point:worldCenter(p.mesh)
      })).filter(p=>p.point);
      if(!candidates.length){layer.style.opacity='0';return;}
      const mid=candidates[0].point.clone().multiplyScalar(0);
      for(const candidate of candidates)mid.add(candidate.point);
      mid.multiplyScalar(1/candidates.length);
      let radius=0;
      for(const c of candidates){
        const dx=c.point.x-mid.x,dz=c.point.z-mid.z;
        radius=Math.max(radius,Math.hypot(dx,dz));
      }
      if(radius<=1e-7){layer.style.opacity='0';return;}
      const eye=lamp.camera.position.clone().sub(mid);
      eye.y=0;
      if(eye.lengthSq()<1e-9){eye.x=1;}
      eye.normalize();
      const visible=candidates.filter(c=>{
        const radial=c.point.clone().sub(mid);radial.y=0;
        return radial.lengthSq()>1e-8&&radial.normalize().dot(eye)>-.1;
      }).map(c=>({...c,screen:screenPoint(c.point,lamp.camera,width,height)}))
        .filter(c=>c.screen&&c.screen.x>=-80&&c.screen.x<=width+80&&c.screen.y>=-80&&c.screen.y<=height+80);
      const selected=[
        ...pickEven(visible.filter(c=>c.group===36).sort((a,b)=>a.screen.x-b.screen.x),4),
        ...pickEven(visible.filter(c=>c.group===39).sort((a,b)=>a.screen.x-b.screen.x),4)
      ].sort((a,b)=>a.screen.x-b.screen.x);
      const emitterPoints=cachedEmitters.map(c=>worldCenter(c.mesh)).filter(Boolean);
      const progress=clamp(Number(lamp.progress)||0,0,1);
      let visibleCount=0;
      rayGroups.forEach((ray,index)=>{
        const item=selected[index];
        if(!item){ray.group.style.display='none';return;}
        const impact=item.point;
        const radial=impact.clone().sub(mid);radial.y=0;
        if(radial.lengthSq()<1e-9){ray.group.style.display='none';return;}
        radial.normalize();
        let emitter=mid;
        if(emitterPoints.length){
          let best=Infinity;
          for(const p of emitterPoints){
            const d=p.distanceToSquared(impact);
            if(d<best){best=d;emitter=p;}
          }
        }
        const from=mix(emitter,impact,.14);
        if(from.distanceTo(impact)<radius*.14){
          from.copy(mid).lerp(impact,.32);
        }
        // Conceptual redirected light direction, not Snell-law tracing.
        const to=impact.clone().addScaledVector(radial,radius*(.55-.10*progress));
        to.y-=radius*(.42+.16*progress);
        const a=screenPoint(from,lamp.camera,width,height);
        const b=screenPoint(impact,lamp.camera,width,height);
        const c=screenPoint(to,lamp.camera,width,height);
        if(!a||!b||!c||Math.hypot(c.x-b.x,c.y-b.y)<10){
          ray.group.style.display='none';return;
        }
        ray.group.style.display='';
        const first='M'+formatPoint(a)+' L'+formatPoint(b);
        const second='M'+formatPoint(b)+' L'+formatPoint(c);
        ray.incoming.setAttribute('d',first);
        ray.incomingGlow.setAttribute('d',first);
        ray.redirected.setAttribute('d',second);
        ray.redirectedGlow.setAttribute('d',second);
        ray.sparkle.setAttribute('cx',b.x);ray.sparkle.setAttribute('cy',b.y);
        ray.hit.setAttribute('cx',b.x);ray.hit.setAttribute('cy',b.y);
        ray.source.setAttribute('cx',a.x);ray.source.setAttribute('cy',a.y);
        ray.group.style.opacity=String(.60+.32*(1-Math.abs(b.x-width/2)/(width*.7)));
        visibleCount++;
      });
      layer.style.opacity=visibleCount?'1':'0';
    }catch(error){
      // Decorative layer must never interrupt the 3D renderer or motion controls.
      console.warn('HoberGlow schematic layer skipped:',error);
      layer.style.opacity='0';
      unavailable=true;
      button.disabled=true;
      if(note)note.hidden=true;
    }
  }
  setEnabled(true);
  requestAnimationFrame(frame);
})();