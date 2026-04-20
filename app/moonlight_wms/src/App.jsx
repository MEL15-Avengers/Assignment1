import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import SiteManagerLayout from './components/SiteManagerLayout'
import { useAuth } from './context/AuthContext'

import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/NotFound'

import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import ProductDetails from './pages/ProductDetails'
import Categories from './pages/Categories'
import Suppliers from './pages/Suppliers'
import WarehouseZones from './pages/WarehouseZones'
import Inventory from './pages/Inventory'
import BatchTracking from './pages/BatchTracking'
import StockMovements from './pages/StockMovements'
import Alerts from './pages/Alerts'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'
import AuditLog from './pages/AuditLog'
import Settings from './pages/Settings'

import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import AddUser from './pages/admin/AddUser'
import EditUser from './pages/admin/EditUser'
import RoleManagement from './pages/admin/RoleManagement'
import PermissionManagement from './pages/admin/PermissionManagement'
import SiteAssignment from './pages/admin/SiteAssignment'
import UserActivityLogs from './pages/admin/UserActivityLogs'
import SecurityManagement from './pages/admin/SecurityManagement'
import AdminProfileSettings from './pages/admin/AdminProfileSettings'

import SiteManagerDashboard from './pages/sitemanager/SiteManagerDashboard'

function UserRoutes({ user, onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<Layout user={user} onLogout={onLogout} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard user={user} />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<AddProduct />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="categories" element={<Categories />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="batches" element={<BatchTracking />} />
        <Route path="movements" element={<StockMovements />} />
        <Route path="zones" element={<WarehouseZones />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="settings" element={<Settings user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

function SiteManagerRoutes({ user, onLogout }) {
  return (
    <Routes>
      <Route path="/sm" element={<SiteManagerLayout user={user} onLogout={onLogout} />}>
        <Route index element={<Navigate to="/sm/dashboard" replace />} />
        <Route path="dashboard" element={<SiteManagerDashboard user={user} />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="movements" element={<StockMovements />} />
        <Route path="batches" element={<BatchTracking />} />
        <Route path="zones" element={<WarehouseZones />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="categories" element={<Categories />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="settings" element={<Settings user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<Navigate to="/sm/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  const { auth, logout } = useAuth()

  if (!auth) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  if (auth.role === 'Admin') {
    return (
      <>
        <Routes>
          <Route path="/admin" element={<AdminLayout user={auth} onLogout={logout} />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/new" element={<AddUser />} />
            <Route path="users/:id/edit" element={<EditUser />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="permissions" element={<PermissionManagement />} />
            <Route path="sites" element={<SiteAssignment />} />
            <Route path="activity" element={<UserActivityLogs />} />
            <Route path="security" element={<SecurityManagement />} />
            <Route path="profile" element={<AdminProfileSettings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </>
    )
  }

  if (auth.role === 'Site Manager') {
    return (
      <>
        <SiteManagerRoutes user={auth} onLogout={logout} />
      </>
    )
  }

  // Manager and Employee both use the standard user routes
  return <UserRoutes user={auth} onLogout={logout} />
}
