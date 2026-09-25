/**
 * Shown the moment a link in the admin panel is clicked, while the next page
 * reads the database. Without it the old page stays on screen until the new one
 * has fully rendered, which reads as the click having done nothing.
 *
 * It also makes navigation feel instant after the first visit: Next prefetches
 * this shell for dynamic pages, so the switch happens before the data arrives.
 */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Loading…</span>
      <div className="mb-6 space-y-2">
        <div className="h-6 w-48 rounded-md bg-card" />
        <div className="h-4 w-80 max-w-full rounded-md bg-card" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-xl border border-line bg-card" />
        ))}
      </div>
      <div className="mt-5 h-72 rounded-xl border border-line bg-card" />
    </div>
  )
}
