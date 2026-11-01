/* 목적: 사진 수 제한 없이 설정 목록에서 기존 승인 갤러리 구성.
 * 기능: JSON 목록 읽기, 이미지·점 생성 및 스크롤 위치 표시.
 * 변경: 3장 하드코딩 제거. 영향: 갤러리 영역만.
 * 위험: JSON 누락 시 빈 갤러리가 될 수 있으므로 오류를 표시.
 * 롤백: 원래 3장 HTML 및 이 스크립트 참조 제거. */
(async function(){
  'use strict';
  const track=document.getElementById('gallery-track'), dots=document.getElementById('gallery-dots');
  if(!track||!dots)return;
  try{
    const response=await fetch('gallery-config.json',{cache:'no-cache'});
    if(!response.ok)throw Error('Gallery config HTTP '+response.status);
    const config=await response.json();
    if(!Array.isArray(config.photos))throw Error('gallery photos must be an array');
    track.replaceChildren(); dots.replaceChildren();
    config.photos.forEach((item,i)=>{
      if(!item||typeof item.src!=='string'||!item.src.startsWith('assets/gallery/'))return;
      const figure=document.createElement('figure');figure.className='gallery-slide';
      const img=document.createElement('img');img.src=item.src;img.alt=item.alt||('사진 '+(i+1));img.loading='lazy';img.draggable=false;
      figure.append(img);track.append(figure);
      const dot=document.createElement('span');dot.className='gallery-dot';dot.setAttribute('aria-hidden','true');dots.append(dot);
    });
    const slides=[...track.querySelectorAll('.gallery-slide')], marks=[...dots.children];
    function update(){
      const mid=track.getBoundingClientRect().left+track.clientWidth/2;
      let best=0,dist=Infinity;slides.forEach((slide,i)=>{const b=slide.getBoundingClientRect(),d=Math.abs((b.left+b.right)/2-mid);if(d<dist){dist=d;best=i;}});
      marks.forEach((dot,i)=>dot.classList.toggle('is-active',i===best));
      dots.setAttribute('aria-label',`현재 사진 ${slides.length?best+1:0}/${slides.length}`);
    }
    track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
  }catch(err){track.textContent='사진 목록을 불러오지 못했습니다.';console.error('gallery load:',err);}
})();
