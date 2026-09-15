import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { auth } from '../api/auth'
import { customerDetails } from '../api/customerDetails'
import { useToast } from '../context/ToastContext'
import AddressForm, { addressTypeToLabel } from '../components/AddressForm'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'

export default function Profile() {
  const showToast = useToast()
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey: ['me'], queryFn: auth.me })
  const [savedAddress, setSavedAddress] = useState(null)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (isLoading) return <Spinner />
  if (isError) return <ErrorState message="Could not load your profile." onRetry={refetch} />

  async function handleAddressSubmit(fields) {
    setSubmitting(true)
    try {
      const address = await customerDetails.update(fields)
      setSavedAddress(address)
      setIsEditingAddress(false)
      showToast('Address saved.')
    } catch {
      showToast('Could not save your address.', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: '480px' }}>
      <h1 className="h3 mb-4">Profile</h1>
      <dl className="row">
        <dt className="col-4">Name</dt>
        <dd className="col-8">{user.fullName}</dd>
        <dt className="col-4">Email</dt>
        <dd className="col-8">{user.email}</dd>
        <dt className="col-4">Phone</dt>
        <dd className="col-8">{user.phone}</dd>
        <dt className="col-4">Verified</dt>
        <dd className="col-8">{user.isVerified ? 'Yes' : 'No'}</dd>
      </dl>

      <hr className="my-4" />
      <h2 className="h5 mb-3">Address Details</h2>

      {savedAddress && !isEditingAddress ? (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-uppercase">
              {addressTypeToLabel(savedAddress.addressType)}
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0"
              onClick={() => setIsEditingAddress(true)}
            >
              Edit
            </button>
          </div>
          <div className="form-control bg-light mb-2" style={{ minHeight: '4rem' }}>
            {savedAddress.fullAddress}
          </div>
          <div className="row">
            <div className="col-6">
              <label className="form-label">city/town</label>
              <div className="form-control bg-light">{savedAddress.city}</div>
            </div>
            <div className="col-6">
              <label className="form-label">State</label>
              <div className="form-control bg-light">{savedAddress.state}</div>
            </div>
          </div>
        </div>
      ) : (
        <AddressForm
          onSubmit={handleAddressSubmit}
          submitting={submitting}
          initialValues={savedAddress}
          submitLabel="Save Address"
        />
      )}
    </div>
  )
}
