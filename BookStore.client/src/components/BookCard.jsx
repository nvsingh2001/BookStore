export default function BookCard({ book }) {
  return (
    <div className="card h-100">
      <div className="ratio ratio-1x1 bg-secondary-subtle d-flex align-items-center justify-content-center">
        <span className="text-secondary small">No Image</span>
      </div>
      <div className="card-body d-flex flex-column">
        <h3 className="h6 card-title">{book.name}</h3>
        <p className="text-secondary small mb-1">{book.author}</p>
        <div className="mt-auto d-flex align-items-center gap-2">
          {book.discount > 0 && (
            <span className="text-decoration-line-through text-secondary small">₹{book.price}</span>
          )}
          <span className="fw-bold">₹{book.displayPrice}</span>
          <span className={`badge ms-auto ${book.inStock ? 'text-bg-success' : 'text-bg-danger'}`}>
            {book.inStock ? 'In Stock' : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  )
}
