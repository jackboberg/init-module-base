const { readdir } = require('fs')

module.exports = ({ dirname }) => (done) => {
  readdir(dirname, (er, dirs) => {
    if (er) return done(er)

    let directories = dirs.reduce(addDirectory, {})
    if (Object.keys(directories).length === 0) directories = undefined

    return done(null, directories)
  })
}

const addDirectory = (acc, dir) => {
  switch (dir) {
    case 'example': case 'examples': return Object.assign(acc, { example: dir })
    case 'test': case 'tests': return Object.assign(acc, { test: dir })
    case 'doc': case 'docs': return Object.assign(acc, { doc: dir })
    case 'man': return Object.assign(acc, { man: dir })
    case 'lib': return Object.assign(acc, { lib: dir })
  }

  return acc
}
