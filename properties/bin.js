const { readdir } = require('fs')
const { resolve } = require('path')

module.exports = ({ dirname }) => (done) => {
  readdir(resolve(dirname, 'bin'), (er, dir) => {
    // no bins
    if (er) return done()

    // just take the first js file we find there, or nada
    return done(null, dir.filter((f) => f.match(/\.js$/))[0])
  })
}
