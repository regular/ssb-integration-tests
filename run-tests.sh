#!/bin/bash
set -ex -o pipefail
rm -rf node_modules package-lock.json || true
npm i
cat > report.md <<EOF
Integration Test Report
===

for
\`\`\`
$(npm ls ssb-client scuttlebot-release)
\`\`\`

---

$(npm run test-summary)

EOF



