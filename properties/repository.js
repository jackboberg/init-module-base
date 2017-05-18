const { readFile } = require('fs')

module.exports = ({ yes, prompt }) => (done) => {
  readFile('.git/config', 'utf8', (er, gconf) => {
    if (er || !gconf) return done(null, yes ? '' : prompt('git repository'))

    gconf = gconf.split(/\r?\n/)
    const i = gconf.indexOf('[remote "origin"]')

    if (i !== -1) {
      var u = gconf[i + 1]

      if (!u.match(/^\s*url =/)) u = gconf[i + 2]
      if (!u.match(/^\s*url =/)) u = null
      else u = u.replace(/^\s*url = /, '')
    }

    if (u && u.match(/^git@github.com:/)) {
      u = u.replace(/^git@github.com:/, 'https://github.com/')
    }

    return done(null, yes ? u : prompt('git repository', u))
  })
}
