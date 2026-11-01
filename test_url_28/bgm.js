/* 목적: 모바일 청첩장에 기존 레이아웃을 바꾸지 않고 배경음악을 추가합니다.
 * 기능: 최초 자동 재생 시도, 차단 시 첫 유효 탭/키 입력으로 재시도, 재생/정지, 무한 반복.
 * 입력: assets/audio/wedding-bgm.mp3; 출력: audio 재생 및 버튼 상태.
 * 영향: 음악과 보조 버튼만; 기존 지도/갤러리/캘린더/계좌 기능은 변경하지 않습니다.
 * 주의: iPhone 등은 소리 있는 자동 재생을 제한할 수 있습니다. 사용자가 정지하면 자동 재개하지 않습니다.
 * 롤백: bgm.js, bgm.css, audio 파일과 index.html의 관련 태그를 제거합니다. */
(function(){
 'use strict';
 const audio=document.getElementById('wedding-bgm'),button=document.getElementById('bgm-toggle');
 if(!audio||!button)return;
 let userPaused=false,autoplayFailed=false,firstGestureHandled=false;
 function sync(){
  const playing=!audio.paused;
  button.textContent=playing?'음악 정지':'음악 재생';
  button.classList.toggle('is-playing',playing);
  button.setAttribute('aria-pressed',String(playing));
  button.setAttribute('aria-label',playing?'배경음악 정지':'배경음악 재생');
 }
 function start(){
  if(userPaused)return Promise.resolve(false);
  try{return Promise.resolve(audio.play()).then(()=>{autoplayFailed=false;sync();return true;},()=>{autoplayFailed=true;sync();return false;});}
  catch(_){autoplayFailed=true;sync();return Promise.resolve(false);}
 }
 function firstGesture(event){
  if(firstGestureHandled||userPaused||!autoplayFailed)return;
  if(button.contains(event.target))return; // 버튼 자체의 클릭 동작은 아래 별도 처리합니다.
  firstGestureHandled=true;
  void start();
 }
 document.addEventListener('pointerdown',firstGesture,{capture:true});
 document.addEventListener('keydown',(event)=>{if(event.key==='Enter'||event.key===' ')firstGesture(event);},{capture:true});
 button.addEventListener('click',()=>{
  firstGestureHandled=true;
  if(!audio.paused){userPaused=true;audio.pause();sync();return;}
  userPaused=false;
  void start();
 });
 audio.addEventListener('play',sync);audio.addEventListener('pause',sync);audio.addEventListener('ended',sync);
 sync();
 // 브라우저가 허용하면 즉시 재생합니다. 차단되면 첫 유효 제스처를 기다립니다.
 void start();
})();