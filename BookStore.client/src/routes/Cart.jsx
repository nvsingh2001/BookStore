import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import {
  fetchCart,
  updateCartItemQuantity,
  removeFromCart,
  selectCartItems,
  selectCartStatus,
  selectCartTotal,
} from '../features/cart/cartSlice'
import CartLineItem from '../components/CartLineItem'
import DeliveryLocationSelect from '../components/DeliveryLocationSelect'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useToast } from '../context/ToastContext'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showToast = useToast()
  const items = useSelector(selectCartItems)
  const status = useSelector(selectCartStatus)
  const total = useSelector(selectCartTotal)
  const [deliveryLocation, setDeliveryLocation] = useState('Home')

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  function handleQuantityChange(cartItemId, quantity) {
    dispatch(updateCartItemQuantity({ cartItemId, quantity }))
      .unwrap()
      .catch(() => showToast('Could not update quantity.', 'danger'))
  }

  function handleRemove(cartItemId) {
    dispatch(removeFromCart(cartItemId))
      .unwrap()
      .catch(() => showToast('Could not remove item.', 'danger'))
  }

  if (status === 'loading' && items.length === 0) return <Spinner />
  if (status === 'error' && items.length === 0) {
    return <ErrorState message="Could not load your cart." onRetry={() => dispatch(fetchCart())} />
  }
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add some books to get started."
        actionLabel="Browse Books"
        onAction={() => navigate('/')}
      />
    )
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Your Cart</h1>
      <div className="row g-4">
        <div className="col-md-8">
          {items.map((item) => (
            <CartLineItem
              key={item.cartItemId}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              disabled={status === 'loading'}
            />
          ))}
        </div>
        <div className="col-md-4">
          <div className="border rounded p-3">
            <DeliveryLocationSelect value={deliveryLocation} onChange={setDeliveryLocation} />
            <div className="d-flex justify-content-between mb-3">
              <span>Subtotal</span>
              <span className="fw-bold">₹{total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary w-100">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
