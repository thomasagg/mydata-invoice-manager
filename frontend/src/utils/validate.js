export function isValidAfm(afm) {
  if (!/^\d{9}$/.test(afm)) return false
  const d = afm.split('').map(Number)
  let sum = 0
  for (let i = 0; i < 8; i++) sum += d[i] * Math.pow(2, 8 - i)
  return sum % 11 % 10 === d[8]
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateField(name, value) {
  if (!value && value !== 0) return 'Required'
  if (name === 'username') {
    if (value.length < 3) return 'At least 3 characters'
    if (/\s/.test(value)) return 'No spaces allowed'
  }
  if (name === 'password' && value.length < 6) return 'At least 6 characters'
  if (name === 'email' && !isValidEmail(value)) return 'Invalid email address'
  if (name === 'afm' && !isValidAfm(value)) return 'Invalid AFM (must be 9 digits)'
  return null
}
