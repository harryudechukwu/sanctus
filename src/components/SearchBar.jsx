export function SearchBar({ value, onChange, onClick, placeholder }) {
  if (onClick) {
    return (
      <div
        onClick={onClick}
        className="flex cursor-text items-center justify-center h-10 px-3.5 py-1.5 text-base text-gray-400"
      >
        <span>{placeholder || 'Search for saints & angel'}</span>
      </div>
    )
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Search saints...'}
      className="w-full bg-white py-2 text-base focus:outline-none"
      autoFocus
    />
  )
}
