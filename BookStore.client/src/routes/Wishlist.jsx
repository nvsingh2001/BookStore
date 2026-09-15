import { useNavigate } from 'react-router'
import { useIsMutating } from '@tanstack/react-query'
import { useWishlist, useRemoveFromWishlist } from '../features/wishlist/useWishlist'
import { useAddToCart } from '../features/cart/useCart'
import WishlistCard from '../components/WishlistCard'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useToast } from '../context/ToastContext'

export default function Wishlist() {
  const navigate = useNavigate()
  const showToast = useToast()
  const { data: items = [], isLoading, isError, refetch } = useWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const addToCart = useAddToCart()
  const wishlistMutating = useIsMutating({ mutationKey: ['wishlist'] })
  const cartMutating = useIsMutating({ mutationKey: ['cart'] })
  const isMutating = wishlistMutating > 0 || cartMutating > 0

  function handleRemove(productId) {
    removeFromWishlist.mutate(productId, {
      onError: () => showToast('Could not remove item.', 'danger'),
    })
  }

  async function handleMoveToCart(productId) {
    try {
      await addToCart.mutateAsync({ productId, quantity: 1 })
      showToast('Moved to cart.')
      await removeFromWishlist.mutateAsync(productId)
    } catch {
      showToast('Could not move item to cart.', 'danger')
    }
  }

  if (isLoading) return <Spinner />
  if (isError) {
    return <ErrorState message="Could not load your wishlist." onRetry={refetch} />
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
    <div className="container py-4" style={{ maxWidth: '720px' }}>
      <div className="border rounded">
        <h1 className="h6 fw-bold bg-light m-0 p-3">
          My Wishlist ({String(items.length).padStart(2, '0')})
        </h1>
        <div className="px-3">
          {items.map((item) => (
            <WishlistCard
              key={item.wishlistItemId}
              item={item}
              onRemove={handleRemove}
              onMoveToCart={handleMoveToCart}
              disabled={isMutating}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
