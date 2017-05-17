const semver = require('semver')

const validate = (data) => {
  if (semver.valid(data)) return data

  const er = new Error('Invalid version: "' + data + '"')
  er.notValid = true

  return er
}

module.exports = ({ config, package: pkg, prompt, yes }) => {
  const conf = (name) => config.get(name) || config.get(name.split('.').join('-'))
  const version = pkg.version || conf('init.version') || '1.0.0'

  return yes ? version : prompt('version', version, validate)
}
