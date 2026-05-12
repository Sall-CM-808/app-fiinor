import { Skeleton } from "@/components/ui/skeleton"

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-border/30 bg-card p-4 ${className ?? ""}`}>
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-28 rounded" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-8 w-20 rounded" />
      <Skeleton className="mt-2 h-2.5 w-full rounded-full" />
      <Skeleton className="mt-1.5 h-2.5 w-4/5 rounded-full" />
    </div>
  )
}

function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-border/30 bg-card p-4 ${className ?? ""}`}>
      <Skeleton className="h-3 w-40 rounded" />
      <Skeleton className="mt-1 h-2.5 w-56 rounded" />
      <div className="mt-4 flex items-end gap-1.5" style={{ height: 130 }}>
        {[55, 70, 50, 85, 65, 90, 75, 88, 72, 95].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function SkeletonEstablishment() {
  return (
    <div className="rounded-xl border border-border/30 bg-card p-4">
      <div className="flex items-start justify-between">
        <Skeleton className="size-10 rounded-xl" />
        <Skeleton className="size-14 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-3 w-12 rounded" />
      <Skeleton className="mt-1.5 h-4 w-full rounded" />
      <Skeleton className="mt-0.5 h-3 w-20 rounded" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    </div>
  )
}

function SkeletonNotification() {
  return (
    <div className="mb-2 flex items-start gap-3 rounded-xl border border-border/20 p-3">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4 rounded" />
        <Skeleton className="h-2.5 w-full rounded" />
        <Skeleton className="h-2.5 w-2/3 rounded" />
        <Skeleton className="mt-1 h-4 w-16 rounded-md" />
      </div>
    </div>
  )
}

function SkeletonMap() {
  return (
    <div className="rounded-xl border border-border/30 bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="mx-auto h-52 w-full rounded-xl" />
      <div className="mt-3 flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-3 w-16 rounded" />
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>

      {/* Map + Rankings */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <SkeletonMap />
          <div className="rounded-xl border border-border/30 bg-card p-4">
            <Skeleton className="mb-3 h-3 w-40 rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mb-2 flex items-center gap-3 rounded-xl border border-border/20 p-2.5">
                <Skeleton className="h-10 w-[3px] rounded-full" />
                <Skeleton className="h-9 w-32 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
                <Skeleton className="h-3 w-8 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border/30 bg-card p-4 xl:col-span-1">
          <Skeleton className="mb-3 h-3 w-36 rounded" />
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="mb-1.5 flex items-center gap-2 rounded-lg p-1.5">
              <Skeleton className="size-5 rounded-md" />
              <div className="flex-1">
                <Skeleton className="h-2.5 w-16 rounded" />
                <Skeleton className="mt-1 h-1 w-full rounded-full" />
              </div>
              <Skeleton className="h-3 w-8 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Establishments */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <SkeletonEstablishment key={i} />)}
      </div>

      {/* Charts + Notifications */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:col-span-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonChart key={i} />)}
        </div>
        <div className="rounded-xl border border-border/30 bg-card p-4">
          <Skeleton className="mb-3 h-3 w-36 rounded" />
          {[1, 2, 3, 4].map((i) => <SkeletonNotification key={i} />)}
        </div>
      </div>
    </div>
  )
}
