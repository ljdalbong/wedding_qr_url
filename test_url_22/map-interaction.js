/* P20 자체 구현: 승인된 정사각형 지도 외의 화면은 수정하지 않는다. */
(function () {
 'use strict';
 const frame=document.querySelector('.map-frame');
 if(!frame) return;
 const buttons=frame.querySelectorAll('[data-map-action]');
 let map=null,live=false,aborted=false;
 const lat=Number(frame.dataset.lat),lng=Number(frame.dataset.lng);
 function fallback(){aborted=true;live=false;frame.classList.remove('map-live');if(map){try{map.remove();}catch(e){}map=null;}buttons.forEach(b=>{b.disabled=true;});}
 // 로컬 파일 미리보기에는 외부 타일 네트워크를 요구하지 않는다.
 if(location.protocol!=='https:'&&location.hostname!=='localhost'&&location.hostname!=='127.0.0.1'){fallback();return;}
 if(!window.L){fallback();return;}
 try{
  const touch=window.matchMedia&&matchMedia('(pointer: coarse)').matches;
  map=L.map('interactive-map',{zoomControl:false,attributionControl:false,scrollWheelZoom:!touch,dragging:true,touchZoom:true,boxZoom:!touch,keyboard:true,doubleClickZoom:true}).setView([lat,lng],17);
  // 모바일 지도 터치를 허용하되 스크롤 충돌은 기기 시험에서 추가 검증.
  const pin=L.divIcon({className:'wedding-map-pin',html:'<svg width="31" height="43" viewBox="0 0 31 43" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 1C7 1 1 7 1 15c0 11 14.5 27 14.5 27S30 26 30 15C30 7 24 1 15.5 1Z" fill="#202020" stroke="white" stroke-width="1.5"/><circle cx="15.5" cy="15" r="5" fill="white"/></svg>',iconSize:[31,43],iconAnchor:[15,43]});
  L.marker([lat,lng],{icon:pin}).addTo(map);
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,minZoom:14,attribution:'© OpenStreetMap contributors',crossOrigin:true,referrerPolicy:'strict-origin-when-cross-origin'});
  let errors=0,received=0,settled=false;
  function fail(){if(!aborted)fallback();}
  const timer=setTimeout(fail,8000);
  tiles.on('tileerror',()=>{if(aborted)return;errors++;if(errors>=3){clearTimeout(timer);fail();}});
  tiles.on('tileload',()=>{if(aborted)return;received++;if(received>=3&&!settled){settled=true;clearTimeout(timer);live=true;frame.classList.add('map-live');map.invalidateSize();}});
  tiles.addTo(map);
  buttons.forEach(b=>b.addEventListener('click',()=>{if(!map||!live)return; if(b.dataset.mapAction==='zoom-in')map.zoomIn();else map.zoomOut();}));
 }catch(e){fallback();}
})();