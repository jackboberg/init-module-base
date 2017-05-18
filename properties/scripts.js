const { readdir } = require('fs')
const { join } = require('path')

const notest = 'echo "Error: no test specified" && exit 1'

module.exports = (state) => (done) => {
  const { dirname, package: { scripts = {} }, prompt, yes } = state

  readdir(join(dirname, 'node_modules'), (er, modules = []) => {
    // MUST have a test script!
    if (!scripts.test || scripts.test === notest) {
      const test = getTestScript(modules)

      if (yes) scripts.test = test || notest
      else {
        const ps = 'test command'
        scripts.test = test ? prompt(ps, test, validate) : prompt(ps, validate)
      }
    }

    return done(null, scripts)
  })
}

const getTestScript = (modules) => {
  // check to see what framework is in use, if any
  const scripts = {
    'tap': 'tap test/*.js',
    'expresso': 'expresso test',
    'mocha': 'mocha'
  }
  const module = Object.keys(scripts).find((m) => modules.includes(m))

  return scripts[module]
}

const validate = (input) => input || notest
