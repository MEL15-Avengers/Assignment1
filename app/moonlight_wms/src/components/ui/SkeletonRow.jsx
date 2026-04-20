export function SkeletonCell({ w = 'w-24', h = 'h-3' }) {
  return <div className={`skeleton rounded ${h} ${w}`} />
}

export function SkeletonRow({ cols = 5 }) {
  const widths = ['w-32', 'w-20', 'w-16', 'w-24', 'w-14']
  return (
    <tr className="border-t border-dark-600/40">
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} className="px-4 py-3.5">
          <SkeletonCell w={widths[i % widths.length]} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start gap-4">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-3 w-28 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </>
  )
}
