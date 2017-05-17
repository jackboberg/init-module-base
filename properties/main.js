const fs = require('fs')

module.exports = ({ basename, dirname, prompt, yes }) => (cb) => {
  fs.readdir(dirname, (er, f) => {
    if (er) f = []

    f = f.filter((f) => f.match(/\.js$/))

    if (f.indexOf('index.js') !== -1) f = 'index.js'
    else if (f.indexOf('main.js') !== -1) f = 'main.js'
    else if (f.indexOf(basename + '.js') !== -1) f = basename + '.js'
    else f = f[0]

    const index = f || 'index.js'

    return cb(null, yes ? index : prompt('entry point', index))
  })
}
