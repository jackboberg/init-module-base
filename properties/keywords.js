module.exports = ({ prompt, yes }) => yes ? '' : prompt('keywords', (s) => {
  if (!s) return undefined
  if (Array.isArray(s)) s = s.join(' ')
  if (typeof s !== 'string') return s

  return s.split(/[\s,]+/)
})
