export default function BookCard({ book }) {
  return (
    <div className="card h-100">
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
          <span className="position-absolute bottom-0 start-0 w-100 py-1 text-center text-uppercase small fw-bold bg-white bg-opacity-75">
            Out of Stock
          </span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h3 className="h6 card-title">{book.name}</h3>
        <p className="text-secondary small mb-1">{book.author}</p>
        <div className="mt-auto d-flex align-items-center gap-2">
          {book.discount > 0 && (
            <span className="text-decoration-line-through text-secondary small">
              Rs. {book.price}
            </span>
          )}
          <span className="fw-bold">Rs. {book.displayPrice}</span>
        </div>
      </div>
    </div>
  )
}
