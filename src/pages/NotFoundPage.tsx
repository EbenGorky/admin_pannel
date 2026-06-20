export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-20 h-20 rounded-full bg-card-hover flex items-center justify-center">
        <span className="text-4xl font-bold text-text-muted">404</span>
      </div>
      <h2 className="text-xl font-semibold text-text-heading">Page Not Found</h2>
      <p className="text-sm text-text-muted">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="px-4 py-2 bg-primary text-white rounded-radius-button text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        Go to Dashboard
      </a>
    </div>
  )
}
