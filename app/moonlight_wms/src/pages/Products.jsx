import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Eye, Pencil, Trash2, Package } from 'lucide-react'
import { db } from '../lib/api'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import SkeletonTable from '../components/ui/SkeletonRow'

function StatusBadge({ status }) {
  const map = { active: 'badge-green', low: 'badge-yellow', out: 'badge-red' }
  const labels = { active: 'In Stock', low: 'Low Stock', out: 'Out of Stock' }
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{labels[status] || status}</span>
}

export default function Products() {
  const [products, setProducts] = useState(null)
  const [categoryList, setCategoryList] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    db.products().then(setProducts).catch(() => {})
    db.categories().then(setCategoryList).catch(() => {})
  }, [])

  const cats = ['All', ...(categoryList || []).map(c => c.name)]
  const loading = products === null

  const filtered = (products || []).filter(p => {
    const q = query.toLowerCase()
    const matchQ = !query || p.product_name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.barcode || '').includes(q)
    const matchC = category === 'All' || p.category === category
    return matchQ && matchC
  })

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return
    try { await db.deleteProduct(id) } catch {}
    setProducts(ps => ps.filter(p => p.id !== id))
  }

  const totalValue = filtered.reduce((s, p) => s + p.quantity * p.selling_price, 0)

  return (
    <div className="page-container">
      <PageHeader
        title="Products"
        subtitle={loading ? 'Loading…' : `${filtered.length} products · $${totalValue.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} est. value`}
        icon={Package}
      >
        <button className="btn-primary" onClick={() => navigate('/products/new')}>
          <Plus size={14} /> Add Product
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="search-bar flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="search-icon" />
          <input
            className="input pl-9 py-2"
            placeholder="Name, SKU or barcode…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input py-2 w-44 flex-shrink-0"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-dark-600/60 bg-dark-700/40">
              <th className="table-header px-4 py-3 text-left">Product</th>
              <th className="table-header px-4 py-3 text-left">Category</th>
              <th className="table-header px-4 py-3 text-left">Barcode</th>
              <th className="table-header px-4 py-3 text-right">Cost</th>
              <th className="table-header px-4 py-3 text-right">Price</th>
              <th className="table-header px-4 py-3 text-right">Qty</th>
              <th className="table-header px-4 py-3 text-left">Location</th>
              <th className="table-header px-4 py-3 text-left">Status</th>
              <th className="table-header px-4 py-3 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <SkeletonTable rows={6} cols={9} />}

            {!loading && filtered.map(p => (
              <tr key={p.id} className="table-row">
                <td className="px-4 py-3.5">
                  <p className="text-sm font-semibold text-gray-200">{p.product_name}</p>
                  <p className="text-2xs text-gray-600 font-mono mt-0.5">{p.sku}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-gray-400 bg-dark-600/60 px-2 py-0.5 rounded-md">
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-2xs text-gray-600 font-mono whitespace-nowrap">
                  {p.barcode || '—'}
                </td>
                <td className="px-4 py-3.5 text-xs text-gray-500 text-right whitespace-nowrap">
                  ${p.unit_cost.toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-sm font-semibold text-gray-200 text-right whitespace-nowrap">
                  ${p.selling_price.toFixed(2)}
                </td>
                <td className={`px-4 py-3.5 text-sm font-bold text-right whitespace-nowrap
                  ${p.quantity === 0 ? 'text-red-400' : p.status === 'low' ? 'text-amber-400' : 'text-gray-200'}`}>
                  {p.quantity}
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-xs text-gray-400">{p.location}</p>
                  <p className="text-2xs text-gray-600 truncate max-w-[110px] mt-0.5">{p.warehouse}</p>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-0.5">
                    <button
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="btn-icon-sm hover:text-blue-400 hover:bg-blue-500/10"
                      title="View"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="btn-icon-sm hover:text-brand hover:bg-brand/10"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn-icon-sm hover:text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={9}>
                  <EmptyState
                    icon={Package}
                    title="No products found"
                    description={query ? `No results for "${query}". Try a different search.` : 'Add your first product to get started.'}
                    action={
                      !query && (
                        <button className="btn-primary btn-sm" onClick={() => navigate('/products/new')}>
                          <Plus size={13} /> Add Product
                        </button>
                      )
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
