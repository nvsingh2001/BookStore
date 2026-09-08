export function validateFullName(value) {
  if (!value.trim()) return 'Full name is required.'
  if (value.trim().length < 2) return 'Full name is too short.'
  return null
}

export function validateEmail(value) {
  if (!value.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.'
  return null
}

export function validatePassword(value) {
  if (!value) return 'Password is required.'
  if (value.length < 6) return 'Password must be atleast 6 characters'
  const hasLetter = /[a-zA-Z]/.test(value)
  const hasNumber = /[0-9]/.test(value)
  const hasSpecial = /[^a-zA-Z0-9]/.test(value)
  if (!hasLetter || !hasNumber || !hasSpecial) {
    return 'Password must includes a letter, a number, and a special character.'
  }
  return null
}

export function validatePhone(value) {
  if (!value.trim()) return 'Phone number is required.'
  if (!/^\d{10}$/.test(value)) return 'Enter a 10-digit phone number.'
  return null
}

export function validateConfirmPassword(password, confirmPassword) {
  if (confirmPassword !== password) return 'Passwords do not match'
}
