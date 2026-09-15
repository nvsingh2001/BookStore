import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useIsMutating } from '@tanstack/react-query'
import {
  useCart,
  useUpdateCartItemQuantity,
  useRemoveFromCart,
  cartTotal,
} from '../features/cart/useCart'
import CartLineItem from '../components/CartLineItem'
import DeliveryLocationSelect from '../components/DeliveryLocationSelect'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useToast } from '../context/ToastContext'

export default function Cart() {
  const navigate = useNavigate()
  const showToast = useToast()
  const { data: items = [], isLoading, isError, refetch } = useCart()
  const updateQuantity = useUpdateCartItemQuantity()
  const removeItem = useRemoveFromCart()
  const isMutating = useIsMutating({ mutationKey: ['cart'] }) > 0
  const [deliveryLocation, setDeliveryLocation] = useState('Home')

  function handleQuantityChange(cartItemId, quantity) {
    updateQuantity.mutate(
      { cartItemId, quantity },
      { onError: () => showToast('Could not update quantity.', 'danger') },
    )
  }

  function handleRemove(cartItemId) {
    removeItem.mutate(cartItemId, {
      onError: () => showToast('Could not remove item.', 'danger'),
    })
  }

  if (isLoading) return <Spinner />
  if (isError) {
    return <ErrorState message="Could not load your cart." onRetry={refetch} />
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
              disabled={isMutating}
            />
          ))}
        </div>
        <div className="col-md-4">
          <div className="border rounded p-3">
            <DeliveryLocationSelect value={deliveryLocation} onChange={setDeliveryLocation} />
            <div className="d-flex justify-content-between mb-3">
              <span>Subtotal</span>
              <span className="fw-bold">Rs. {cartTotal(items).toFixed(2)}</span>
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
