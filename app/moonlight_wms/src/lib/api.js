export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed: ${response.status}`
    try {
      const body = await response.json()
      message = body.error || body.reason || message
    } catch {}
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export const db = {
  health: () => api('/health'),
  login: (payload) => api('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  products: () => api('/products'),
  deleteProduct: (id) => api(`/products/${id}`, { method: 'DELETE' }),
  categories: () => api('/categories'),
  inventory: () => api('/inventory'),
  suppliers: () => api('/suppliers'),
  warehouses: () => api('/warehouses'),
  users: () => api('/users'),
  userById: (id) => api(`/users/${id}`),
}
