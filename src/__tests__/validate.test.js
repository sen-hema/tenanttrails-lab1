import { describe, it, expect } from 'vitest'

// Extracted validate logic — mirrors the function in Login.jsx
function validate(email, password) {
  const e = {}
  if (!email.includes('@')) e.email = 'Please enter a valid email'
  if (password.length < 6) e.password = 'Password must be at least 6 characters'
  return e
}

describe('validate', () => {
  it('returns error for empty email', () => {
    const errors = validate('', 'password123')
    expect(errors.email).toBeDefined()
  })

  it('returns error for email without @', () => {
    const errors = validate('notanemail', 'password123')
    expect(errors.email).toBeDefined()
  })

  it('returns error for short password', () => {
    const errors = validate('test@dal.ca', 'abc')
    expect(errors.password).toBeDefined()
  })

  it('returns no errors for valid input', () => {
    const errors = validate('test@dal.ca', 'password123')
    expect(Object.keys(errors).length).toBe(0)
  })

  it('returns both errors when both fields are invalid', () => {
    const errors = validate('bademail', '123')
    expect(errors.email).toBeDefined()
    expect(errors.password).toBeDefined()
  })
})