const { readDeps } = require('../lib')

module.exports = ({ config, dirname, package: pkg }) => {
  return readDeps(config, dirname, false, pkg.devDependencies || {})
}
