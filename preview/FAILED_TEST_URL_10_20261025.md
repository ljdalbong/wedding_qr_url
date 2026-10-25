# test_url_10 — failed full-package upload

Date: 2026-10-25
Requested: upload all 14 original files under test_url_10/ in one complete batch; then commit and verify.
Actual new attempt A12: extracted original map-location-schematic.svg bytes (683 bytes), Base64 encoded them, and called GitHub create_blob with encoding=base64.
Result: GitHub created blob SHA 2c376f1240b9881f4092de20f36206faaec29e67, identical to the original file Git blob SHA.
Remaining original content was not transferred. No 14-file tree was built; no test_url_10 commit was made. Published invitation file count: 0/14.
Previous failure methods were not retried; this was the first proven direct original-base64-to-GitHub-blob transfer for this asset.
Cumulative penalty entering attempt: 30/100. New identical-failure retries: 0. Current penalty: 30/100.
Do not count this evidence file as a wedding invitation asset.
