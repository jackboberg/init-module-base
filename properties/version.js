const semver = require('semver')
const { configGetter } = require('../lib')

module.exports = ({ config, package: pkg, prompt, yes }) => {
  const conf = configGetter(config)
  const version = pkg.version || conf('init.version') || '1.0.0'

  return yes ? version : prompt('version', version, validate)
}

const validate = (input) => {
  if (semver.valid(input)) return input

  const er = new Error(`Invalid version: "${input}"`)
  er.notValid = true

  return er
}
