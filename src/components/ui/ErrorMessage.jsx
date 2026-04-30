export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="bg-error-bg text-error border border-error/30 px-4 py-3 rounded-xl text-sm">
      {message}
    </div>
  )
}
