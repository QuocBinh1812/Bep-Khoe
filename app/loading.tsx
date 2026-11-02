export default function Loading() {
  return (
    <div className="container-page py-12" role="status" aria-live="polite">
      <span className="sr-only">Đang tải…</span>
      <div className="h-9 w-2/3 max-w-md animate-pulse rounded-xl bg-surface" />
      <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded-lg bg-surface" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-[var(--radius-card)] bg-surface" />
        ))}
      </div>
    </div>
  );
}
