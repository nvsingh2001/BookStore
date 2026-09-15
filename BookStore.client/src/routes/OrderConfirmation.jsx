import { Link, Navigate, useLocation } from 'react-router'

export default function OrderConfirmation() {
  const location = useLocation()
  const order = location.state?.order

  if (!order) return <Navigate to="/" replace />

  return (
    <div className="container py-5 text-center" style={{ maxWidth: '480px' }}>
      <h1 className="h3 fw-bold mb-3">Order Placed Successfully</h1>
      <p className="text-secondary">
        hurray!!! your order is confirmed
        <br />
        the order id is #{order.orderId} save the order id for further communication..
      </p>
      <p className="text-secondary">Status: {order.status}</p>
      <Link to="/" className="btn btn-confirm mt-3">
        Continue Shopping
      </Link>
    </div>
  )
}
