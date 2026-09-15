import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { products } from '../../api/products'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/Button'
import Spinner from '../../components/Spinner'

const emptyFields = {
  bookName: '',
  author: '',
  description: '',
  quantity: 0,
  price: '',
  discountPrice: 0,
}

export default function AdminProductForm() {
  const { productId } = useParams()
  const isEdit = Boolean(productId)
  const navigate = useNavigate()
  const showToast = useToast()
  const [fields, setFields] = useState(emptyFields)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isEdit) return
    let ignore = false
    products.getById(productId).then((book) => {
      if (ignore) return
      setFields({
        bookName: book.name,
        author: book.author,
        description: book.description,
        quantity: book.quantity,
        price: book.price,
        discountPrice: book.discount,
      })
      setLoading(false)
    })
    return () => {
      ignore = true
    }
  }, [isEdit, productId])

  function updateField(name, value) {
    setFields((f) => ({ ...f, [name]: value }))
  }

  function validate() {
    const next = {}
    if (fields.bookName.trim().length < 2) next.bookName = 'Book name must be at least 2 characters.'
    if (fields.author.trim().length < 2) next.author = 'Author must be at least 2 characters.'
    if (fields.description.trim().length < 2)
      next.description = 'Description must be at least 2 characters.'
    if (!(Number(fields.price) > 0)) next.price = 'Price must be greater than 0.'
    if (Number(fields.quantity) < 0) next.quantity = 'Quantity cannot be negative.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const payload = {
      bookName: fields.bookName,
      author: fields.author,
      description: fields.description,
      quantity: Number(fields.quantity),
      price: Number(fields.price),
      discountPrice: Number(fields.discountPrice) || 0,
    }
    try {
      const book = isEdit ? await products.update(productId, payload) : await products.create(payload)
      if (imageFile) {
        await products.uploadImage(book.id, imageFile)
      }
      showToast(isEdit ? 'Book updated.' : 'Book created.')
      navigate('/admin/products')
    } catch (err) {
      showToast(err.message ?? 'Could not save book.', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="container py-4" style={{ maxWidth: '560px' }}>
      <h1 className="h3 mb-4">{isEdit ? 'Edit Book' : 'Add Book'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="bookName" className="form-label">
            Book Name
          </label>
          <input
            id="bookName"
            className="form-control"
            value={fields.bookName}
            onChange={(e) => updateField('bookName', e.target.value)}
          />
          {errors.bookName && <div className="text-danger small">{errors.bookName}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author
          </label>
          <input
            id="author"
            className="form-control"
            value={fields.author}
            onChange={(e) => updateField('author', e.target.value)}
          />
          {errors.author && <div className="text-danger small">{errors.author}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="form-control"
            value={fields.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
          {errors.description && <div className="text-danger small">{errors.description}</div>}
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="0"
              className="form-control"
              value={fields.quantity}
              onChange={(e) => updateField('quantity', e.target.value)}
            />
            {errors.quantity && <div className="text-danger small">{errors.quantity}</div>}
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={fields.price}
              onChange={(e) => updateField('price', e.target.value)}
            />
            {errors.price && <div className="text-danger small">{errors.price}</div>}
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="discountPrice" className="form-label">
              Discount
            </label>
            <input
              id="discountPrice"
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={fields.discountPrice}
              onChange={(e) => updateField('discountPrice', e.target.value)}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Cover Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setImageFile(e.target.files[0] ?? null)}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Book'}
        </Button>
      </form>
    </div>
  )
}
