set -eu -o pipefail
PATH=../../bin:../../node_modules/.bin:${PATH}

function sbot_server () {
  rm -rf .ssb || true
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
export ws_address="$(local-sbot ws.getAddress | tr -d '"')"
browserify index.js -t brfs -t envify| timeout 3s browser-run
