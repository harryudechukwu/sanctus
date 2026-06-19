export function SaintCard({ saint }) {
  return (
    <div className="border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{saint.name}</h3>
      {saint.feastDay && (
        <p className="text-sm text-gray-500">Feast: {saint.feastDay}</p>
      )}
      {saint.patronage && (
        <p className="mt-1 text-sm text-gray-600">{saint.patronage}</p>
      )}
    </div>
  )
}
