window.CONTENT_READY.then(() => {
  'use strict';
  const $=id=>document.getElementById(id), canvas=$('globe'), ctx=canvas.getContext('2d');
  const places=window.PLACES;  let selected=places[0], rotating=!matchMedia('(prefers-reduced-motion: reduce)').matches, land=null, size=400, yaw=-114, pitch=-23, fly=null, drag=null, last=0, dirty=true, inView=true;
  const lang=()=>document.documentElement.lang.startsWith('zh')?1:0, t=a=>a[lang()];
  const el=(tag,text,cls)=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;};
  const pins=new Map(), tabs=new Map();
  const projection=d3.geoOrthographic().clipAngle(90).precision(.5), path=d3.geoPath(projection,ctx), grid=d3.geoGraticule10();
  const period=p=>lang()===1?p.period.replace('Sep','9 月').replace('Jan','1 月').replace('Jul','7 月').replace('Jun','6 月').replace('present','至今').replace('Publication','论文'):p.period;
  function controls(){ $('rotateToggle').textContent=rotating?t(['Pause rotation','暂停旋转']):t(['Resume rotation','继续旋转']);$('rotateToggle').setAttribute('aria-pressed',String(rotating)); }
  function detail(){
    const p=selected, left=el('div',''), right=el('div','');
    left.append(el('p',t(p.type),'eyebrow'),el('h2',t(p.name)),el('p',period(p),'place-period'),el('p',t(p.institution),'place-meta'));
    right.append(el('h3',t(p.title)),el('p',t(p.body)),el('p',t(['WORK & OUTCOMES','研究工作与成果']),'result-label'),el('p',t(p.outcome)));
    const a=el('a',t(p.linkLabel),'detail-link');a.href=p.link;if(p.link.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}right.append(a,el('p',p.tags,'detail-tags'));
    $('placeDetail').replaceChildren(left,right);
    for(const p of places){tabs.get(p.id).textContent=t(p.name);tabs.get(p.id).setAttribute('aria-pressed',String(selected===p));const pin=pins.get(p.id);pin.setAttribute('aria-label',t(['Explore research in ','查看科研地点：'])+t(p.name));pin.classList.toggle('selected',selected===p);pin.firstChild.textContent=t(p.name);}
    controls();dirty=true;
  }
  function select(p){selected=p;rotating=false;const target=-p.coords[0];const delta=((target-yaw+540)%360)-180;fly={from:[yaw,pitch],to:[yaw+delta,-p.coords[1]],start:performance.now()};detail();}
  for(const p of places){const b=el('button',t(p.name));b.type='button';b.addEventListener('click',()=>select(p));tabs.set(p.id,b);$('placeTabs').append(b);const pin=el('button','','globe-pin');pin.type='button';pin.append(el('span',t(p.name)));pin.addEventListener('pointerdown',e=>e.stopPropagation());pin.addEventListener('click',()=>select(p));pins.set(p.id,pin);$('globeMarkers').append(pin);}
  function resize(){size=canvas.parentElement.clientWidth;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(size*ratio);canvas.height=Math.round(size*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);projection.translate([size/2,size/2]).scale(size*.425);dirty=true;}
  function paint(){
    projection.rotate([yaw,pitch,0]);ctx.clearRect(0,0,size,size);
    ctx.save();ctx.shadowColor='#18344f25';ctx.shadowBlur=18;ctx.shadowOffsetY=12;ctx.beginPath();path({type:'Sphere'});ctx.fillStyle='#173d68';ctx.fill();ctx.restore();
    ctx.beginPath();path(grid);ctx.strokeStyle='#b8d6ef33';ctx.lineWidth=.6;ctx.stroke();
    if(land){ctx.beginPath();path(land);ctx.fillStyle='#b0c8da';ctx.fill();ctx.strokeStyle='#dfebf6a0';ctx.lineWidth=.5;ctx.stroke();}
    ctx.save();ctx.beginPath();path({type:'Sphere'});ctx.clip();const shade=ctx.createRadialGradient(size*.36,size*.28,size*.07,size*.5,size*.5,size*.48);shade.addColorStop(0,'#ffffff17');shade.addColorStop(.7,'#071c3600');shade.addColorStop(1,'#071c3680');ctx.fillStyle=shade;ctx.fillRect(0,0,size,size);ctx.restore();
    ctx.beginPath();path({type:'Sphere'});ctx.lineWidth=1;ctx.strokeStyle='#3d6995';ctx.stroke();
    const center=projection.invert([size/2,size/2]);
    for(const p of places){const pin=pins.get(p.id),visible=d3.geoDistance(center,p.coords)<Math.PI/2-.06;pin.hidden=!visible;if(visible){const [x,y]=projection(p.coords);pin.style.left=x+'px';pin.style.top=y+'px';}}
    dirty=false;
  }
  function frame(now){const dt=Math.min(now-last,50);last=now;if(inView&&!document.hidden){if(fly){const v=Math.min(1,(now-fly.start)/(matchMedia('(prefers-reduced-motion: reduce)').matches?1:850)),e=1-Math.pow(1-v,3);yaw=fly.from[0]+(fly.to[0]-fly.from[0])*e;pitch=fly.from[1]+(fly.to[1]-fly.from[1])*e;dirty=true;if(v===1)fly=null;}else if(rotating&&!drag){yaw=(yaw+dt*.008)%360;dirty=true;}if(dirty)paint();}requestAnimationFrame(frame);}
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};rotating=false;fly=null;controls();canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;yaw+=(e.clientX-drag.x)*.38;pitch=Math.max(-85,Math.min(85,pitch-(e.clientY-drag.y)*.38));drag.x=e.clientX;drag.y=e.clientY;dirty=true;});
  const end=()=>{drag=null;};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();rotating=false;fly=null;yaw+=e.key==='ArrowRight'?10:e.key==='ArrowLeft'?-10:0;pitch=Math.max(-85,Math.min(85,pitch+(e.key==='ArrowDown'?10:e.key==='ArrowUp'?-10:0)));controls();dirty=true;});
  $('rotateToggle').addEventListener('click',()=>{rotating=!rotating;fly=null;controls();});
  new ResizeObserver(resize).observe(canvas.parentElement);
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(canvas);
  new MutationObserver(detail).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  fetch('land.json').then(r=>{if(!r.ok)throw Error('map');return r.json();}).then(data=>{
    // Natural Earth GeoJSON follows RFC 7946 winding; D3 uses clockwise small polygons.
    for(const f of data.features){const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;for(const coordinates of polys){if(d3.geoArea({type:'Polygon',coordinates})>2*Math.PI)coordinates.forEach(ring=>ring.reverse());}}
    land=data;dirty=true;
  }).catch(()=>{$('atlas').append(el('p',t(['Coastlines could not load. You can still explore every location below.','海岸线暂未加载，仍可通过地点按钮查看全部研究。']),'map-warning'));});
  detail();resize();requestAnimationFrame(frame);
});