const pkg = this.package

const insertUnless = (condition, ...elements) => condition ? [] : elements

const properties = [
  'name',
  'version',
  ...insertUnless(pkg.description, 'description'),
  ...insertUnless(pkg.main, 'main'),
  ...insertUnless(pkg.bin, 'bin'),
  'directories',
  ...insertUnless(pkg.dependencies, 'dependencies'),
  ...insertUnless(pkg.devDependencies, 'devDependencies'),
  ...insertUnless(pkg.scripts, 'scripts'),
  ...insertUnless(pkg.repository, 'repository'),
  ...insertUnless(pkg.keywords, 'keywords'),
  ...insertUnless(pkg.author, 'author'),
  'license'
]

const addProperty = (properties, name) => {
  const property = { [name]: require(`./properties/${name}`)(this) }

  return Object.assign(properties, property)
}

module.exports = properties.reduce(addProperty, {})
