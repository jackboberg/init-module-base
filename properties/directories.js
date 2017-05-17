const fs = require('fs')

module.exports = ({ dirname }) => (cb) => {
  fs.readdir(dirname, (er, dirs) => {
    if (er) return cb(er)

    let res = {}

    dirs.forEach((d) => {
      switch (d) {
        /* eslint-disable no-return-assign */
        case 'example': case 'examples': return res.example = d
        case 'test': case 'tests': return res.test = d
        case 'doc': case 'docs': return res.doc = d
        case 'man': return res.man = d
        case 'lib': return res.lib = d
        /* eslint-enable no-return-assign */
      }
    })

    if (Object.keys(res).length === 0) res = undefined

    return cb(null, res)
  })
}
