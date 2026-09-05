import { useState } from 'react'

export default function StarRating({ rating, readOnly = true, onChange }) {
  const [hovered, setHovered] = useState(null)

  const displayRating = hovered ?? rating

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= displayRating ? 'text-warning' : 'text-secondary'}
          onClick={readOnly ? undefined : () => onChange(star)}
          onMouseEnter={readOnly ? undefined : () => setHovered(star)}
          onMouseLeave={readOnly ? undefined : () => setHovered(null)}
        >
          ★
        </span>
      ))}
    </div>
  )
}
