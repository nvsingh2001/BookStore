import { useState } from 'react'
import Button from './Button'

const ADDRESS_TYPE_LABELS = ['Home', 'Work', 'Other']

function labelToAddressType(label) {
  return label === 'Work' ? 'Office' : label
}

export function addressTypeToLabel(type) {
  return type === 'Office' ? 'Work' : type
}

export default function AddressForm({
  onSubmit,
  submitting,
  initialValues,
  submitLabel = 'Save Address & Continue',
}) {
  const [fields, setFields] = useState(() => ({
    addressType: initialValues?.addressType
      ? addressTypeToLabel(initialValues.addressType)
      : 'Home',
    fullAddress: initialValues?.fullAddress ?? '',
    city: initialValues?.city ?? '',
    state: initialValues?.state ?? '',
  }))
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const next = {}
    if (!fields.fullAddress.trim()) next.fullAddress = 'Address is required'
    if (!fields.city.trim()) next.city = 'City is required'
    if (!fields.state.trim()) next.state = 'State is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      addressType: labelToAddressType(fields.addressType),
      fullAddress: fields.fullAddress,
      city: fields.city,
      state: fields.state,
      isDefault: true,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="addressType" className="form-label">
          Address Type
        </label>
        <select
          id="addressType"
          name="addressType"
          className="form-select"
          value={fields.addressType}
          onChange={handleChange}
        >
          {ADDRESS_TYPE_LABELS.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="fullAddress" className="form-label">
          Full Address
        </label>
        <textarea
          id="fullAddress"
          name="fullAddress"
          className="form-control"
          value={fields.fullAddress}
          onChange={handleChange}
        />
        {errors.fullAddress && <div className="text-danger small">{errors.fullAddress}</div>}
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            className="form-control"
            value={fields.city}
            onChange={handleChange}
          />
          {errors.city && <div className="text-danger small">{errors.city}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="state" className="form-label">
            State
          </label>
          <input
            id="state"
            name="state"
            type="text"
            className="form-control"
            value={fields.state}
            onChange={handleChange}
          />
          {errors.state && <div className="text-danger small">{errors.state}</div>}
        </div>
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}
