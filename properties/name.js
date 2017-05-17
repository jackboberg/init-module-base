const npa = require('npm-package-arg')
const validateName = require('validate-npm-package-name')
const { configGetter } = require('../lib')

const niceName = (n) => n.replace(/^node-|[.-]js$/g, '').toLowerCase()

const validate = (data) => {
  const its = validateName(data)

  if (its.validForNewPackages) return data

  const errors = (its.errors || []).concat(its.warnings || [])
  const er = new Error('Sorry, ' + errors.join(' and ') + '.')
  er.notValid = true

  return er
}

module.exports = ({ basename, config, package: pkg, prompt, yes }) => {
  const conf = configGetter(config)
  let name = pkg.name || basename
  let scope = conf('scope')

  if (scope) {
    const spec = npa(name)

    if (scope.charAt(0) !== '@') scope = '@' + scope
    if (spec.scope) name = scope + '/' + spec.name.split('/')[1]
    else name = scope + '/' + name
  }

  return yes ? name : prompt('package name', niceName(name), validate)
}
