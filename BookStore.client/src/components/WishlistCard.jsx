import { Link } from 'react-router'
import Button from './Button'

export default function WishlistCard({ item, onRemove, onMoveToCart, disabled }) {
  const { book } = item

  return (
    <div className="card h-100">
      <Link to={`/books/${book.id}`} className="text-decoration-none text-reset">
        {book.imageUrl ? (
          <div className="ratio ratio-1x1">
            <img src={book.imageUrl} alt={book.name} className="object-fit-cover" />
          </div>
        ) : (
          <div className="ratio ratio-1x1 bg-secondary-subtle d-flex align-items-center justify-content-center">
            <span className="text-secondary small">No Image</span>
          </div>
        )}
        <div className="card-body pb-0">
          <h3 className="h6 card-title">{book.name}</h3>
          <p className="text-secondary small mb-1">{book.author}</p>
          <span className="fw-bold">Rs. {book.displayPrice}</span>
        </div>
      </Link>
      <div className="card-body pt-2 d-flex gap-2">
        <Button
          variant="primary"
          className="flex-grow-1"
          disabled={disabled || !book.inStock}
          onClick={() => onMoveToCart(book.id)}
        >
          {book.inStock ? 'Move to Cart' : 'Out of Stock'}
        </Button>
        <button
          type="button"
          className="btn btn-outline-danger"
          disabled={disabled}
          onClick={() => onRemove(book.id)}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
