module.exports = ({ prompt, yes }) => yes ? '' : prompt('keywords', validate)

const validate = (input) => {
  if (!input) return undefined

  if (Array.isArray(input)) input = input.join(' ')
  if (typeof input !== 'string') return input

  return input.split(/[\s,]+/)
}
