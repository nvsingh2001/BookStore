import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { products } from '../api/products'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'
import Spinner from '../components/Spinner'
import { useToast } from '../context/ToastContext'
import { useAsync } from '../hooks/useAsync'

export default function BookDetail() {
  const { bookId } = useParams()
  const token = useSelector((state) => state.auth.token)
  const showToast = useToast()
  const [reloadKey, setReloadKey] = useState(0)

  const fetchBook = useCallback(() => products.getById(bookId), [bookId])
  const { status, data: book, retry } = useAsync(fetchBook)

  if (status === 'loading') return <Spinner />
  if (status === 'error') return <ErrorState message="Could not load this book." onRetry={retry} />
  if (!book)
    return <EmptyState title="Book not found" message="This book may no longer be available." />

  function handleUnavailableAction() {
    showToast('Cart functionality is coming soon.', 'warning')
  }

  return (
    <div className="container p-4">
      <div className="row g-4">
        <div className="col-md-4">
          {book.imageUrl ? (
            <div className="ratio ratio-1x1">
              <img src={book.imageUrl} alt={book.name} className="object-fit-cover" />
            </div>
          ) : (
            <div className="ratio ratio-1x1 bg-secondary-subtle d-flex align-items-center justify-content-center">
              <span className="text-secondary small">No Image</span>
            </div>
          )}
        </div>
        <div className="col-md-8">
          <h1 className="h3">{book.name}</h1>
          <p className="text-secondary">{book.author}</p>
          <p>{book.description}</p>
          <div className="d-flex align-items-center gap-2 mb-3">
            {book.discount > 0 && (
              <span className="text-decoration-line-through text-secondary">₹{book.price}</span>
            )}
            <span className="fw-bold fs-5">₹{book.displayPrice}</span>
            <span className={`badge ${book.inStock ? 'text-bg-success' : 'text-bg-danger'}`}>
              {book.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <Button onClick={handleUnavailableAction}>
            {book.inStock ? 'Add to Bag' : 'Notify Me'}
          </Button>
        </div>
      </div>
      <hr className="my-4" />
      <h2 className="h4">Customer Feedback</h2>

      {token ? (
        <ReviewForm productId={book.id} onSubmitted={() => setReloadKey((k) => k + 1)} />
      ) : (
        <p className="text-secondary">Login to leave a review</p>
      )}
      <ReviewList productId={book.id} reloadKey={reloadKey} />
    </div>
  )
}
