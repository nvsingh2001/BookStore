import { useCallback } from 'react'
import { feedback } from '../api/feedback'
import { useAsync } from '../hooks/useAsync'
import Spinner from './Spinner'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'
import StarRating from './StarRating'

export default function ReviewList({ productId, reloadKey }) {
  const fetchFeedback = useCallback(() => {
    void reloadKey
    return feedback.list(productId)
  }, [productId, reloadKey])

  const { status, data, retry } = useAsync(fetchFeedback)

  if (status === 'loading') return <Spinner size="sm" />
  if (status == 'error') return <ErrorState message="Could not load the reviews" onRetry={retry} />
  if (!data || data.length === 0) {
    return <EmptyState title="No Reviews yet" message="Be the first to review this book." />
  }

  return (
    <ul className="list-unstyled">
      {data.map((review) => (
        <li key={review._id} className="border-bottom py-2">
          <StarRating rating={review.rating} />
          <p className="mb-0">{review.comment}</p>
        </li>
      ))}
    </ul>
  )
}
