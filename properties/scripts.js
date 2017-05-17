const fs = require('fs')
const path = require('path')

module.exports = ({ dirname, package: pkg, prompt, yes }) => (cb) => {
  // MUST have a test script!
  const s = pkg.scripts || {}
  const notest = 'echo "Error: no test specified" && exit 1'

  const setupScripts = (d, cb) => {
    // check to see what framework is in use, if any
    const tx = (test) => test || notest

    if (!s.test || s.test === notest) {
      const ps = 'test command'
      const commands = {
        'tap': 'tap test/*.js',
        'expresso': 'expresso test',
        'mocha': 'mocha'
      }
      let command

      Object.keys(commands).forEach((k) => {
        if (d.indexOf(k) !== -1) command = commands[k]
      })

      if (yes) s.test = command || notest
      else s.test = command ? prompt(ps, command, tx) : prompt(ps, tx)
    }

    return cb(null, s)
  }

  fs.readdir(path.join(dirname, 'node_modules'), (er, d) => {
    setupScripts(d || [], cb)
  })
}
