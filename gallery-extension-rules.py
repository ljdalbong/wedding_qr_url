#!/usr/bin/env python3
# 목적: 갤러리 사진 확장자 규칙을 수동 지정해 001~099 중 존재하는 사진만 자동 등록합니다.
# 기능: 범위/개별 혼합 입력, 개별 지정 우선, 번호순 정렬, 존재 파일 검증, JSON 생성.
# 입력: assets/gallery/ 아래의 001.jpg~099.webp 및 EXTENSION_RULES.
# 출력: gallery-config.json; 이 파일을 GitHub에 함께 게시하면 기존 갤러리에서 자동 표시합니다.
# 영향/주의: 갤러리 사진 목록만 변경하며 기존 디자인은 변경하지 않습니다. 신규 사진은 별도로 GitHub에 올려야 합니다.
# 롤백: 기존 gallery-config.json을 GitHub에서 복원하면 됩니다.
from pathlib import Path
import json, re

# ===== 사용자가 직접 수정할 부분 (코드 제일 위) =====
# 범위와 개별 번호를 섞어 쓸 수 있으며, 번호 개별 지정이 범위 지정보다 항상 우선합니다.
# 예시: '001~010': 'jpg', '005,007': 'png' => 005,007은 png, 나머지는 jpg.
# 001~099 범위를 벗어난 번호는 허용하지 않습니다.
EXTENSION_RULES = {
    '001~003': 'jpg',
    '002': 'png',
    '003': 'jpeg',
}
# ===== 사용자 수정 영역 끝 =====

SUPPORTED = {'jpg', 'jpeg', 'png', 'webp'}
ROOT = Path(__file__).resolve().parent
GALLERY = ROOT / 'assets' / 'gallery'

def generate():
    by_number = {}
    singles = {}
    ranges = {}
    for raw_keys, raw_ext in EXTENSION_RULES.items():
        ext = raw_ext.strip().lower().lstrip('.')
        if ext not in SUPPORTED:
            raise ValueError(f'지원하지 않는 확장자: {raw_ext}')
        # 쉼표로 이어진 번호 또는 번호 범위 모두 지원합니다.
        for raw_token in raw_keys.split(','):
            token = raw_token.strip()
            if '~' in token:
                match = re.fullmatch(r'(\d{1,3})\s*~\s*(\d{1,3})', token)
                if not match: raise ValueError(f'잘못된 범위: {token}')
                start, end = map(int, match.groups())
                if not (1 <= start <= end <= 99): raise ValueError(f'범위는 001~099까지만: {token}')
                for n in range(start,end+1):
                    if n in ranges and ranges[n] != ext:
                        raise ValueError(f'중복 범위 확장자 충돌: {n:03}')
                    ranges[n] = ext
            else:
                if not re.fullmatch(r'\d{1,3}', token): raise ValueError(f'잘못된 번호: {token}')
                n = int(token)
                if not (1 <= n <= 99): raise ValueError(f'번호는 001~099까지만: {token}')
                if n in singles and singles[n] != ext: raise ValueError(f'개별 지정 중복: {n:03}')
                singles[n] = ext
    by_number.update(ranges)
    by_number.update(singles)  # 가장 마지막에 개별 지정 => 범위보다 높은 우선순위
    photos = []
    for n, ext in sorted(by_number.items()):
        stem = f'{n:03}'
        candidate = GALLERY / f'{stem}.{ext}'
        # 같은 번호로 여러 확장자가 실제 존재할 경우 잘못된 파일이 남았을 수 있어 중단합니다.
        matched = [f for f in GALLERY.glob(stem + '.*') if f.suffix.lower().lstrip('.') in SUPPORTED]
        if len(matched) > 1:
            raise ValueError(f'동일 번호의 사진이 2개 이상 존재합니다: {stem}')
        if candidate.is_file():
            photos.append({'src':f'assets/gallery/{candidate.name}','alt':f'갤러리 사진 {stem}'})
        elif matched:
            raise ValueError(f'{stem} 확장자 지정은 .{ext}이지만 실제 파일은 {matched[0].suffix}입니다')
    # 명시한 번호 이외에 이미지가 남아 있다면 실수 누락 여부를 확인하도록 오류로 처리합니다.
    registered = {int(Path(item['src']).stem) for item in photos}
    for file in GALLERY.iterdir():
        if not file.is_file() or file.suffix.lower().lstrip('.') not in SUPPORTED: continue
        if not re.fullmatch(r'\d{3}', file.stem): continue  # 기존 photo-01.jpg 등은 원본 유지
        num = int(file.stem)
        if not (1 <= num <= 99) or num not in registered:
            raise ValueError(f'확장자 규칙 누락 또는 번호 범위 초과: {file.name}')
    (ROOT / 'gallery-config.json').write_text(json.dumps({'photos':photos},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    return photos
if __name__ == '__main__':
    items = generate()
    print(f'갤러리 등록: {len(items)}장', [p['src'] for p in items])