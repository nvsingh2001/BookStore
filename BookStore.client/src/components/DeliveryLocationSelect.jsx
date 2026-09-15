const LOCATIONS = ['Home', 'Office', 'Other']

export default function DeliveryLocationSelect({ value, onChange }) {
  return (
    <div className="mb-3">
      <label htmlFor="delivery-location" className="form-label">
        Deliver to
      </label>
      <select
        id="delivery-location"
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {LOCATIONS.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  )
}
