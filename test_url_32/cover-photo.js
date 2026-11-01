/* 목적: 표지 설정을 읽는 동안 과거 고양이 사진이 순간 표시되는 현상을 없앱니다.
 * 기능: cover-config.json에 지정된 이미지가 정상 로딩된 후에만 표시합니다.
 * 변경 범위: 표지 사진 1개와 표시 시점. 기타 디자인·기능·사진 원본은 변경하지 않습니다.
 * 오류 처리: 설정 조회 실패 시 HTML 기본 사진을 로드해 표시합니다.
 * 롤백: 기존 index.html 및 cover-photo.js를 직전 커밋에서 복원합니다. */
(async function(){
  'use strict';
  const photo=document.querySelector('img.cover-photo');
  if(!photo)return;
  const original=photo.getAttribute('src');
  photo.style.visibility='hidden';
  // 파일을 먼저 정상 로딩한 뒤 현재 표지 요소에 반영합니다.
  function showWhenReady(src){
    const loader=new Image();
    loader.onload=()=>{
      photo.src=src;
      photo.style.visibility='visible';
    };
    loader.onerror=()=>{
      console.error('cover image missing:',src);
      // 현재 설정 사진이 실패하면 기본 사진으로 복구하되,
      // 기본 사진까지 실패하면 오류 상태에서 계속 숨깁니다.
      if(src!==original)showWhenReady(original);
    };
    loader.src=src;
  }
  try{
    const response=await fetch('cover-config.json',{cache:'no-cache'});
    if(!response.ok)throw Error('cover config HTTP '+response.status);
    const config=await response.json();
    const path=config.coverImage;
    if(typeof path!=='string'||!/^assets\/[A-Za-z0-9_./-]+\.(?:jpe?g|png|webp)$/i.test(path)||path.includes('..'))
      throw Error('unsupported coverImage path');
    showWhenReady(path);
  }catch(error){
    console.error('cover config:',error);
    showWhenReady(original);
  }
})();
