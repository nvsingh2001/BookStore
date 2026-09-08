import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '../context/ToastContext'
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from '../lib/validation'
import { login, register } from '../features/auth/authSlice'
import Modal from './Modal'
import Button from './Button'

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login')
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const status = useSelector((state) => state.auth.status)
  const showToast = useToast()

  function updateField(name, value) {
    setFields((f) => ({ ...f, [name]: value }))
  }

  function validateLogin() {
    const next = { email: validateEmail(fields.email), password: validatePassword(fields.password) }
    setErrors(next)
    return !next.email && !next.password
  }

  function validateSignup() {
    const next = {
      fullName: validateFullName(fields.fullName),
      email: validateEmail(fields.email),
      phone: validatePhone(fields.phone),
      password: validatePassword(fields.password),
      confirmPassword: validateConfirmPassword(fields.password, fields.confirmPassword),
    }
    setErrors(next)
    return Object.values(next).every((error) => !error)
  }

  async function handleLogin(e) {
    e.preventDefault()
    if (!validateLogin()) return
    try {
      await dispatch(login({ email: fields.email, password: fields.password })).unwrap()
      showToast('Logged in successfully')
      onClose()
    } catch {
      showToast('Login failed. Check your credentials.', 'danger')
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    if (!validateSignup()) return
    try {
      await dispatch(
        register({
          fullName: fields.fullName,
          email: fields.email,
          password: fields.password,
          phone: fields.phone,
        }),
      ).unwrap()
      showToast('Account created. Check your email to verify before logging in.')
      setMode('login')
    } catch {
      showToast('Signup failed. Please try again.', 'danger')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {mode !== 'forgot' && (
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${mode == 'signup' ? 'active' : ''} `}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </li>
        </ul>
      )}

      {mode === 'login' && (
        <form onSubmit={handleLogin}>
          <div className="mb-2">
            <input
              className="form-control"
              placeholder="Email"
              value={fields.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>
          <div className="mb-2">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={fields.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
          </div>
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </Button>
          <Button variant="link" type="button" onClick={() => setMode('forgot')}>
            Forgot Password?
          </Button>
          <div className="mt-2 d-flex gap-2">
            <Button variant="outline-secondary" type="button" disabled>
              Continue with Facebook
            </Button>
            <Button variant="outline-secondary" type="button" disabled>
              Continue with Google
            </Button>
          </div>
        </form>
      )}
      {mode === 'signup' && (
        <form onSubmit={handleSignup}>
          {['fullName', 'email', 'phone'].map((name) => (
            <div className="mb-2" key={name}>
              <input
                className="form-control"
                placeholder={name}
                value={fields[name]}
                onChange={(e) => updateField(name, e.target.value)}
              />
              {errors[name] && <div className="text-danger small">{errors[name]}</div>}
            </div>
          ))}
          <div className="mb-2">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={fields.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
          </div>
          <div className="mb-2">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={fields.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
            />
            {errors.confirmPassword && (
              <div className="text-danger small">{errors.confirmPassword}</div>
            )}
          </div>
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      )}

      {mode === 'forgot' && (
        <div>
          <p>Password recovery isn&apos;t available yet — this is a placeholder for now.</p>
          <Button variant="link" type="button" onClick={() => setMode('login')}>
            Back to login
          </Button>
        </div>
      )}
    </Modal>
  )
}
