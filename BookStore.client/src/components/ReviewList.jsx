import { useQuery } from '@tanstack/react-query'
import { feedback } from '../api/feedback'
import Spinner from './Spinner'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'
import StarRating from './StarRating'

export default function ReviewList({ productId }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['feedback', productId],
    queryFn: () => feedback.list(productId),
  })

  if (isLoading) return <Spinner size="sm" />
  if (isError) return <ErrorState message="Could not load the reviews" onRetry={refetch} />
  if (!data || data.length === 0) {
    return <EmptyState title="No Reviews yet" message="Be the first to review this book." />
  }

  return (
    <ul className="list-unstyled">
      {data.map((review) => (
        <li key={review.feedbackId} className="border-bottom py-2">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">{review.fullName}</span>
            <StarRating rating={review.rating} />
          </div>
          <p className="mb-0">{review.comment}</p>
        </li>
      ))}
    </ul>
  )
}
