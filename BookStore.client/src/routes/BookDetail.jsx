import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { products } from '../api/products'
import { addToCart } from '../features/cart/cartSlice'
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from '../features/wishlist/wishlistSlice'
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
  const dispatch = useDispatch()
  const showToast = useToast()
  const [reloadKey, setReloadKey] = useState(0)

  const fetchBook = useCallback(() => products.getById(bookId), [bookId])
  const { status, data: book, retry } = useAsync(fetchBook)
  const isWishlisted = useSelector((state) => book && selectIsInWishlist(book.id)(state))

  if (status === 'loading') return <Spinner />
  if (status === 'error') return <ErrorState message="Could not load this book." onRetry={retry} />
  if (!book)
    return <EmptyState title="Book not found" message="This book may no longer be available." />

  function handleAddToBag() {
    if (!token) {
      showToast('Please login to add items to your cart.', 'warning')
      return
    }
    dispatch(addToCart({ productId: book.id, quantity: 1 }))
      .unwrap()
      .then(() => showToast('Added to cart.'))
      .catch(() => showToast('Could not add to cart.', 'danger'))
  }

  function handleNotifyMe() {
    showToast("We'll notify you when this book is back in stock.", 'info')
  }

  function handleToggleWishlist() {
    if (!token) {
      showToast('Please login to use your wishlist.', 'warning')
      return
    }
    const action = isWishlisted ? removeFromWishlist(book.id) : addToWishlist(book.id)
    dispatch(action)
      .unwrap()
      .then(() => showToast(isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.'))
      .catch(() => showToast('Could not update your wishlist.', 'danger'))
  }

  return (
    <div className="container p-4">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="position-relative">
            {book.imageUrl ? (
              <div className="ratio ratio-1x1">
                <img src={book.imageUrl} alt={book.name} className="object-fit-cover" />
              </div>
            ) : (
              <div className="ratio ratio-1x1 bg-secondary-subtle d-flex align-items-center justify-content-center">
                <span className="text-secondary small">No Image</span>
              </div>
            )}
            {!book.inStock && (
              <span className="position-absolute top-0 start-0 m-2 badge text-bg-danger">
                Out of Stock
              </span>
            )}
          </div>
        </div>
        <div className="col-md-8">
          <h1 className="h3">{book.name}</h1>
          <p className="text-secondary">{book.author}</p>
          <p>{book.description}</p>
          <div className="d-flex align-items-center gap-2 mb-3">
            {book.discount > 0 && (
              <span className="text-decoration-line-through text-secondary">Rs. {book.price}</span>
            )}
            <span className="fw-bold fs-5">Rs. {book.displayPrice}</span>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary text-uppercase"
              onClick={book.inStock ? handleAddToBag : handleNotifyMe}
            >
              {book.inStock ? 'Add to Bag' : 'Notify Me'}
            </button>
            <button
              type="button"
              className="btn btn-dark text-uppercase d-flex align-items-center gap-2"
              onClick={handleToggleWishlist}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 21s-6.7-4.35-9.33-8.2C.86 10.02 1.6 6.6 4.6 5.06 6.9 3.9 9.5 4.7 12 7.4c2.5-2.7 5.1-3.5 7.4-2.34 3 1.54 3.74 4.96 1.93 7.74C18.7 16.65 12 21 12 21Z" />
              </svg>
              {isWishlisted ? 'Remove from Wishlist' : 'Wishlist'}
            </button>
          </div>
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
