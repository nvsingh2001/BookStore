import { Link } from 'react-router'

const trashIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 3a1 1 0 0 0-1 1v1H4v2h16V5h-4V4a1 1 0 0 0-1-1H9Zm-3 6 1 12h10l1-12H6Z" />
  </svg>
)

export default function WishlistCard({ item, onRemove, onMoveToCart, disabled }) {
  const { book } = item

  return (
    <div className="d-flex align-items-center border-bottom py-3 gap-3">
      <Link to={`/books/${book.id}`} className="flex-shrink-0">
        <div className="ratio ratio-1x1" style={{ width: '64px' }}>
          {book.imageUrl ? (
            <img src={book.imageUrl} alt={book.name} className="object-fit-cover" />
          ) : (
            <div className="bg-secondary-subtle d-flex align-items-center justify-content-center h-100">
              <span className="text-secondary small">No Image</span>
            </div>
          )}
        </div>
      </Link>
      <div className="flex-grow-1">
        <Link to={`/books/${book.id}`} className="text-decoration-none text-reset">
          <h3 className="h6 mb-1">{book.name}</h3>
        </Link>
        <p className="text-secondary small mb-1">{book.author}</p>
        <span className="fw-bold">Rs. {book.displayPrice}</span>
      </div>
      <button
        type="button"
        className="btn btn-link btn-sm"
        disabled={disabled || !book.inStock}
        onClick={() => onMoveToCart(book.id)}
      >
        {book.inStock ? 'Move to Cart' : 'Out of Stock'}
      </button>
      <button
        type="button"
        className="btn btn-link text-danger p-0"
        disabled={disabled}
        onClick={() => onRemove(book.id)}
        aria-label="Remove from wishlist"
      >
        {trashIcon}
      </button>
    </div>
  )
}
