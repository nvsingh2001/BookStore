import { Link, Navigate, useLocation } from 'react-router'

export default function OrderConfirmation() {
  const location = useLocation()
  const order = location.state?.order

  if (!order) return <Navigate to="/" replace />

  return (
    <div className="container py-5 text-center" style={{ maxWidth: '480px' }}>
      <h1 className="h3 mb-3">Order Placed!</h1>
      <p className="text-secondary">Your order has been placed successfully.</p>
      <p className="fw-bold mb-1">Order ID: {order.orderId}</p>
      <p className="text-secondary">Status: {order.status}</p>
      <Link to="/" className="btn btn-primary mt-3">
        Continue Shopping
      </Link>
    </div>
  )
}
