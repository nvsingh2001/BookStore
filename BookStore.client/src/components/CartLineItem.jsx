import Button from './Button'

export default function CartLineItem({ item, onQuantityChange, onRemove, disabled }) {
  const { cartItemId, quantity, book } = item

  function handleDecrease() {
    if (quantity > 1) onQuantityChange(cartItemId, quantity - 1)
  }

  function handleIncrease() {
    onQuantityChange(cartItemId, quantity + 1)
  }

  return (
    <div className="d-flex align-items-center border-bottom py-3 gap-3">
      <div className="ratio ratio-1x1 flex-shrink-0" style={{ width: '80px' }}>
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.name} className="object-fit-cover" />
        ) : (
          <div className="bg-secondary-subtle d-flex align-items-center justify-content-center h-100">
            <span className="text-secondary small">No Image</span>
          </div>
        )}
      </div>
      <div className="flex-grow-1">
        <h3 className="h6 mb-1">{book.name}</h3>
        <p className="text-secondary small mb-1">{book.author}</p>
        <span className="fw-bold">Rs. {book.displayPrice}</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <Button
          variant="outline-secondary"
          disabled={disabled || quantity <= 1}
          onClick={handleDecrease}
        >
          -
        </Button>
        <span>{quantity}</span>
        <Button variant="outline-secondary" disabled={disabled} onClick={handleIncrease}>
          +
        </Button>
      </div>
      <span className="fw-bold text-end" style={{ minWidth: '80px' }}>
        Rs. {(book.displayPrice * quantity).toFixed(2)}
      </span>
      <button
        type="button"
        className="btn btn-link text-danger p-0"
        disabled={disabled}
        onClick={() => onRemove(cartItemId)}
      >
        Remove
      </button>
    </div>
  )
}
