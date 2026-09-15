import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import {
  fetchWishlist,
  removeFromWishlist,
  selectWishlistItems,
  selectWishlistStatus,
} from '../features/wishlist/wishlistSlice'
import { addToCart } from '../features/cart/cartSlice'
import WishlistCard from '../components/WishlistCard'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useToast } from '../context/ToastContext'

export default function Wishlist() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showToast = useToast()
  const items = useSelector(selectWishlistItems)
  const status = useSelector(selectWishlistStatus)

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  function handleRemove(productId) {
    dispatch(removeFromWishlist(productId))
      .unwrap()
      .catch(() => showToast('Could not remove item.', 'danger'))
  }

  function handleMoveToCart(productId) {
    dispatch(addToCart({ productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        showToast('Moved to cart.')
        return dispatch(removeFromWishlist(productId)).unwrap()
      })
      .catch(() => showToast('Could not move item to cart.', 'danger'))
  }

  if (status === 'loading' && items.length === 0) return <Spinner />
  if (status === 'error' && items.length === 0) {
    return (
      <ErrorState
        message="Could not load your wishlist."
        onRetry={() => dispatch(fetchWishlist())}
      />
    )
  }
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        message="Save books you love for later."
        actionLabel="Browse Books"
        onAction={() => navigate('/')}
      />
    )
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Your Wishlist</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {items.map((item) => (
          <div className="col" key={item.wishlistItemId}>
            <WishlistCard
              item={item}
              onRemove={handleRemove}
              onMoveToCart={handleMoveToCart}
              disabled={status === 'loading'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
