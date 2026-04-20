/**
 * Material Icons Round wrapper.
 * Usage: <MIcon name="dashboard" size={20} className="text-brand" />
 * Icon names: https://fonts.google.com/icons (use snake_case names)
 */
export default function MIcon({ name, size = 20, className = '', style }) {
  return (
    <span
      className={`mi select-none leading-none flex-shrink-0 ${className}`}
      style={{ fontSize: size, ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
