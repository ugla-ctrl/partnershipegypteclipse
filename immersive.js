(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const film=$('.film'),threshold=$('.threshold'),portal=$('.portal-camera'),opening=$('.opening'),crossing=$('.crossing'),totality=$('.totality'),sun=$('.eclipse-photograph'),moment=$('.moment-copy'),nile=$('.nile'),river=$('.river-camera'),nileCopy=$('.nile-copy'),end=$('.river-end'),cue=$('.scroll-cue'),pins=$$('.pin');
const clamp=x=>Math.min(1,Math.max(0,x)),range=(p,a,b)=>clamp((p-a)/(b-a)),smooth=x=>x*x*(3-2*x),mix=(a,b,t)=>a+(b-a)*t;
const scenes=$$('.chapter-scene'),names=['The threshold','The moment','The place',...scenes.map(s=>s.dataset.name)],keys=['threshold','moment','place',...scenes.map(s=>s.dataset.key)];
const shots=scenes.map(s=>({el:s,camera:s.querySelector('.landscape'),copy:s.querySelector('.scene-copy'),extra:s.querySelector('.scene-detail'),vessel:s.querySelector('.vessel')}));
let geometry={},openingLength=1,span=1,limit=1,stops=[],current=0,playing=false,lastTime=0,raf=0,position=0,low=matchMedia('(prefers-reduced-motion: reduce)').matches;
function measure(){
 openingLength=innerHeight*5.2;span=innerHeight*1.65;limit=openingLength+span*(scenes.length-.5);
 $('#travel').style.height=(limit+innerHeight)+'px';
 stops=[0,openingLength*.47,openingLength*.88,...scenes.map((_,i)=>openingLength+span*(i+.24))];
 const w=portal.offsetWidth,h=portal.offsetHeight,photoWidth=innerWidth<701?innerWidth*1.65:Math.max(innerWidth,innerHeight*1.1);
 geometry={w,h,photoWidth,startX:innerWidth/2+w*(535/1086-.5),startY:portal.offsetTop+h*(188/1448),disc:w*44/1086,targetDisc:photoWidth*580/1920};
}
function visible(el,opacity){el.style.opacity=opacity;el.style.visibility=opacity<.001?'hidden':'visible'}
function paint(p){
 // Both photographs share one tracked lunar centre and apparent disc size.
 const travel=smooth(range(p,.025,.425));
 const pitch=smooth(range(p,.025,.29));
 const magnification=Math.exp(Math.log(geometry.targetDisc/geometry.disc)*travel);
 const cx=mix(geometry.startX,innerWidth*.5,pitch);
 const cy=mix(geometry.startY,innerHeight*.30,pitch);
 portal.style.transformOrigin=`${535/1086*100}% ${188/1448*100}%`;
 portal.style.transform=`translateX(-50%) translate(${cx-geometry.startX}px,${cy-geometry.startY}px) scale(${magnification})`;
 visible(threshold,1-smooth(range(p,.28,.405)));
 const logo=range(p,.03,.23);
 opening.style.transform=`translateY(${logo*100}px) scale(${1+logo*5.5})`;
 visible(opening,1-smooth(range(p,.085,.205)));
 visible(crossing,smooth(range(p,.15,.20))*(1-smooth(range(p,.265,.31))));
 visible(cue,1-range(p,0,.04));
 visible(totality,p>.23?1:0);
 const photograph=sun.querySelector('img');
 const matchedScale=geometry.disc*magnification/geometry.targetDisc;
 const continuation=mix(1,1.06,smooth(range(p,.425,.64)));
 sun.style.transform='none';
 photograph.style.width=`${geometry.photoWidth*matchedScale*continuation}px`;
 photograph.style.left=`${cx}px`;
 photograph.style.top=`${cy}px`;
 const copy=smooth(range(p,.425,.48))*(1-smooth(range(p,.585,.65)));
 visible(moment,copy);moment.style.transform=`translateY(${(1-smooth(range(p,.425,.48)))*25}px)`;
 const reveal=smooth(range(p,.61,.755));
 visible(nile,range(p,.61,.64));
 nile.style.clipPath=`circle(${reveal*150}% at 50% ${innerWidth<701?30:33}%)`;
 const riverP=range(p,.65,1);river.style.transform=`scale(${mix(1.17,1,riverP)}) translateX(${mix(2,-1,riverP)}%)`;
 const readable=smooth(range(p,.745,.81));visible(nileCopy,readable);nileCopy.style.transform=`translateY(${(1-readable)*30}px)`;
 const interactive=p>.8;nile.style.pointerEvents=interactive?'auto':'none';nile.inert=!interactive;
 pins.forEach((pin,i)=>{visible(pin,smooth(range(p,.805+i*.025,.855+i*.025)));pin.disabled=!interactive});
 const finish=smooth(range(p,.89,.96));visible(end,finish);end.style.transform=`translateY(${(1-finish)*25}px)`;
}
function render(){
 const y=scrollY,p=clamp(y/openingLength),r=(y-openingLength)/span;
 current=r>=-.02?Math.min(names.length-1,Math.floor(Math.max(0,r))+3):p<.34?0:p<.715?1:2;
 const openingOpacity=1-smooth(range(r,-.2,.15));visible(film,openingOpacity);film.inert=r>.02;threshold.inert=current!==0;totality.inert=current!==1;
 if(openingOpacity>0)paint(low?(current===0?0:current===1?.5:1):p);
 shots.forEach((s,i)=>{
  const t=r-i;
  const opacity=smooth(range(t,-.2,.13))*(i===shots.length-1?1:1-smooth(range(t,.8,1.13)));
  visible(s.el,opacity);s.el.inert=current!==i+3;
  if(opacity<.001)return;
  const u=smooth(range(t,-.2,1.13));let scale=1.16-u*.1,x=4-u*7,z=-1+u*2;
  if(s.el.classList.contains('motion-temple')){scale=1.02+u*.19;x=0;z=3-u*5}
  if(s.el.classList.contains('motion-columns')){scale=1+u*.28;x=-1+u*2;z=3-u*6}
  if(s.el.classList.contains('motion-giza')){scale=1.14;x=6-u*12;z=1-u*2}
  if(s.el.classList.contains('motion-space')){scale=1.03+u*.15;x=0;z=3-u*6}
  if(s.el.classList.contains('motion-portal')){scale=1.16-u*.16;x=0;z=0}
  s.camera.style.transform=low?'none':`translate3d(${x}%,${z}%,0) scale(${scale})`;
  const drift=low?0:(.5-u)*36;s.copy.style.translate=`0 ${drift}px`;
  if(s.extra)s.extra.style.translate=`0 ${-drift*.6}px`;
  if(s.vessel)s.vessel.style.transform=low?'none':`translateX(${(u-.5)*40}%) scale(${.85+u*.15})`;
 });
 $('.cinema-current').textContent=`${String(current+1).padStart(2,'0')} / ${names.length} · ${names[current]}`;
 $('.cinema-prev').disabled=current===0;$('.cinema-next').disabled=current===names.length-1;
 $('.journey-line span').style.width=(clamp(y/limit)*100)+'%';
}
function frame(time){
 if(playing){const delta=Math.min(64,lastTime?time-lastTime:16);position=Math.min(limit,position+delta*(scrollY<openingLength?openingLength/38000:span/13500));scrollTo({top:position,behavior:'instant'});if(position>=limit-1)pause()}
 render();lastTime=time;raf=0;if(playing)raf=requestAnimationFrame(frame);
}
function request(){if(!raf)raf=requestAnimationFrame(frame)}
function pause(){playing=false;$('.cinema-play').innerHTML='▷ <span>PLAY JOURNEY</span>';$('.cinema-play').setAttribute('aria-label','Play journey');$('.cinema-play').setAttribute('aria-pressed','false')}
$('.cinema-play').addEventListener('click',()=>{if(playing){pause();return}position=scrollY>=limit-2?0:scrollY;lastTime=performance.now();playing=true;$('.cinema-play').innerHTML='Ⅱ <span>PAUSE</span>';$('.cinema-play').setAttribute('aria-label','Pause journey');$('.cinema-play').setAttribute('aria-pressed','true');request()});
function go(index){pause();index=Math.min(names.length-1,Math.max(0,index));scrollTo({top:stops[index],behavior:low?'instant':'smooth'});history.replaceState(null,'','#'+keys[index])}
$('.cinema-prev').addEventListener('click',()=>go(current-1));$('.cinema-next').addEventListener('click',()=>go(current+1));
const chapterDialog=$('.chapters-dialog'),detail=$('.detail-dialog'),body=$('.detail-body');
let scrollBeforeDialog=0,lastFocus=null,mapZoom=1,pendingScene=null,panelHistory=[];
function lock(){pause();scrollBeforeDialog=scrollY;lastFocus=document.activeElement;document.body.style.overflow='hidden'}
function unlock(){document.body.style.overflow='';scrollTo({top:scrollBeforeDialog,behavior:'instant'});lastFocus?.focus({preventScroll:true});request()}
$('.chapters-toggle').addEventListener('click',()=>{lock();chapterDialog.showModal()});$('.chapters-close').addEventListener('click',()=>chapterDialog.close());chapterDialog.addEventListener('close',()=>{unlock();if(pendingScene!==null){const target=pendingScene;pendingScene=null;go(target)}});
chapterDialog.addEventListener('click',e=>{const link=e.target.closest('[data-go]');if(link){pendingScene=+link.dataset.go;chapterDialog.close()}else if(e.target===chapterDialog&&e.offsetX<0)chapterDialog.close()});
function openPanel(key,back=false){
 const template=$('#detail-'+key);if(!template)return;
 if(!detail.open){lock();panelHistory=[]}if(!back)panelHistory.push(key);$('.detail-back').hidden=panelHistory.length<2;
 body.replaceChildren(template.content.cloneNode(true));body.scrollTop=0;mapZoom=1;
 $('.detail-name').textContent=key==='map'?'The journey · map':key==='luxor-map'?'Around Luxor':key==='moment'?'The moment':names.find((_,i)=>i>=3&&scenes[i-3]?.dataset.key===key)||'Explore';
 $('.map-tools').hidden=!['map','luxor-map'].includes(key);$('.map-scale').textContent='100%';
 if(!detail.open)detail.showModal();
}
function zoom(change){mapZoom=Math.min(3,Math.max(1,mapZoom+change));body.querySelector('.explore-map').style.width=mapZoom*100+'%';$('.map-scale').textContent=Math.round(mapZoom*100)+'%'}
$('.map-plus').addEventListener('click',()=>zoom(.5));$('.map-minus').addEventListener('click',()=>zoom(-.5));
$('.detail-back').addEventListener('click',()=>{panelHistory.pop();openPanel(panelHistory.at(-1),true)});
$('.detail-close').addEventListener('click',()=>detail.close());detail.addEventListener('close',unlock);
detail.addEventListener('click',e=>{if(e.target===detail)detail.close()});
addEventListener('click',e=>{const panel=e.target.closest('[data-panel]');if(panel){openPanel(panel.dataset.panel);return}const anchor=e.target.closest('a[href^="#"]');if(anchor){const hash=anchor.getAttribute('href').slice(1),index=hash.startsWith('chapter-')?+hash.slice(8):keys.indexOf(hash);if(index>=0){e.preventDefault();go(index)}}});
pins.forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.place==='aswan'?'stays':'gathering')));
function motion(){document.body.dataset.lowMotion=String(low);$('.cinema-motion').textContent=low?'ENABLE MOTION':'LESS MOTION';$('.cinema-motion').setAttribute('aria-pressed',String(low));pause();request()}
$('.cinema-motion').addEventListener('click',()=>{low=!low;motion()});
['wheel','touchstart','pointerdown'].forEach(type=>addEventListener(type,e=>{if(playing&&!e.target.closest('.cinema-play'))pause()},{passive:true}));
addEventListener('keydown',e=>{if(detail.open||chapterDialog.open)return;if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))pause();if(e.key==='ArrowRight'){e.preventDefault();go(current+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(current-1)}});
addEventListener('scroll',request,{passive:true});addEventListener('resize',()=>{const oldY=scrollY,oldOpening=openingLength,oldSpan=span;measure();const next=oldY<=oldOpening?oldY/oldOpening*openingLength:openingLength+(oldY-oldOpening)/oldSpan*span;scrollTo({top:next,behavior:'instant'});position=next;request()});addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
function fromHash(){const key=location.hash.slice(1),index=key.startsWith('chapter-')?+key.slice(8):keys.indexOf(key);if(index>=0&&index<keys.length){scrollTo({top:stops[index],behavior:'instant'});request()}}
addEventListener('hashchange',fromHash);measure();motion();fromHash();render();
})();
