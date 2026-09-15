export default function SortDropdown({ value, onChange }) {
  return (
    <select
      className="form-select w-auto"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Sort Books"
    >
      <option value="default">Sort by relevance</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name-asc">Name: A-Z</option>
    </select>
  )
}
