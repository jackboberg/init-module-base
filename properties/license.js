const validateLicense = require('validate-npm-package-license')
const { configGetter } = require('../lib')

module.exports = ({ config, package: pkg, prompt, yes }) => {
  const conf = configGetter(config)
  const license = pkg.license || conf('init.license') || 'ISC'

  return yes ? license : prompt('license', license, validate)
}

const validate = (input) => {
  const its = validateLicense(input)

  if (its.validForNewPackages) return input

  const errors = (its.errors || []).concat(its.warnings || [])
  const er = new Error(`Sorry, ${errors.join(' and ')}.`)
  er.notValid = true

  return er
}
