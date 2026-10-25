/* 목적: JPG/JPEG/PNG/WebP 표지 사진을 HTML·CSS 수정 없이 지정한다.
 * 기능: cover-config.json의 coverImage를 읽어 표지 이미지의 src만 변경한다.
 * 변경: 표지 사진 경로 설정화; 기존 기본값 assets/cover.jpg 유지.
 * 영향: cover-photo 요소 하나의 src 속성만 변경하며 디자인·글꼴은 건드리지 않는다.
 * 위험: 잘못된 경로 또는 파일 부재 시 기존 기본 표지 사진으로 복원한다.
 * 롤백: 이 스크립트 참조와 cover-config.json을 삭제하면 기존 cover.jpg 사용. */
(async function(){
  'use strict';
  const photo=document.querySelector('img.cover-photo');
  if(!photo)return;
  const original=photo.getAttribute('src');
  try{
    const response=await fetch('cover-config.json',{cache:'no-cache'});
    if(!response.ok)throw Error('cover config HTTP '+response.status);
    const config=await response.json();
    const path=config.coverImage;
    if(typeof path!=='string'||!/^assets\/[A-Za-z0-9_./-]+\.(?:jpe?g|png|webp)$/i.test(path)||path.includes('..'))
      throw Error('unsupported coverImage path');
    if(path===original)return;
    const check=new Image();
    check.onload=()=>{photo.src=path;};
    check.onerror=()=>{console.error('cover image missing:',path);};
    check.src=path;
  }catch(error){console.error('cover config:',error);}
})();
