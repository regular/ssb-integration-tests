const crypto = require('crypto')
const {join} = require('path')

const caps = crypto.randomBytes(32).toString('base64')
const port = Math.floor(50000 + 15000 * Math.random())

console.log(JSON.stringify({
  caps: {shs: caps},
  port,
  ws: {port: port + 1}
}, null, 2))
