const fs = require('fs')
const path = require('path')

// more popular packages should go here, maybe?
const isTestPkg = (p) => {
  return !!p.match(/^(expresso|mocha|tap|coffee-script|coco|streamline)$/)
}

module.exports = (config, dirname, test, excluded) => (cb) => {
  const conf = (name) => config.get(name) || config.get(name.split('.').join('-'))

  fs.readdir('node_modules', (er, dir) => {
    if (er) return cb()

    const deps = {}
    let n = dir.length

    if (n === 0) return cb(null, deps)

    const next = () => {
      if (--n === 0) return cb(null, deps)
    }

    dir.forEach((d) => {
      if (d.match(/^\./)) return next()
      if (test !== isTestPkg(d) || excluded[d]) return next()

      const dp = path.join(dirname, 'node_modules', d, 'package.json')

      fs.readFile(dp, 'utf8', (er, p) => {
        if (er) return next()

        try { p = JSON.parse(p) } catch (e) { return next() }

        if (!p.version) return next()
        if (p._requiredBy) {
          if (!p._requiredBy.some((req) => req === '#USER')) return next()
        }

        deps[d] = conf('save.exact')
          ? p.version
          : conf('save.prefix') + p.version

        return next()
      })
    })
  })
}
