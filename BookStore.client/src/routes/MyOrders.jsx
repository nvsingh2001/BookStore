import { useCallback } from 'react'
import { orders } from '../api/orders'
import { useAsync } from '../hooks/useAsync'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

export default function MyOrders() {
  const fetchOrders = useCallback(() => orders.list(), [])
  const { status, data, retry } = useAsync(fetchOrders)

  if (status === 'loading') return <Spinner />
  if (status === 'error')
    return <ErrorState message="Could not load your orders." onRetry={retry} />
  if (!data || data.length === 0) {
    return <EmptyState title="No orders yet" message="Your placed orders will show up here." />
  }

  return (
    <div className="container py-4" style={{ maxWidth: '640px' }}>
      <h1 className="h3 mb-4">My Orders</h1>
      {data.map((order) => (
        <div key={order.orderId} className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Order #{order.orderId.slice(0, 8)}</span>
            <span className="badge text-bg-secondary">{order.status}</span>
          </div>
          <p className="text-secondary small mb-2">
            Placed {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <ul className="list-unstyled mb-0">
            {order.items.map((item) => (
              <li key={item.productId} className="d-flex justify-content-between">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>Rs. {item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
