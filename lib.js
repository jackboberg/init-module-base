const Series = require('run-series')
const { readdir } = require('fs')
const { join } = require('path')
const { readFile } = require('jsonfile')

const configGetter = exports.configGetter = (config) => (name) => {
  return config.get(name) || config.get(name.split('.').join('-'))
}

exports.readDeps = (config, dirname, dev, excluded) => (done) => {
  const conf = configGetter(config)

  readdir('node_modules', (er, modules) => {
    if (er) return done()

    const tasks = modules.map((module) => (next) => {
      if (module.match(/^\./)) return next()
      if (dev !== isDevPkg(module) || excluded[module]) return next()

      const path = join(dirname, 'node_modules', module, 'package.json')

      readFile(path, 'utf8', (er, pkg) => {
        if (er || !shouldInclude(pkg)) return next()

        const version = conf('save.exact')
          ? pkg.version
          : conf('save.prefix') + pkg.version

        return next(null, { [module]: version })
      })
    })

    Series(tasks, (er, results) => done(er, Object.assign({}, ...results)))
  })
}

const shouldInclude = (pkg) => {
  if (!pkg.version) return false
  if (pkg._requiredBy) return pkg._requiredBy.some((req) => req === '#USER')

  return true
}

// more popular packages should go here, maybe?
const isDevPkg = (p) => {
  return !!p.match(/^(expresso|mocha|tap|coffee-script|coco|streamline)$/)
}
