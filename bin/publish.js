#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const pull = require('pull-stream')
const ssbClient = require('ssb-client')
const createConfig = require('ssb-config/inject')
const ssbKeys = require('ssb-keys')

if (process.argv.length < 4) {
  console.error('Usage: publish report details')
  process.exit(1)
}

const [_,__, report, details] = process.argv

const config = createConfig('ssb')
const keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

let text = fs.readFileSync(report, 'utf8')
const log = fs.readFileSync(details)

ssbClient(keys, config, (err, ssb) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  pull(
    pull.once(log),
    ssb.blobs.add(function (err, blobid) {
      if (err || !blobid) {
        console.error(err)
        process.exit(1)
      }
      console.log('finished uploading blob, id:', blobid)
      text += '\n\nDetailed log: ' + blobid
      ssb.publish({
        type: 'post',
        text,
        channel: "ssb",
        mentions: [{
          link: blobid,
          name: 'detailed log',
          type: 'text/plain',
          size: log.length
        }, {
          link: '#ssb-integration-tests'
        }]
      }, (err, msg) => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
        console.log('Published as', msg.key)
        process.exit(0)
      })
    })
  )
})

