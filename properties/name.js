const npa = require('npm-package-arg')
const validateName = require('validate-npm-package-name')
const { configGetter } = require('../lib')

module.exports = ({ basename, config, package: pkg, prompt, yes }) => {
  const conf = configGetter(config)
  let name = pkg.name || basename
  let scope = conf('scope')

  if (scope) name = scopedName(name, scope)

  return yes ? name : prompt('package name', niceName(name), validate)
}

const scopedName = (name, scope) => {
  const spec = npa(name)

  if (spec.scope) name = spec.name.split('/')[1]
  if (scope.charAt(0) !== '@') scope = `@${scope}`

  return `${scope}/${name}`
}

const niceName = (name) => name.replace(/^node-|[.-]js$/g, '').toLowerCase()

const validate = (input) => {
  const its = validateName(input)

  if (its.validForNewPackages) return input

  const errors = (its.errors || []).concat(its.warnings || [])
  const er = new Error(`Sorry, ${errors.join(' and ')}.`)
  er.notValid = true

  return er
}
