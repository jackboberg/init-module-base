const semver = require('semver')
const { configGetter } = require('../lib')

const validate = (data) => {
  if (semver.valid(data)) return data

  const er = new Error('Invalid version: "' + data + '"')
  er.notValid = true

  return er
}

module.exports = ({ config, package: pkg, prompt, yes }) => {
  const conf = configGetter(config)
  const version = pkg.version || conf('init.version') || '1.0.0'

  return yes ? version : prompt('version', version, validate)
}
