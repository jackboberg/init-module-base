const readDeps = require('../lib/read-deps')

module.exports = ({ config, dirname, package: pkg }) => {
  return readDeps(config, dirname, true, pkg.dependencies || {})
}
