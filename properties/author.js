const { configGetter } = require('../lib')

module.exports = ({ config, prompt, yes }) => {
  const conf = configGetter(config)
  const name = conf('init.author.name')
  const email = conf('init.author.email')
  const url = conf('init.author.url')

  if (name) return { name, email, url }

  return yes ? '' : prompt('author')
}
