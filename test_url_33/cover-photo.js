/* 목적: 등록된 여러 표지 사진 중 방문마다 무작위로 한 장을 표시합니다.
 * 기능: 직전 표지와 연속 중복을 피하고, 이미지 로딩 완료 전까지 표지를 숨깁니다.
 * 입력: cover-config.json의 coverImages 배열. 구버전 coverImage 한 장도 지원합니다.
 * 영향: .cover-photo의 src와 visibility만 변경, 기존 디자인 및 공유 OG 이미지는 고정.
 * 오류: 선택한 사진 실패 시 다른 후보를 시도하고, 전부 실패하면 기본 표지로 복구합니다.
 * 개인정보: GitHub 이미지 원본을 열람하거나 분석하는 코드가 아닙니다.
 * 복구: 기존 cover-photo.js 및 cover-config.json을 복원하면 단일 표지로 돌아갑니다. */
(async function(){
  'use strict';
  const photo=document.querySelector('img.cover-photo');
  if(!photo)return;
  const defaultImage=photo.getAttribute('src');
  const lastKey='wedding_last_cover_v1';
  photo.style.visibility='hidden';
  // 파일명만 검증합니다. 확장자는 대소문자를 구분하지 않습니다.
  function valid(path){
    return typeof path==='string' && /^assets\/[A-Za-z0-9_./-]+\.(?:jpe?g|png|webp)$/i.test(path) && !path.includes('..');
  }
  // 랜덤 순서를 한 번 만든 뒤, 직전 방문 사진만 첫 순서에서 제외합니다.
  function randomized(paths){
    const list=paths.slice();
    for(let i=list.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [list[i],list[j]]=[list[j],list[i]];
    }
    let last=null;
    try{last=localStorage.getItem(lastKey);}catch(error){/* 저장공간 거부 시 순수 랜덤 사용 */}
    if(list.length>1 && list[0]===last){
      const j=1+Math.floor(Math.random()*(list.length-1));
      [list[0],list[j]]=[list[j],list[0]];
    }
    return list;
  }
  function loadOne(path){
    return new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(path);
      img.onerror=()=>reject(new Error('cover preload failed: '+path));
      img.src=path;
    });
  }
  try{
    const response=await fetch('test_url_33/cover-config.json',{cache:'no-cache'});
    if(!response.ok)throw Error('cover config HTTP '+response.status);
    const cfg=await response.json();
    const candidates=Array.isArray(cfg.coverImages)?cfg.coverImages:[cfg.coverImage];
    const paths=[...new Set(candidates.filter(valid))];
    if(!paths.length)throw Error('no valid cover candidates');
    for(const path of randomized(paths)){
      try{
        await loadOne(path);
        photo.src=path;
        photo.style.visibility='visible';
        try{localStorage.setItem(lastKey,path);}catch(error){/* 저장공간 거부 시 기록만 생략 */}
        return;
      }catch(error){console.warn('cover skipped:',path);}
    }
    throw Error('all cover images unavailable');
  }catch(error){
    console.error('cover selection:',error);
    if(valid(defaultImage)){
      try{await loadOne(defaultImage);photo.src=defaultImage;photo.style.visibility='visible';}catch(e){console.error('default cover missing');}
    }
  }
})();
