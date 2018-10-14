const fs = require('fs')
const ssbClient = require('ssb-client')
const test = require('tape')

const keys = {
  "curve": "ed25519",
  "public": "wG5OMERWGJ2DH/PXJoIIZtOBtZwSmLtpa+JB3kno3N8=.ed25519",
  "private": "Xa1rEjMWYurTdp0V2FZGMw02r8fuotTqXIzppm+HhpPAbk4wRFYYnYMf89cmgghm04G1nBKYu2lr4kHeSejc3w==.ed25519",
  "id": "@wG5OMERWGJ2DH/PXJoIIZtOBtZwSmLtpa+JB3kno3N8=.ed25519"
}

const opts = JSON.parse(fs.readFileSync('./.ssbrc'))
opts.manifest = JSON.parse(fs.readFileSync(__dirname + '/.ssb/manifest.json'))
const pubkey = keys.id.slice(1).replace(`.${keys.curve}`, '')
opts.remote = process.env.remote
//console.log(opts)

test('connect to sbot via ws and shs (master)', t => {
  t.ok(opts.remote, 'getAddress() retunred something')
  ssbClient(keys, opts, (err, ssb) => {
    t.error(err, 'ssb-client does not error')
    t.ok(ssb, 'ssb-client calls cb with API object')
    ssb.whoami( (err, feed) => {
      t.error(err, 'priviidged method ssb.whoami does not error')
      t.ok(feed.id)
      t.notEqual(feed.id, keys.id, 'ssb.whoami returns sbot public key')
      t.end()
      window.close()
    }) 
  })
})
