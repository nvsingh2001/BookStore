import { useState } from 'react'
import StarRating from './StarRating'
import { useToast } from '../context/ToastContext'
import { feedback } from '../api/feedback'
import Button from './Button'

export default function ReviewForm({ productId, onSubmitted }) {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const showToast = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating === 0) {
      showToast('Please select a rating.', 'danger')
      return
    }
    setSubmitting(true)
    try {
      await feedback.add(productId, { comment, rating })
      showToast('Review submitted.')
      setComment('')
      setRating(0)
      onSubmitted()
    } catch {
      showToast('Could not submit review.', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <StarRating rating={rating} readOnly={false} onChange={setRating} />
      <textarea
        className="form-control my-2"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a review..."
        required
      />
      <Button variant="confirm" type="submit" disabled={submitting}>
        {submitting ? 'submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
