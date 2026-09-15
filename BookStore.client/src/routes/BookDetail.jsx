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
          <div className="d-flex gap-2">
            <Button onClick={book.inStock ? handleAddToBag : handleNotifyMe}>
              {book.inStock ? 'Add to Bag' : 'Notify Me'}
            </Button>
            <Button variant={isWishlisted ? 'danger' : 'outline-danger'} onClick={handleToggleWishlist}>
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
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
