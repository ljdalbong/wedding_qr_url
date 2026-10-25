# test_url_13 — full 14-file publication not achieved

Date: 2026-10-25
Folder: test_url_13/
Required: exact 14 files from approved wedding archive published together, followed by commit and remote SHA verification.
Actual: 0/14 wedding assets published; no test_url_13 publication commit created.
Source archive has 14 entries; it includes 5 JPGs, PNG, WOFF2 and Leaflet assets. Direct container HTTPS access timed out on DNS resolution. The authenticated GitHub connector writes content supplied as strings, but local archive bytes were not bridged to a single 14-file upload. No fake binary, placeholder, or SHA-only tree was attempted.
Repeated failed method: network DNS diagnostic was previously known to fail; retry was made without changing environment. Penalty +10. Previous total 40/100, new total 50/100.
This is failure evidence only, excluded from website upload count.
Next method proposal: execute a code-capable authenticated GitHub workflow that can consume original archive bytes, create all 14 Blob objects before a single branch update; do not repeat DNS test, sha-only tree, or per-file commit.
