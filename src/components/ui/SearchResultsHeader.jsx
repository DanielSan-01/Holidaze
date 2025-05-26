export default function SearchResultsHeader({ 
  count, 
  total, 
  onClear, 
  isFiltering = false,
  noResultsMessage = "No venues found",
  className = "flex justify-between items-center mb-4"
}) {
  if (!isFiltering) {
    return null;
  }

  return (
    <div className={className}>
      <div>
        <p className="text-sm text-gray-600">
          {count === 0 ? noResultsMessage : 
           `Showing ${count} of ${total} venues`}
        </p>
      </div>
      <button
        onClick={onClear}
        className="btn-outline text-sm"
      >
        Clear All
      </button>
    </div>
  );
} 