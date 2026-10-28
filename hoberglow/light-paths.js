/* HoberGlow | Conceptual light paths tied to original moving geometry.
   Geometry groups: 414=24 LED fixtures, 39=8 lower translucent panels,
   36=8 upper opaque panels. No change to the original model or kinematics.
   Illustration only: no measured optical properties or calibrated ray tracing. */
(()=>{
'use strict';
const svg=document.getElementById('light-paths-svg');
const group=document.getElementById('lp-rays');
const toggle=document.getElementById('light-path-toggle');
const note=document.getElementById('light-path-note');
if(!svg||!group||!toggle)return;
const NS='http://www.w3.org/2000/svg';
function el(tag,attrs={}){
  const result=document.createElementNS(NS,tag);
  for(const [key,value] of Object.entries(attrs))result.setAttribute(key,String(value));
  return result;
}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const format=p=>p.x.toFixed(1)+' '+p.y.toFixed(1);
const path=points=>'M'+points.map(format).join(' L');
let enabled=true,ready=false,failed=false,lastFrame=0;
let sources=[],upper=[],lower=[],drawables=[];
function makeDrawable(){
  const g=el('g',{'class':'lp-ray'});
  const upGlow=el('path',{'class':'lp-incident-glow'});
  const upLine=el('path',{'class':'lp-incident'});
  const bounceGlow=el('path',{'class':'lp-outgoing-glow'});
  const bounceLine=el('path',{'class':'lp-outgoing'});
  const diffuse=el('path',{'class':'lp-diffused','marker-end':'url(#lp-arrow)'});
  const lampDot=el('circle',{'class':'lp-source',r:2.1});
  const capHalo=el('circle',{'class':'lp-intersection-glow',r:7});
  const capDot=el('circle',{'class':'lp-intersection',r:2.5});
  const entering=el('circle',{'class':'lp-translucent-hit',r:1.7});
  const leaving=el('circle',{'class':'lp-translucent-hit',r:1.7});
  g.append(upGlow,bounceGlow,upLine,bounceLine,diffuse,capHalo,capDot,entering,leaving,lampDot);
  group.append(g);
  return {g,upGlow,upLine,bounceGlow,bounceLine,diffuse,lampDot,capHalo,capDot,entering,leaving};
}
function setEnabled(value){
  enabled=Boolean(value);
  toggle.textContent=enabled?'Rays on':'Rays off';
  toggle.setAttribute('aria-pressed',String(enabled));
  svg.classList.toggle('is-visible',enabled&&ready);
  if(note)note.hidden=!enabled||!ready;
}
toggle.addEventListener('click',()=>setEnabled(!enabled));
function localBounding(mesh){
  const geo=mesh.geometry;
  if(!geo?.attributes?.position)return null;
  if(!geo.boundingBox)geo.computeBoundingBox();
  return geo.boundingBox;
}
function center(mesh){
  const b=localBounding(mesh);
  return b?b.min.clone().add(b.max).multiplyScalar(.5).applyMatrix4(mesh.matrixWorld):null;
}
function sourceTop(mesh){
  const b=localBounding(mesh);
  if(!b)return null;
  const p=b.min.clone().add(b.max).multiplyScalar(.5);
  p.y=b.max.y;
  return p.applyMatrix4(mesh.matrixWorld);
}
function project(p,camera,w,h){
  if(!p)return null;
  const s=p.clone().project(camera);
  if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||s.z<=-1||s.z>=1)return null;
  return {x:(s.x+1)*w*.5,y:(1-s.y)*h*.5};
}
/* Actual original triangle-mesh intersections, updated after each lamp motion.
   Incident direction is upwards; upper opaque surfaces are never transmitted. */
function castMesh(mesh,origin,dir,limit){
  const geo=mesh.geometry,attr=geo?.attributes?.position;
  if(!attr||attr.itemSize!==3)return null;
  const inverse=mesh.matrixWorld.clone().invert();
  const o=origin.clone().applyMatrix4(inverse),d=dir.clone().transformDirection(inverse);
  const verts=attr.array,index=geo.index?.array||null;
  const count=index?index.length:attr.count;
  let bestT=Infinity,nx=0,ny=0,nz=0;
  for(let i=0;i+2<count;i+=3){
    const a=(index?index[i]:i)*3,b=(index?index[i+1]:i+1)*3,c=(index?index[i+2]:i+2)*3;
    const x=verts[a],y=verts[a+1],z=verts[a+2];
    const ux=verts[b]-x,uy=verts[b+1]-y,uz=verts[b+2]-z;
    const vx=verts[c]-x,vy=verts[c+1]-y,vz=verts[c+2]-z;
    const hx=d.y*vz-d.z*vy,hy=d.z*vx-d.x*vz,hz=d.x*vy-d.y*vx;
    const det=ux*hx+uy*hy+uz*hz;
    if(Math.abs(det)<1e-12)continue;
    const inv=1/det;
    const sx=o.x-x,sy=o.y-y,sz=o.z-z;
    const u=(sx*hx+sy*hy+sz*hz)*inv;
    if(u<-.00001||u>1.00001)continue;
    const qx=sy*uz-sz*uy,qy=sz*ux-sx*uz,qz=sx*uy-sy*ux;
    const v=(d.x*qx+d.y*qy+d.z*qz)*inv;
    if(v<-.00001||u+v>1.00001)continue;
    const t=(vx*qx+vy*qy+vz*qz)*inv;
    if(t<.000001||t>=bestT)continue;
    bestT=t;
    nx=uy*vz-uz*vy;ny=uz*vx-ux*vz;nz=ux*vy-uy*vx;
  }
  if(!Number.isFinite(bestT))return null;
  const hit=o.addScaledVector(d,bestT).applyMatrix4(mesh.matrixWorld);
  const distance=hit.distanceTo(origin);
  if(distance<.002||distance>limit)return null;
  const normal=dir.clone().set(nx,ny,nz).normalize().transformDirection(mesh.matrixWorld);
  return {point:hit,normal,distance};
}
function closestHit(panels,origin,dir,limit){
  // Sort by real moving panel location. Stop once a near hit is established.
  const sorted=panels.map(mesh=>({mesh,c:center(mesh)}))
    .sort((a,b)=>{
      const da=a.c?(a.c.x-origin.x)**2+(a.c.z-origin.z)**2:Infinity;
      const db=b.c?(b.c.x-origin.x)**2+(b.c.z-origin.z)**2:Infinity;
      return da-db;
    });
  let closest=null;
  for(const item of sorted){
    const hit=castMesh(item.mesh,origin,dir,closest?Math.min(limit,closest.distance):limit);
    if(hit&&(!closest||hit.distance<closest.distance))closest=hit;
  }
  return closest;
}
function initialize(lamp){
  sources=(lamp.originals||[]).filter(x=>x.group===414&&x.mesh).map(x=>x.mesh);
  upper=(lamp.petals||[]).filter(x=>x.group===36&&x.mesh).map(x=>x.mesh);
  lower=(lamp.petals||[]).filter(x=>x.group===39&&x.mesh).map(x=>x.mesh);
  if(!sources.length||!upper.length||!lower.length){
    console.warn('HoberGlow: missing light source or shade meshes');
    failed=true;toggle.disabled=true;return;
  }
  if(sources.length!==24||upper.length!==8||lower.length!==8)
    console.warn('HoberGlow: nonstandard lamp geometry counts',sources.length,upper.length,lower.length);
  sources.forEach(()=>drawables.push(makeDrawable()));
  ready=true;toggle.disabled=false;setEnabled(enabled);
}
function draw(now){
  requestAnimationFrame(draw);
  const lamp=window.__LAMP__;
  if(!lamp?.loaded||failed)return;
  if(!ready)initialize(lamp);
  if(!ready||!enabled||document.hidden||now-lastFrame<100)return;
  lastFrame=now;
  try{
    const camera=lamp.camera,w=window.innerWidth,h=window.innerHeight;
    svg.setAttribute('viewBox','0 0 '+w+' '+h);
    lamp.model.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    const startPoints=sources.map(sourceTop);
    const midpoint=startPoints.find(Boolean)?.clone();
    if(!midpoint)return;
    midpoint.set(0,0,0);
    let count=0;
    for(const p of startPoints)if(p){midpoint.add(p);count++;}
    midpoint.multiplyScalar(1/Math.max(1,count));
    const towardCamera=camera.position.clone().sub(midpoint);
    towardCamera.y=0;
    if(towardCamera.lengthSq()<1e-10)towardCamera.x=1;
    towardCamera.normalize();
    const span=upper.reduce((max,mesh)=>{
      const p=center(mesh);
      return p?Math.max(max,Math.hypot(p.x-midpoint.x,p.z-midpoint.z)):max;
    },0);
    if(span<.05)return;
    let displayed=0;
    for(let i=0;i<sources.length;i++){
      const ray=drawables[i],origin=startPoints[i];
      if(!origin){ray.g.style.display='none';continue;}
      const radial=origin.clone().sub(midpoint);radial.y=0;
      const facing=radial.lengthSq()>.00000001?radial.normalize().dot(towardCamera):0;
      if(facing<-.08){ray.g.style.display='none';continue;}
      const screenSource=project(origin,camera,w,h);
      if(!screenSource||screenSource.x<0||screenSource.x>w||screenSource.y<0||screenSource.y>h){
        ray.g.style.display='none';continue;
      }
      // Start precisely on top of the original LED fixture, not on the upper canopy.
      let direction=origin.clone().set(0,1,0);
      let cap=closestHit(upper,origin,direction,span*5);
      if(!cap){
        // The upward cone may tilt slightly inward at a canopy edge.
        const near=upper.map(m=>center(m)).filter(Boolean)
          .sort((a,b)=>a.distanceToSquared(origin)-b.distanceToSquared(origin))[0];
        if(near){
          const aimed=near.clone().sub(origin).normalize();
          if(aimed.y>.65){direction=aimed;cap=closestHit(upper,origin,direction,span*5);}
        }
      }
      if(!cap){ray.g.style.display='none';continue;}
      // The lower translucent board is crossed on the way UP, if in this ray's path.
      const lowerUp=closestHit(lower,origin,direction,cap.distance-.005);
      // Reflect at the underside of the opaque upper board; DO NOT emit through it.
      let outgoing=direction.clone().addScaledVector(cap.normal,-2*direction.dot(cap.normal)).normalize();
      if(outgoing.y>-.12)outgoing=direction.clone().multiplyScalar(-1);
      const afterCap=cap.point.clone().addScaledVector(outgoing,.006);
      const lowerDown=closestHit(lower,afterCap,outgoing,span*4);
      const transmitted=lowerDown?.point||cap.point.clone().addScaledVector(outgoing,span*.8);
      const diffuseDirection=outgoing.clone();diffuseDirection.y-=.18;diffuseDirection.normalize();
      const end=transmitted.clone().addScaledVector(diffuseDirection,span*.52);
      const a=screenSource,b=lowerUp?project(lowerUp.point,camera,w,h):null;
      const c=project(cap.point,camera,w,h),d=project(transmitted,camera,w,h),e=project(end,camera,w,h);
      if(!c||!d||!e||Math.hypot(c.x-a.x,c.y-a.y)<12){
        ray.g.style.display='none';continue;
      }
      ray.g.style.display='';
      const incident=path(b?[a,b,c]:[a,c]),reflected=path([c,d]);
      ray.upLine.setAttribute('d',incident);ray.upGlow.setAttribute('d',incident);
      ray.bounceLine.setAttribute('d',reflected);ray.bounceGlow.setAttribute('d',reflected);
      ray.diffuse.setAttribute('d',path([d,e]));
      ray.lampDot.setAttribute('cx',a.x);ray.lampDot.setAttribute('cy',a.y);
      ray.capHalo.setAttribute('cx',c.x);ray.capHalo.setAttribute('cy',c.y);
      ray.capDot.setAttribute('cx',c.x);ray.capDot.setAttribute('cy',c.y);
      ray.entering.style.display=b?'':'none';
      if(b){ray.entering.setAttribute('cx',b.x);ray.entering.setAttribute('cy',b.y);}
      ray.leaving.style.display=lowerDown?'':'none';
      if(lowerDown){ray.leaving.setAttribute('cx',d.x);ray.leaving.setAttribute('cy',d.y);}
      ray.g.style.opacity=String(clamp((facing+.1)/.75,.36,.94));
      displayed++;
    }
    group.style.opacity=displayed?'1':'0';
  }catch(error){
    console.warn('Optional light-path overlay disabled; original 3D viewer remains functional:',error);
    group.style.opacity='0';failed=true;toggle.disabled=true;
    if(note)note.hidden=true;
  }
}
setEnabled(true);
requestAnimationFrame(draw);
})();