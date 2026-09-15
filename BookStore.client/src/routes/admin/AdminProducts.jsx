import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { products } from '../../api/products'
import { useAsync } from '../../hooks/useAsync'
import { useToast } from '../../context/ToastContext'
import Spinner from '../../components/Spinner'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'

export default function AdminProducts() {
  const showToast = useToast()
  const [reloadKey, setReloadKey] = useState(0)
  const [confirmingId, setConfirmingId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProducts = useCallback(() => {
    void reloadKey
    return products.list()
  }, [reloadKey])
  const { status, data, retry } = useAsync(fetchProducts)

  async function handleDelete(id) {
    setDeleting(true)
    try {
      await products.remove(id)
      showToast('Book deleted.')
      setConfirmingId(null)
      setReloadKey((k) => k + 1)
    } catch {
      showToast('Could not delete book.', 'danger')
    } finally {
      setDeleting(false)
    }
  }

  if (status === 'loading') return <Spinner />
  if (status === 'error') return <ErrorState message="Could not load products." onRetry={retry} />

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          Add Book
        </Link>
      </div>
      {data.length === 0 ? (
        <EmptyState title="No books yet" message="Add your first book to get started." />
      ) : (
        <div className="table-responsive">
          <table className="table bg-white align-middle">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Price</th>
                <th>Qty</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((book) => (
                <tr key={book.id}>
                  <td>{book.name}</td>
                  <td>{book.author}</td>
                  <td>Rs. {book.displayPrice}</td>
                  <td>{book.quantity}</td>
                  <td className="text-end">
                    <Link
                      to={`/admin/products/${book.id}/edit`}
                      className="btn btn-outline-secondary btn-sm me-2"
                    >
                      Edit
                    </Link>
                    {confirmingId === book.id ? (
                      <span className="d-inline-flex align-items-center gap-1">
                        <span className="small text-danger">Delete?</span>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          disabled={deleting}
                          onClick={() => handleDelete(book.id)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          disabled={deleting}
                          onClick={() => setConfirmingId(null)}
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setConfirmingId(book.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
