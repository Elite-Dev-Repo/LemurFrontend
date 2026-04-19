export default function PostSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex gap-3">
        <div className="skeleton w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="space-y-1.5">
        <div className="skeleton h-3.5 w-full rounded" />
        <div className="skeleton h-3.5 w-5/6 rounded" />
        <div className="skeleton h-3.5 w-4/5 rounded" />
      </div>
      <div className="flex gap-4 pt-2">
        <div className="skeleton h-4 w-12 rounded" />
        <div className="skeleton h-4 w-12 rounded" />
      </div>
    </div>
  )
}
