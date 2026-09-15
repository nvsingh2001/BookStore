import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { customerDetails } from '../api/customerDetails'
import { orders } from '../api/orders'
import {
  fetchCart,
  removeFromCart,
  selectCartItems,
  selectCartTotal,
} from '../features/cart/cartSlice'
import AddressForm from '../components/AddressForm'
import EmptyState from '../components/EmptyState'
import { useToast } from '../context/ToastContext'

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showToast = useToast()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const [step, setStep] = useState('address')
  const [address, setAddress] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add some books before checking out."
        actionLabel="Browse Books"
        onAction={() => navigate('/')}
      />
    )
  }

  async function handleAddressSubmit(fields) {
    setSubmitting(true)
    try {
      const savedAddress = await customerDetails.update(fields)
      setAddress(savedAddress)
      setStep('review')
    } catch {
      showToast('Could not save your address.', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  async function handlePlaceOrder() {
    setSubmitting(true)
    try {
      const order = await orders.place(
        items.map((item) => ({ id: item.book.id, quantity: item.quantity })),
        address.addressId,
      )
      await Promise.all(items.map((item) => dispatch(removeFromCart(item.cartItemId)).unwrap()))
      await dispatch(fetchCart())
      navigate('/checkout/confirmation', { state: { order } })
    } catch {
      showToast('Could not place your order.', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: '640px' }}>
      <h1 className="h3 mb-4">Checkout</h1>
      {step === 'address' ? (
        <AddressForm onSubmit={handleAddressSubmit} submitting={submitting} />
      ) : (
        <div>
          <h2 className="h5">Delivery Address</h2>
          <p className="text-secondary">
            {address.fullAddress}, {address.city}, {address.state} ({address.addressType})
          </p>
          <h2 className="h5 mt-4">Order Summary</h2>
          <ul className="list-unstyled">
            {items.map((item) => (
              <li
                key={item.cartItemId}
                className="d-flex justify-content-between border-bottom py-2"
              >
                <span>
                  {item.book.name} × {item.quantity}
                </span>
                <span>Rs. {(item.book.displayPrice * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between fw-bold py-2">
            <span>Total</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className="btn btn-confirm w-100 mt-3"
            disabled={submitting}
            onClick={handlePlaceOrder}
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      )}
    </div>
  )
}
