#!/bin/bash
set -eu -o pipefail
PATH=../../bin:../../node_modules/.bin:${PATH}

function sbot_server () {
  #rm -rf .ssb || true
  rm sbot.log || true
  local-sbot server >sbot.log 2>&1 &
  echo $!
  sleep 1
}

function cleanup () {
  (( ${sbot_pid} )) && kill ${sbot_pid}
}

trap cleanup EXIT
sbot_pid=$(sbot_server)
export remote="$(local-sbot getAddress | tr -d '"')"
echo "remote ${remote} $?"
rm .err 2>/dev/null || true
browserify index.js -t brfs -t envify| timeout 10s browser-run | tee >(grep Error | cat > .err)
[[ -f .err ]] && echo "not ok 0 $(cat .err|head -n1)" && exit 1
