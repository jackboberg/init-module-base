const validateLicense = require('validate-npm-package-license')

const validate = (data) => {
  const its = validateLicense(data)

  if (its.validForNewPackages) return data

  const errors = (its.errors || []).concat(its.warnings || [])
  const er = new Error('Sorry, ' + errors.join(' and ') + '.')
  er.notValid = true

  return er
}

module.exports = ({ config, package: pkg, prompt, yes }) => {
  const conf = (name) => config.get(name) || config.get(name.split('.').join('-'))
  const license = pkg.license || conf('init.license') || 'ISC'

  return yes ? license : prompt('license', license, validate)
}
