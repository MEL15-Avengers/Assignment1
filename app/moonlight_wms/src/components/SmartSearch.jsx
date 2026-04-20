import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, Package, Truck, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedGlowingSearchBar from './ui/animated-glowing-search-bar'
import { cn } from '../lib/utils'

const STATUS_OPTIONS = ['In Stock', 'Low Stock', 'Out of Stock']
const MOVEMENT_OPTIONS = ['Stock In', 'Stock Out', 'Transfer', 'Adjustment']
const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low']

const PAGE_FILTERS = {
  '/products':     ['category', 'status', 'supplier'],
  '/sm/products':  ['category', 'status', 'supplier'],
  '/inventory':    ['category', 'status'],
  '/sm/inventory': ['category', 'status'],
  '/movements':    ['movement_type', 'date_range'],
  '/sm/movements': ['movement_type', 'date_range'],
  '/alerts':       ['priority', 'status_alert'],
  '/sm/alerts':    ['priority', 'status_alert'],
  '/batches':      ['status', 'date_range'],
  '/sm/batches':   ['status', 'date_range'],
}

function FilterChip({ label, onRemove }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand/15 border border-brand/25 text-xs text-brand font-medium"
    >
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors ml-0.5">
        <X size={10} />
      </button>
    </motion.span>
  )
}

function FilterSection({ title, options, selected, onToggle }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                active
                  ? 'bg-brand text-white shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                  : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500'
              )}
            >
              {active && <Check size={9} />}{opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Dropdown rendered via portal so it always floats above everything
function PortalDropdown({ anchorRef, open, children, align = 'left' }) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    if (!open || !anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    setPos({
      top: rect.bottom + 8,
      left: align === 'right' ? rect.right - 288 : rect.left,
      width: rect.width,
    })
  }, [open, align])

  // Recalculate on scroll/resize
  useEffect(() => {
    if (!open) return
    const update = () => {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({
        top: rect.bottom + 8,
        left: align === 'right' ? rect.right - 288 : rect.left,
        width: rect.width,
      })
    }
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update) }
  }, [open, align])

  if (!open) return null
  return createPortal(
    <div style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}>
      {children}
    </div>,
    document.body
  )
}

export default function SmartSearch() {
  const [query, setQuery] = useState('')
  const [resultsOpen, setResultsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: [], status: [], supplier: [],
    movement_type: [], priority: [], status_alert: [], date_range: '',
  })

  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef(null)
  const filterBtnRef = useRef(null)
  const filterPanelRef = useRef(null)

  const pageFilters = PAGE_FILTERS[location.pathname] || []

  const activeFilterCount = Object.entries(filters).reduce((acc, [k, v]) => {
    if (k === 'date_range') return acc + (v ? 1 : 0)
    return acc + (Array.isArray(v) ? v.length : 0)
  }, 0)

  const activeChips = []
  filters.category.forEach(c => activeChips.push({ key: 'category', val: c, label: c }))
  filters.status.forEach(s => activeChips.push({ key: 'status', val: s, label: s }))
  filters.supplier.forEach(s => activeChips.push({ key: 'supplier', val: s, label: s }))
  filters.movement_type.forEach(m => activeChips.push({ key: 'movement_type', val: m, label: m }))
  filters.priority.forEach(p => activeChips.push({ key: 'priority', val: p, label: p }))
  filters.status_alert.forEach(s => activeChips.push({ key: 'status_alert', val: s, label: s }))
  if (filters.date_range) activeChips.push({ key: 'date_range', val: '', label: filters.date_range })

  const toggle = (key, val) => setFilters(f => {
    const arr = f[key]
    if (!Array.isArray(arr)) return f
    return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
  })

  const removeChip = (key, val) => {
    if (key === 'date_range') { setFilters(f => ({ ...f, date_range: '' })); return }
    toggle(key, val)
  }

  const clearAll = () => setFilters({ category: [], status: [], supplier: [], movement_type: [], priority: [], status_alert: [], date_range: '' })

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (filterBtnRef.current?.contains(e.target)) return
      if (filterPanelRef.current?.contains(e.target)) return
      setFilterOpen(false)
      if (!searchRef.current?.contains(e.target)) setResultsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdowns on route change
  useEffect(() => { setFilterOpen(false); setResultsOpen(false); setQuery('') }, [location.pathname])

  const results = query.length > 1 ? [
    ...products.filter(p =>
      p.product_name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4).map(p => ({ ...p, _type: 'product' })),
    ...suppliers.filter(s =>
      s.supplier_name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 2).map(s => ({ ...s, _type: 'supplier' })),
    ...categories.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 2).map(c => ({ ...c, _type: 'category' })),
  ] : []

  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <div className="flex items-center gap-2 flex-1 max-w-xl">

      {/* Search input */}
      <div className="relative flex-1" ref={searchRef}>
        <AnimatedGlowingSearchBar
          value={query}
          onChange={v => { setQuery(v); setResultsOpen(true) }}
          placeholder={isAdminPath ? 'Search users, roles…' : 'Search products, suppliers…'}
          className="w-full"
        />

        {/* Search results — portal so it escapes overflow:hidden */}
        <PortalDropdown anchorRef={searchRef} open={resultsOpen && results.length > 0} align="left">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="w-80 bg-dark-700/95 backdrop-blur-md border border-dark-400 rounded-xl shadow-2xl overflow-hidden"
          >
            {results.map((r, i) => (
              <motion.button
                key={r.id + r._type}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onMouseDown={() => {
                  if (r._type === 'product') navigate(`/products/${r.id}`)
                  else if (r._type === 'supplier') navigate('/suppliers')
                  else navigate('/categories')
                  setQuery(''); setResultsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-600 transition-colors text-left"
              >
                <div className={cn(
                  'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs',
                  r._type === 'product' ? 'bg-blue-500/15 text-blue-400' :
                  r._type === 'supplier' ? 'bg-brand/15 text-brand' : 'bg-purple-500/15 text-purple-400'
                )}>
                  {r._type === 'product' ? <Package size={12} /> :
                   r._type === 'supplier' ? <Truck size={12} /> : (r.icon || '📦')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">{r.product_name || r.supplier_name || r.name}</p>
                  {r.sku && <p className="text-xs text-gray-500">{r.sku}</p>}
                </div>
                <span className={cn('badge text-xs flex-shrink-0',
                  r._type === 'product' ? 'badge-blue' : r._type === 'supplier' ? 'badge-green' : 'badge-gray'
                )}>{r._type}</span>
              </motion.button>
            ))}
            <div className="px-4 py-2 border-t border-dark-500 bg-dark-800/80">
              <p className="text-xs text-gray-600">{results.length} result{results.length !== 1 ? 's' : ''}</p>
            </div>
          </motion.div>
        </PortalDropdown>
      </div>

      {/* Filter button */}
      {pageFilters.length > 0 && (
        <>
          <motion.button
            ref={filterBtnRef}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterOpen(o => !o)}
            className={cn(
              'relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border flex-shrink-0',
              filterOpen || activeFilterCount > 0
                ? 'bg-brand/15 border-brand/40 text-brand shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                : 'bg-dark-700 border-dark-400 text-gray-400 hover:text-white hover:border-dark-300'
            )}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown size={12} className={cn('transition-transform duration-200', filterOpen && 'rotate-180')} />
            {activeFilterCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center"
              >
                {activeFilterCount}
              </motion.span>
            )}
          </motion.button>

          {/* Filter panel — portal, always on top */}
          <PortalDropdown anchorRef={filterBtnRef} open={filterOpen} align="right">
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  ref={filterPanelRef}
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="w-72 bg-dark-800/95 backdrop-blur-md border border-dark-400 rounded-xl shadow-2xl p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Filter Options</p>
                    {activeFilterCount > 0 && (
                      <button onClick={clearAll} className="text-xs text-brand hover:text-brand-light transition-colors flex items-center gap-1">
                        <X size={10} />Clear all
                      </button>
                    )}
                  </div>

                  {pageFilters.includes('category') && (
                    <FilterSection title="Category" options={categories.slice(0, 6).map(c => c.name)}
                      selected={filters.category} onToggle={v => toggle('category', v)} />
                  )}
                  {pageFilters.includes('status') && (
                    <FilterSection title="Stock Status" options={STATUS_OPTIONS}
                      selected={filters.status} onToggle={v => toggle('status', v)} />
                  )}
                  {pageFilters.includes('supplier') && (
                    <FilterSection title="Supplier"
                      options={['FreshLine Foods', 'Dairy Co Australia', 'Primo Smallgoods', 'Golden Circle']}
                      selected={filters.supplier} onToggle={v => toggle('supplier', v)} />
                  )}
                  {pageFilters.includes('movement_type') && (
                    <FilterSection title="Movement Type" options={MOVEMENT_OPTIONS}
                      selected={filters.movement_type} onToggle={v => toggle('movement_type', v)} />
                  )}
                  {pageFilters.includes('priority') && (
                    <FilterSection title="Priority" options={PRIORITY_OPTIONS}
                      selected={filters.priority} onToggle={v => toggle('priority', v)} />
                  )}
                  {pageFilters.includes('status_alert') && (
                    <FilterSection title="Alert Status" options={['Active', 'Resolved', 'Acknowledged']}
                      selected={filters.status_alert} onToggle={v => toggle('status_alert', v)} />
                  )}
                  {pageFilters.includes('date_range') && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date Range</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Today', 'This Week', 'This Month', 'Last 30 Days'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setFilters(f => ({ ...f, date_range: f.date_range === opt ? '' : opt }))}
                            className={cn(
                              'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                              filters.date_range === opt
                                ? 'bg-brand text-white shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                                : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500'
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-dark-500">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setFilterOpen(false)}
                      className="w-full py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-light transition-colors shadow-[0_0_12px_rgba(34,197,94,0.25)]"
                    >
                      Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </PortalDropdown>
        </>
      )}

      {/* Active filter chips */}
      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-1.5 flex-wrap max-w-xs"
          >
            {activeChips.slice(0, 3).map(chip => (
              <FilterChip key={chip.key + chip.val} label={chip.label} onRemove={() => removeChip(chip.key, chip.val)} />
            ))}
            {activeChips.length > 3 && (
              <span className="text-xs text-gray-500 self-center">+{activeChips.length - 3} more</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
