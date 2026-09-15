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

function PasswordField({ placeholder, value, onChange, error }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="mb-2">
      <div className="input-group">
        <input
          type={visible ? 'text' : 'password'}
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <div className="text-danger small">{error}</div>}
    </div>
  )
}

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
    <Modal isOpen={isOpen} onClose={onClose} className="modal-content-custom--wide">
      <div className="auth-modal-illustration">
        <img src="/assets/2766594.png" alt="" />
        <h2 className="h5 text-white mb-0">ONLINE BOOK SHOPPING</h2>
      </div>
      <div className="auth-modal-form">
        {mode !== 'forgot' && (
          <div className="d-flex gap-4 mb-3">
            <button
              type="button"
              className={`auth-modal-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-modal-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>
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
            <PasswordField
              placeholder="Password"
              value={fields.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
            />
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </Button>
            <Button variant="link" type="button" onClick={() => setMode('forgot')}>
              Forgot Password?
            </Button>
            <div className="auth-modal-divider">
              <span>OR</span>
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-facebook flex-grow-1" disabled>
                Continue with Facebook
              </button>
              <Button variant="outline-secondary" className="flex-grow-1" type="button" disabled>
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
            <PasswordField
              placeholder="Password"
              value={fields.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
            />
            <PasswordField
              placeholder="Confirm Password"
              value={fields.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
            />
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
      </div>
    </Modal>
  )
}
