/* global config, yes, dirname, basename, prompt */
// defined but not used: filename
// standard.js complains about reserved words
var { package: pkg } = this

const fs = require('fs')
const path = require('path')
const validateLicense = require('validate-npm-package-license')
const validateName = require('validate-npm-package-name')
const npa = require('npm-package-arg')
const semver = require('semver')

// more popular packages should go here, maybe?
const isTestPkg = (p) => {
  return !!p.match(/^(expresso|mocha|tap|coffee-script|coco|streamline)$/)
}

const niceName = (n) => n.replace(/^node-|[.-]js$/g, '').toLowerCase()

const conf = (name) => config.get(name) || config.get(name.split('.').join('-'))

const readDeps = (test, excluded) => (cb) => {
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

let name = pkg.name || basename
let scope = conf('scope')

if (scope) {
  const spec = npa(name)

  if (scope.charAt(0) !== '@') scope = '@' + scope
  if (spec.scope) name = scope + '/' + spec.name.split('/')[1]
  else name = scope + '/' + name
}

exports.name = yes
  ? name
  : prompt('package name', niceName(name), (data) => {
    const its = validateName(data)

    if (its.validForNewPackages) return data

    const errors = (its.errors || []).concat(its.warnings || [])
    const er = new Error('Sorry, ' + errors.join(' and ') + '.')
    er.notValid = true

    return er
  })

const version = pkg.version || conf('init.version') || '1.0.0'

exports.version = yes
  ? version
  : prompt('version', version, (version) => {
    if (semver.valid(version)) return version

    const er = new Error('Invalid version: "' + version + '"')
    er.notValid = true

    return er
  })

if (!pkg.description) exports.description = yes ? '' : prompt('description')

if (!pkg.main) {
  exports.main = (cb) => {
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
}

if (!pkg.bin) {
  exports.bin = (cb) => {
    fs.readdir(path.resolve(dirname, 'bin'), (er, d) => {
      // no bins
      if (er) return cb()

      // just take the first js file we find there, or nada
      return cb(null, d.filter((f) => f.match(/\.js$/))[0])
    })
  }
}

exports.directories = (cb) => {
  fs.readdir(dirname, (er, dirs) => {
    if (er) return cb(er)

    let res = {}

    dirs.forEach((d) => {
      switch (d) {
        /* eslint-disable no-return-assign */
        case 'example': case 'examples': return res.example = d
        case 'test': case 'tests': return res.test = d
        case 'doc': case 'docs': return res.doc = d
        case 'man': return res.man = d
        case 'lib': return res.lib = d
        /* eslint-enable no-return-assign */
      }
    })

    if (Object.keys(res).length === 0) res = undefined

    return cb(null, res)
  })
}

if (!pkg.dependencies) {
  exports.dependencies = readDeps(false, pkg.devDependencies || {})
}

if (!pkg.devDependencies) {
  exports.devDependencies = readDeps(true, pkg.dependencies || {})
}

// MUST have a test script!
const s = pkg.scripts || {}
const notest = 'echo "Error: no test specified" && exit 1'

if (!pkg.scripts) {
  exports.scripts = (cb) => {
    fs.readdir(path.join(dirname, 'node_modules'), (er, d) => {
      setupScripts(d || [], cb)
    })
  }
}

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

if (!pkg.repository) {
  exports.repository = (cb) => {
    fs.readFile('.git/config', 'utf8', (er, gconf) => {
      if (er || !gconf) return cb(null, yes ? '' : prompt('git repository'))

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

      return cb(null, yes ? u : prompt('git repository', u))
    })
  }
}

if (!pkg.keywords) {
  exports.keywords = yes ? '' : prompt('keywords', (s) => {
    if (!s) return undefined
    if (Array.isArray(s)) s = s.join(' ')
    if (typeof s !== 'string') return s

    return s.split(/[\s,]+/)
  })
}

if (!pkg.author) {
  const a = conf('init.author.name')

  exports.author = a
    ? {
      'name': a,
      'email': conf('init.author.email'),
      'url': conf('init.author.url')
    }
    : yes
      ? ''
      : prompt('author')
}

const license = pkg.license || conf('init.license') || 'ISC'

exports.license = yes
  ? license
  : prompt('license', license, (data) => {
    const its = validateLicense(data)

    if (its.validForNewPackages) return data

    const errors = (its.errors || []).concat(its.warnings || [])
    const er = new Error('Sorry, ' + errors.join(' and ') + '.')
    er.notValid = true

    return er
  })
