const { readdir } = require('fs')

module.exports = ({ basename, dirname, prompt, yes }) => (done) => {
  readdir(dirname, (er, files) => {
    if (er) files = []

    const defaults = ['index.js', 'main.js', `${basename}.js`]
    let jsFiles = files.filter((f) => f.match(/\.js$/))
    let main = defaults.find((f) => jsFiles.includes(f))

    main = main || jsFiles[0] || 'index.js'

    return done(null, yes ? main : prompt('entry point', main))
  })
}
