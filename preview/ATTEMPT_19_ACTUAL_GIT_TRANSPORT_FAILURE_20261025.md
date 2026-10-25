# Attempt 19 — actual Git transport execution evidence (2026-10-25)

## Objective
Upload all 14 exact approved source paths under `test_url_19/` as a single commit. No partial publication; no original source byte edits.

## Actual executed Git commands and results
- `git init -b main`: exit 0
- `git config user.name "Wedding Upload Execution"`: exit 0
- `git config user.email "wedding-execution@users.noreply.github.com"`: exit 0
- `git remote add origin https://github.com/ljdalbong/wedding_qr_url.git`: exit 0
- `git fetch --depth=1 origin main`: **exit 128**

### Git stderr (verbatim)
```text
fatal: unable to access 'https://github.com/ljdalbong/wedding_qr_url.git/': Could not resolve host: github.com
```

## Input/source evidence
- Source ZIP: `source/APPROVED_14_FILES_UNMODIFIED.zip` extracted from the cumulative V18 handover archive.
- All 14 path bytes individually verified against `checks/APPROVED_14_MANIFEST.json` using Git Blob SHA-1 prior to writing local `test_url_19/` files; 14/14 matched.
- Local staging folder: `/mnt/data/wedding_attempt19/test_url_19/` (not remotely reachable).
- No local commit was created because the current origin/main could not be fetched safely.
- No `git push` was executed. No GitHub Git Blob API write for the approved source was executed.

## Classification
- Git transport **attempted** (fetch command did execute); GitHub refused no bytes. DNS resolution failed in the local runtime before authenticated transport.
- **Original invitation upload 0/14**. Do not claim that this proves the GitHub Blob API rejects large files.
- Same technical DNS failure class as past R1, despite use of a new isolated working container. Repeating identical DNS commands again without a verified connectivity change is prohibited.
- This document is audit evidence only, not the requested invitation upload.

## Reproducible artifact
`ATTEMPT_19_GIT_EXECUTION_EVIDENCE.json` is included in the updated cumulative archive and contains each command, return code and output. The original 14 files were not modified.
