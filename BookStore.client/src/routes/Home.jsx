import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useAsync } from '../hooks/useAsync'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import SortDropdown from '../components/SortDropdown'
import BookGrid from '../components/BookGrid'
import { products } from '../api/products'

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [sort, setSort] = useState('default')
  const fetchBooks = useCallback(() => products.list(), [])
  const { status, data, retry } = useAsync(fetchBooks)

  const visibleBooks = useMemo(() => {
    if (!data) return []
    const filtered = query
      ? data.filter(
          (book) =>
            book.name.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()),
        )
      : data

    const sorted = [...filtered]
    if (sort == 'price-asc') sorted.sort((a, b) => a.displayPrice - b.displayPrice)
    if (sort == 'price-desc') sorted.sort((a, b) => b.displayPrice - a.displayPrice)
    if (sort == 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [data, query, sort])

  if (status == 'loading') return <Spinner />
  if (status == 'error') return <ErrorState message="Could not load books." onRetry={retry} />
  if (visibleBooks.length === 0) {
    return <EmptyState title={'No books found'} message={'Try a different search term.'} />
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h5 mb-0">
          Books ({visibleBooks.length} {visibleBooks.length === 1 ? 'item' : 'items'})
        </h1>
        <SortDropdown value={sort} onChange={setSort} />
      </div>
      <BookGrid books={visibleBooks} />
    </div>
  )
}
