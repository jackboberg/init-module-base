const fs = require('fs')
const path = require('path')

module.exports = ({ dirname }) => (cb) => {
  fs.readdir(path.resolve(dirname, 'bin'), (er, d) => {
    // no bins
    if (er) return cb()

    // just take the first js file we find there, or nada
    return cb(null, d.filter((f) => f.match(/\.js$/))[0])
  })
}
