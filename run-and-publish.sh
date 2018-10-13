set -eu -o pipefail

mv report.md old_report.md || true
./run-tests.sh
if ! diff report.md old_report.md; then
  echo "Publishing ..."
  npm t > details.txt
  ssb_appname=ssb node bin/publish.js report.md details.txt  
fi

