# test_url_14 — forensic evidence of failed 14-asset publication

Date (KST): 2026-10-25
Target repository: ljdalbong/wedding_qr_url
Target directory: test_url_14/
Required: all 14 original approved mobile wedding assets in ONE publication commit.

## Verified source
A local 14-file archive exists at /mnt/data/wedding_GITHUB_PREVIEW_READY_20261025.zip, containing 2,462,558 bytes of raw files. File SHA-1 values were computed as Git blobs locally.

## Actual GitHub calls this attempt
1. GET refs/heads/main via authenticated GitHub fetch: returned head 1a52da3eb4b367f3c58de4c2b8e1fb9b47db62f7.
2. GitHub get_repo: push permission true.
3. GitHub tool schema inspected: create_blob requires content:string, utf-8 or base64. No local-file-path/file-id argument.

## Failure
No call containing all 14 original file byte strings could be made. Local container bytes cannot be referenced by the authenticated tool call in the same execution environment. No Git Tree, no published commit, and no 14-file upload occurred. Do NOT claim GitHub rejected an upload: there was no full upload call.
The previous missing-blob-SHA HTTP 422 method was NOT retried.

This file is the mandatory fallback evidence, not a wedding asset. It does not count toward 14.
Cumulative penalty entering attempt: 50/100. Whether +10 applies for not attempting a complete upload should be assessed under the user's no-real-attempt rule, not concealed.
Source and forensic materials will be provided in a ZIP for Claude review.
