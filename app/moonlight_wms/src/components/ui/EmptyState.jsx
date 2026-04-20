import { PackageSearch } from 'lucide-react'

export default function EmptyState({
  icon: Icon = PackageSearch,
  title = 'Nothing here yet',
  description,
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrap">
        <Icon size={24} className="text-gray-500" />
      </div>
      <p className="text-sm font-semibold text-gray-300">{title}</p>
      {description && <p className="text-xs text-gray-600 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
