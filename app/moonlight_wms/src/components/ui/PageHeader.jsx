export default function PageHeader({ title, subtitle, children, icon: Icon }) {
  return (
    <div className="page-header">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
            <Icon size={16} className="text-brand" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {children}
        </div>
      )}
    </div>
  )
}
