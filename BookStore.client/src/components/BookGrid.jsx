import { Link } from 'react-router'
import BookCard from './BookCard'

export default function BookGrid({ books }) {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
      {books.map((book) => (
        <div className="col" key={book.id}>
          <Link to={`/books/${book.id}`} className="text-decoration-none text-reset">
            <BookCard book={book} />
          </Link>
        </div>
      ))}
    </div>
  )
}
