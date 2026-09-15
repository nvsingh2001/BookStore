import { useState } from 'react'
import { admin as adminApi } from '../../api/admin'
import { useToast } from '../../context/ToastContext'
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from '../../lib/validation'
import Button from '../../components/Button'

const emptyFields = { fullName: '', email: '', password: '', phone: '' }

export default function AdminCreateAdmin() {
  const showToast = useToast()
  const [fields, setFields] = useState(emptyFields)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function updateField(name, value) {
    setFields((f) => ({ ...f, [name]: value }))
  }

  function validate() {
    const next = {
      fullName: validateFullName(fields.fullName),
      email: validateEmail(fields.email),
      password: validatePassword(fields.password),
      phone: validatePhone(fields.phone),
    }
    setErrors(next)
    return Object.values(next).every((error) => !error)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await adminApi.register(fields)
      showToast('Admin account created.')
      setFields(emptyFields)
      setErrors({})
    } catch (err) {
      showToast(err.message ?? 'Could not create admin account.', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: '480px' }}>
      <h1 className="h3 mb-4">Add Admin</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            id="fullName"
            className="form-control"
            value={fields.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
          />
          {errors.fullName && <div className="text-danger small">{errors.fullName}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={fields.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          {errors.email && <div className="text-danger small">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            id="phone"
            className="form-control"
            value={fields.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          {errors.phone && <div className="text-danger small">{errors.phone}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={fields.password}
            onChange={(e) => updateField('password', e.target.value)}
          />
          {errors.password && <div className="text-danger small">{errors.password}</div>}
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Admin'}
        </Button>
      </form>
    </div>
  )
}
