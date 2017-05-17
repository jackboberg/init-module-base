const { configGetter } = require('../lib')

module.exports = ({ config, prompt, yes }) => {
  const conf = configGetter(config)
  const a = conf('init.author.name')

  return a
    ? {
      'name': a,
      'email': conf('init.author.email'),
      'url': conf('init.author.url')
    }
    : yes
      ? ''
      : prompt('author')
}
