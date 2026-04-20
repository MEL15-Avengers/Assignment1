import { api } from './api'

export const getCodes = () => api('/registration/codes')

export const generateCode = (role) =>
  api('/registration/codes', { method: 'POST', body: JSON.stringify({ role }) })

export const deleteCode = (id) =>
  api(`/registration/codes/${id}`, { method: 'DELETE' })

export const getPendingAccounts = () => api('/registration/pending')

export const approveAccount = (id) =>
  api(`/registration/pending/${id}/approve`, { method: 'POST' })

export const rejectAccount = (id) =>
  api(`/registration/pending/${id}`, { method: 'DELETE' })

export const validateCode = (code, role) =>
  api('/registration/codes/validate', { method: 'POST', body: JSON.stringify({ code, role }) })

export const submitRegistration = (data) =>
  api('/registration/pending', { method: 'POST', body: JSON.stringify(data) })
