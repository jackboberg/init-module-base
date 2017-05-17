module.exports = ({ config, prompt, yes }) => {
  const conf = (name) => config.get(name) || config.get(name.split('.').join('-'))
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
