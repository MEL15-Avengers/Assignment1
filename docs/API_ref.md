
# API Reference  
## Moonlight Warehouse Inventory Management System

**Version:** 1.0  
**Document Type:** API Reference  
**Project Name:** Moonlight Warehouse Inventory Management System  
**API Type:** REST API  
**Backend:** Node.js / Express.js  
**Database:** PostgreSQL  
**Authentication:** JWT Bearer Token  
**Base URL - Local:** `http://localhost:5000/api`  
**Base URL - Production:** `https://your-backend-domain.com/api`

---

## Table of Contents

1. Introduction  
2. API Standards  
3. Base URLs  
4. Authentication  
5. Common Headers  
6. Common Response Format  
7. Common Error Response Format  
8. HTTP Status Codes  
9. Pagination, Search, and Filtering  
10. Authentication APIs  
11. User APIs  
12. Role APIs  
13. Permission APIs  
14. Warehouse APIs  
15. Category APIs  
16. Supplier APIs  
17. Product APIs  
18. Inventory APIs  
19. Stock-In APIs  
20. Stock-Out APIs  
21. Stock Adjustment APIs  
22. Stock Transfer APIs  
23. Approval APIs  
24. Notification APIs  
25. Report APIs  
26. Audit Log APIs  
27. Backup and Export APIs  
28. Health Check API  
29. Example Error Scenarios  
30. Appendix A: Permission Matrix  
31. Appendix B: Example Data Models  

---

# 1. Introduction

This API Reference documents the backend REST API for the Moonlight Warehouse Inventory Management System.

The API allows the frontend application to communicate with the backend server for authentication, user management, role management, warehouse setup, product management, inventory tracking, stock-in, stock-out, stock transfer, approvals, reports, notifications, audit logs, and backup/export operations.

This document is intended for:

- Frontend developers
- Backend developers
- Testers
- API integration developers
- Project evaluators

---

# 2. API Standards

The API follows REST-style conventions.

## 2.1 Request Format

Most API requests use JSON request bodies.

```http
Content-Type: application/json
````

## 2.2 Response Format

Most API responses return JSON.

```http
Content-Type: application/json
```

## 2.3 Date Format

Dates should use ISO 8601 format.

```text
2026-04-19T10:30:00.000Z
```

## 2.4 Naming Convention

JSON fields should use camelCase.

Example:

```json
{
  "fullName": "System Admin",
  "warehouseId": 1,
  "createdAt": "2026-04-19T10:30:00.000Z"
}
```

## 2.5 Resource Naming

API endpoints should use plural nouns.

Correct:

```text
/api/users
/api/products
/api/warehouses
```

Avoid:

```text
/api/getUser
/api/createProduct
```

---

# 3. Base URLs

## 3.1 Local Development Base URL

```text
http://localhost:5000/api
```

## 3.2 Production Base URL

```text
https://your-backend-domain.com/api
```

---

# 4. Authentication

The system uses JWT Bearer Token authentication.

After successful login, the backend returns a token. The frontend must send this token in the `Authorization` header for protected requests.

## 4.1 Authorization Header

```http
Authorization: Bearer <jwt_token>
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## 4.2 Public APIs

The following APIs do not require authentication:

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/auth/register`        | Register new user      |
| POST   | `/auth/login`           | Login user             |
| POST   | `/auth/forgot-password` | Request password reset |
| POST   | `/auth/reset-password`  | Reset password         |
| GET    | `/health`               | Check API status       |

## 4.3 Protected APIs

All other APIs require a valid JWT token.

---

# 5. Common Headers

## 5.1 JSON Request Headers

```http
Content-Type: application/json
Accept: application/json
```

## 5.2 Protected Request Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>
```

---

# 6. Common Response Format

Successful responses should follow this structure:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

Example:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "sku": "GLV-001",
    "name": "Safety Gloves"
  }
}
```

---

# 7. Common Error Response Format

Error responses should follow this structure:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": []
}
```

Example:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

# 8. HTTP Status Codes

| Status Code | Meaning               | Usage                                   |
| ----------- | --------------------- | --------------------------------------- |
| 200         | OK                    | Request completed successfully          |
| 201         | Created               | New resource created                    |
| 400         | Bad Request           | Invalid request data                    |
| 401         | Unauthorized          | Missing or invalid authentication token |
| 403         | Forbidden             | User does not have permission           |
| 404         | Not Found             | Resource not found                      |
| 409         | Conflict              | Duplicate or conflicting data           |
| 422         | Unprocessable Entity  | Validation failed                       |
| 500         | Internal Server Error | Server-side error                       |

---

# 9. Pagination, Search, and Filtering

List APIs should support pagination, search, and filters.

## 9.1 Pagination Query Parameters

```text
?page=1&limit=10
```

Example:

```http
GET /api/products?page=1&limit=10
```

## 9.2 Search Query Parameter

```text
?search=safety
```

Example:

```http
GET /api/products?search=safety
```

## 9.3 Sorting Query Parameters

```text
?sortBy=name&order=asc
```

Example:

```http
GET /api/products?sortBy=name&order=asc
```

## 9.4 Filter Example

```http
GET /api/inventory?warehouseId=1&categoryId=2&status=low_stock
```

## 9.5 Paginated Response Example

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "sku": "GLV-001",
      "name": "Safety Gloves"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 25,
    "totalPages": 3
  }
}
```

---

# 10. Authentication APIs

## 10.1 Register User

Registers a new user account.

```http
POST /auth/register
```

### Request Body

```json
{
  "fullName": "Anil Budthapa",
  "email": "anil@example.com",
  "phone": "0400000000",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "warehouseId": 1
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Registration submitted successfully. Please wait for admin approval.",
  "data": {
    "id": 5,
    "fullName": "Anil Budthapa",
    "email": "anil@example.com",
    "status": "pending"
  }
}
```

### Possible Errors

| Status | Message                                    |
| ------ | ------------------------------------------ |
| 400    | Password and confirm password do not match |
| 409    | Email already exists                       |
| 422    | Validation failed                          |

---

## 10.2 Login User

Authenticates user and returns JWT token.

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "admin@moonlight.com",
  "password": "Admin@12345"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": 1,
      "fullName": "System Admin",
      "email": "admin@moonlight.com",
      "role": "Admin",
      "warehouseId": null,
      "status": "active"
    }
  }
}
```

### Possible Errors

| Status | Message                         |
| ------ | ------------------------------- |
| 400    | Email and password are required |
| 401    | Invalid email or password       |
| 403    | Account is pending approval     |
| 403    | Account is disabled             |

---

## 10.3 Logout User

Logs out current user.

```http
POST /auth/logout
```

### Headers

```http
Authorization: Bearer <jwt_token>
```

### Successful Response

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 10.4 Get Logged-In User Profile

Returns current user profile.

```http
GET /auth/profile
```

### Headers

```http
Authorization: Bearer <jwt_token>
```

### Successful Response

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "fullName": "System Admin",
    "email": "admin@moonlight.com",
    "phone": "0400000000",
    "role": "Admin",
    "warehouseId": null,
    "status": "active"
  }
}
```

---

## 10.5 Forgot Password

Sends password reset request.

```http
POST /auth/forgot-password
```

### Request Body

```json
{
  "email": "anil@example.com"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Password reset instructions have been sent if the email exists."
}
```

---

## 10.6 Reset Password

Resets user password.

```http
POST /auth/reset-password
```

### Request Body

```json
{
  "token": "reset_token_here",
  "newPassword": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

# 11. User APIs

## 11.1 Get All Users

```http
GET /users
```

### Required Role

```text
Admin
```

### Query Parameters

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| page      | number | No       | Page number             |
| limit     | number | No       | Items per page          |
| search    | string | No       | Search by name or email |
| role      | string | No       | Filter by role          |
| status    | string | No       | Filter by status        |

### Successful Response

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "fullName": "System Admin",
      "email": "admin@moonlight.com",
      "role": "Admin",
      "status": "active"
    }
  ]
}
```

---

## 11.2 Get User by ID

```http
GET /users/:id
```

### Required Role

```text
Admin
```

### Successful Response

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 2,
    "fullName": "Warehouse Manager",
    "email": "manager@moonlight.com",
    "phone": "0400000001",
    "role": "Manager",
    "warehouseId": 1,
    "status": "active"
  }
}
```

---

## 11.3 Create User

```http
POST /users
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "fullName": "Warehouse Employee",
  "email": "employee@moonlight.com",
  "phone": "0400000002",
  "password": "Employee@123",
  "roleId": 4,
  "warehouseId": 1,
  "status": "active"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 10,
    "fullName": "Warehouse Employee",
    "email": "employee@moonlight.com",
    "roleId": 4,
    "warehouseId": 1,
    "status": "active"
  }
}
```

---

## 11.4 Update User

```http
PUT /users/:id
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "fullName": "Updated Employee",
  "phone": "0400000099",
  "roleId": 4,
  "warehouseId": 1,
  "status": "active"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "User updated successfully"
}
```

---

## 11.5 Update User Status

```http
PATCH /users/:id/status
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "status": "disabled"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "User status updated successfully"
}
```

---

## 11.6 Approve User

```http
PATCH /users/:id/approve
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "roleId": 4,
  "warehouseId": 1
}
```

### Successful Response

```json
{
  "success": true,
  "message": "User approved successfully"
}
```

---

## 11.7 Reject User

```http
PATCH /users/:id/reject
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "reason": "Invalid registration details"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "User request rejected successfully"
}
```

---

## 11.8 Delete User

```http
DELETE /users/:id
```

### Required Role

```text
Admin
```

### Successful Response

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

# 12. Role APIs

## 12.1 Get All Roles

```http
GET /roles
```

### Required Role

```text
Admin
```

### Successful Response

```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "description": "Full system access"
    },
    {
      "id": 2,
      "name": "Manager",
      "description": "Warehouse management access"
    }
  ]
}
```

---

## 12.2 Create Role

```http
POST /roles
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "name": "Auditor",
  "description": "Can view reports and audit logs"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Role created successfully"
}
```

---

## 12.3 Update Role

```http
PUT /roles/:id
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "name": "Manager",
  "description": "Can approve stock requests and view reports"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Role updated successfully"
}
```

---

## 12.4 Delete Role

```http
DELETE /roles/:id
```

### Required Role

```text
Admin
```

### Successful Response

```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

---

# 13. Permission APIs

## 13.1 Get All Permissions

```http
GET /permissions
```

### Required Role

```text
Admin
```

### Successful Response

```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "manage_users"
    },
    {
      "id": 2,
      "name": "view_inventory"
    }
  ]
}
```

---

## 13.2 Assign Permissions to Role

```http
PUT /roles/:id/permissions
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "permissionIds": [1, 2, 3, 4]
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Role permissions updated successfully"
}
```

---

# 14. Warehouse APIs

## 14.1 Get All Warehouses

```http
GET /warehouses
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Warehouses retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Melbourne Warehouse",
      "location": "Melbourne",
      "address": "Melbourne VIC",
      "status": "active"
    }
  ]
}
```

---

## 14.2 Get Warehouse by ID

```http
GET /warehouses/:id
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Warehouse retrieved successfully",
  "data": {
    "id": 1,
    "name": "Melbourne Warehouse",
    "location": "Melbourne",
    "address": "Melbourne VIC",
    "contactPerson": "Site Manager",
    "phone": "0400000003",
    "capacity": 10000,
    "status": "active"
  }
}
```

---

## 14.3 Create Warehouse

```http
POST /warehouses
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "name": "Sydney Warehouse",
  "location": "Sydney",
  "address": "Sydney NSW",
  "contactPerson": "Sydney Site Manager",
  "phone": "0400000004",
  "capacity": 15000,
  "status": "active"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Warehouse created successfully",
  "data": {
    "id": 2,
    "name": "Sydney Warehouse"
  }
}
```

---

## 14.4 Update Warehouse

```http
PUT /warehouses/:id
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "name": "Updated Sydney Warehouse",
  "location": "Sydney",
  "address": "Updated Address",
  "contactPerson": "New Site Manager",
  "phone": "0400000005",
  "capacity": 20000,
  "status": "active"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Warehouse updated successfully"
}
```

---

## 14.5 Delete or Disable Warehouse

```http
DELETE /warehouses/:id
```

### Required Role

```text
Admin
```

### Successful Response

```json
{
  "success": true,
  "message": "Warehouse deleted successfully"
}
```

Recommended professional behavior:

```text
If a warehouse has stock history, disable/archive it instead of permanently deleting it.
```

---

# 15. Category APIs

## 15.1 Get All Categories

```http
GET /categories
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Successful Response

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Safety Equipment",
      "description": "Safety-related warehouse products"
    }
  ]
}
```

---

## 15.2 Create Category

```http
POST /categories
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "name": "Tools",
  "description": "Warehouse tools and equipment"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Category created successfully"
}
```

---

## 15.3 Update Category

```http
PUT /categories/:id
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "name": "Updated Tools",
  "description": "Updated category description"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Category updated successfully"
}
```

---

## 15.4 Delete Category

```http
DELETE /categories/:id
```

### Required Roles

```text
Admin, Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

# 16. Supplier APIs

## 16.1 Get All Suppliers

```http
GET /suppliers
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Suppliers retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "ABC Safety Supplies",
      "contactPerson": "John Smith",
      "email": "contact@abcsafety.com",
      "phone": "0400000006"
    }
  ]
}
```

---

## 16.2 Create Supplier

```http
POST /suppliers
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "name": "ABC Safety Supplies",
  "contactPerson": "John Smith",
  "email": "contact@abcsafety.com",
  "phone": "0400000006",
  "address": "Melbourne VIC",
  "productType": "Safety Equipment"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Supplier created successfully"
}
```

---

## 16.3 Update Supplier

```http
PUT /suppliers/:id
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "name": "Updated Supplier",
  "contactPerson": "Updated Person",
  "email": "updated@supplier.com",
  "phone": "0400000007",
  "address": "Updated Address",
  "productType": "Tools"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Supplier updated successfully"
}
```

---

## 16.4 Delete Supplier

```http
DELETE /suppliers/:id
```

### Required Roles

```text
Admin, Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Supplier deleted successfully"
}
```

---

# 17. Product APIs

## 17.1 Get All Products

```http
GET /products
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Query Parameters

| Parameter  | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| page       | number | No       | Page number              |
| limit      | number | No       | Items per page           |
| search     | string | No       | Product name or SKU      |
| categoryId | number | No       | Filter by category       |
| supplierId | number | No       | Filter by supplier       |
| status     | string | No       | Filter by product status |

### Successful Response

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "sku": "GLV-001",
      "name": "Safety Gloves",
      "category": "Safety Equipment",
      "supplier": "ABC Safety Supplies",
      "unit": "pair",
      "unitPrice": 12.5,
      "status": "active"
    }
  ]
}
```

---

## 17.2 Get Product by ID

```http
GET /products/:id
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Successful Response

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "sku": "GLV-001",
    "name": "Safety Gloves",
    "description": "Protective gloves for warehouse staff",
    "categoryId": 1,
    "supplierId": 1,
    "unit": "pair",
    "unitPrice": 12.5,
    "minStockLevel": 20,
    "maxStockLevel": 500,
    "status": "active"
  }
}
```

---

## 17.3 Create Product

```http
POST /products
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "sku": "GLV-001",
  "name": "Safety Gloves",
  "description": "Protective gloves for warehouse staff",
  "categoryId": 1,
  "supplierId": 1,
  "unit": "pair",
  "unitPrice": 12.5,
  "minStockLevel": 20,
  "maxStockLevel": 500,
  "status": "active"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "sku": "GLV-001",
    "name": "Safety Gloves"
  }
}
```

### Possible Errors

| Status | Message            |
| ------ | ------------------ |
| 409    | SKU already exists |
| 422    | Validation failed  |

---

## 17.4 Update Product

```http
PUT /products/:id
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "sku": "GLV-001",
  "name": "Updated Safety Gloves",
  "description": "Updated description",
  "categoryId": 1,
  "supplierId": 1,
  "unit": "pair",
  "unitPrice": 13.0,
  "minStockLevel": 30,
  "maxStockLevel": 600,
  "status": "active"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Product updated successfully"
}
```

---

## 17.5 Delete or Archive Product

```http
DELETE /products/:id
```

### Required Roles

```text
Admin, Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Product archived successfully"
}
```

Recommended professional behavior:

```text
Products with stock movement history should be archived instead of permanently deleted.
```

---

# 18. Inventory APIs

## 18.1 Get Inventory List

```http
GET /inventory
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Query Parameters

| Parameter   | Type   | Required | Description                                |
| ----------- | ------ | -------- | ------------------------------------------ |
| warehouseId | number | No       | Filter by warehouse                        |
| productId   | number | No       | Filter by product                          |
| categoryId  | number | No       | Filter by category                         |
| status      | string | No       | normal, low_stock, out_of_stock, overstock |

### Successful Response

```json
{
  "success": true,
  "message": "Inventory retrieved successfully",
  "data": [
    {
      "productId": 1,
      "sku": "GLV-001",
      "productName": "Safety Gloves",
      "warehouseId": 1,
      "warehouseName": "Melbourne Warehouse",
      "quantity": 100,
      "minStockLevel": 20,
      "maxStockLevel": 500,
      "stockStatus": "normal"
    }
  ]
}
```

---

## 18.2 Get Inventory by Product

```http
GET /inventory/product/:productId
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Successful Response

```json
{
  "success": true,
  "message": "Product inventory retrieved successfully",
  "data": [
    {
      "warehouseId": 1,
      "warehouseName": "Melbourne Warehouse",
      "quantity": 100,
      "stockStatus": "normal"
    }
  ]
}
```

---

## 18.3 Get Inventory by Warehouse

```http
GET /inventory/warehouse/:warehouseId
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Successful Response

```json
{
  "success": true,
  "message": "Warehouse inventory retrieved successfully",
  "data": [
    {
      "productId": 1,
      "sku": "GLV-001",
      "productName": "Safety Gloves",
      "quantity": 100,
      "stockStatus": "normal"
    }
  ]
}
```

---

## 18.4 Get Low Stock Items

```http
GET /inventory/low-stock
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Low-stock items retrieved successfully",
  "data": [
    {
      "productId": 2,
      "sku": "MASK-001",
      "productName": "Safety Mask",
      "warehouseId": 1,
      "warehouseName": "Melbourne Warehouse",
      "quantity": 5,
      "minStockLevel": 20,
      "shortageQuantity": 15
    }
  ]
}
```

---

# 19. Stock-In APIs

## 19.1 Create Stock-In Record

```http
POST /stock/in
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Request Body

```json
{
  "productId": 1,
  "warehouseId": 1,
  "quantity": 100,
  "supplierId": 1,
  "referenceNo": "PO-10021",
  "receivedDate": "2026-04-19",
  "remarks": "Initial stock received"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Stock-in recorded successfully",
  "data": {
    "movementId": 1,
    "productId": 1,
    "warehouseId": 1,
    "quantity": 100,
    "movementType": "stock_in"
  }
}
```

### System Behavior

After successful stock-in:

1. Inventory quantity increases.
2. Stock movement record is created.
3. Audit log is created.
4. Low-stock status is recalculated.

---

## 19.2 Get Stock-In Records

```http
GET /stock/in
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Query Parameters

| Parameter   | Type   | Required | Description         |
| ----------- | ------ | -------- | ------------------- |
| warehouseId | number | No       | Filter by warehouse |
| productId   | number | No       | Filter by product   |
| fromDate    | string | No       | Start date          |
| toDate      | string | No       | End date            |

### Successful Response

```json
{
  "success": true,
  "message": "Stock-in records retrieved successfully",
  "data": [
    {
      "movementId": 1,
      "productName": "Safety Gloves",
      "warehouseName": "Melbourne Warehouse",
      "quantity": 100,
      "referenceNo": "PO-10021",
      "createdBy": "Warehouse Employee",
      "createdAt": "2026-04-19T10:30:00.000Z"
    }
  ]
}
```

---

# 20. Stock-Out APIs

## 20.1 Create Stock-Out Record

```http
POST /stock/out
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Request Body

```json
{
  "productId": 1,
  "warehouseId": 1,
  "quantity": 20,
  "reason": "Internal use",
  "referenceNo": "OUT-1001",
  "remarks": "Issued to warehouse staff"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Stock-out recorded successfully",
  "data": {
    "movementId": 2,
    "productId": 1,
    "warehouseId": 1,
    "quantity": 20,
    "movementType": "stock_out"
  }
}
```

### System Behavior

After successful stock-out:

1. System checks available quantity.
2. Inventory quantity decreases.
3. Stock movement record is created.
4. Audit log is created.
5. Low-stock alert is created if quantity falls below minimum stock level.

### Possible Errors

| Status | Message                            |
| ------ | ---------------------------------- |
| 400    | Quantity must be greater than zero |
| 409    | Insufficient stock available       |
| 404    | Product or warehouse not found     |

---

## 20.2 Get Stock-Out Records

```http
GET /stock/out
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Stock-out records retrieved successfully",
  "data": [
    {
      "movementId": 2,
      "productName": "Safety Gloves",
      "warehouseName": "Melbourne Warehouse",
      "quantity": 20,
      "reason": "Internal use",
      "createdBy": "Warehouse Employee",
      "createdAt": "2026-04-19T11:00:00.000Z"
    }
  ]
}
```

---

# 21. Stock Adjustment APIs

## 21.1 Create Stock Adjustment

```http
POST /stock/adjustment
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Request Body

```json
{
  "productId": 1,
  "warehouseId": 1,
  "adjustmentType": "decrease",
  "quantity": 5,
  "reason": "Damaged items found during stock count",
  "requiresApproval": true
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Stock adjustment submitted successfully",
  "data": {
    "adjustmentId": 1,
    "status": "pending"
  }
}
```

---

## 21.2 Approve Stock Adjustment

```http
PATCH /stock/adjustment/:id/approve
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "remarks": "Approved after physical verification"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Stock adjustment approved successfully"
}
```

---

## 21.3 Reject Stock Adjustment

```http
PATCH /stock/adjustment/:id/reject
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "remarks": "Quantity mismatch not verified"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Stock adjustment rejected successfully"
}
```

---

# 22. Stock Transfer APIs

## 22.1 Create Transfer Request

```http
POST /transfers
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Request Body

```json
{
  "productId": 1,
  "sourceWarehouseId": 1,
  "destinationWarehouseId": 2,
  "quantity": 50,
  "reason": "Rebalancing stock between warehouses"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Transfer request created successfully",
  "data": {
    "transferId": 1,
    "status": "pending"
  }
}
```

---

## 22.2 Get Transfer Requests

```http
GET /transfers
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Query Parameters

| Parameter              | Type   | Required | Description                            |
| ---------------------- | ------ | -------- | -------------------------------------- |
| status                 | string | No       | pending, approved, rejected, completed |
| sourceWarehouseId      | number | No       | Filter by source warehouse             |
| destinationWarehouseId | number | No       | Filter by destination warehouse        |

### Successful Response

```json
{
  "success": true,
  "message": "Transfer requests retrieved successfully",
  "data": [
    {
      "transferId": 1,
      "productName": "Safety Gloves",
      "sourceWarehouse": "Melbourne Warehouse",
      "destinationWarehouse": "Sydney Warehouse",
      "quantity": 50,
      "status": "pending",
      "requestedBy": "Site Manager"
    }
  ]
}
```

---

## 22.3 Approve Transfer Request

```http
PATCH /transfers/:id/approve
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "remarks": "Approved for Sydney warehouse shortage"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Transfer request approved successfully"
}
```

---

## 22.4 Reject Transfer Request

```http
PATCH /transfers/:id/reject
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "remarks": "Source warehouse does not have enough stock"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Transfer request rejected successfully"
}
```

---

## 22.5 Complete Transfer

```http
PATCH /transfers/:id/complete
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Request Body

```json
{
  "remarks": "Stock received by destination warehouse"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Transfer completed successfully"
}
```

### System Behavior

After completing transfer:

1. Quantity is deducted from source warehouse.
2. Quantity is added to destination warehouse.
3. Stock movement records are created.
4. Transfer status becomes `completed`.
5. Audit logs are created.

---

# 23. Approval APIs

## 23.1 Get Pending Approvals

```http
GET /approvals/pending
```

### Required Roles

```text
Admin, Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Pending approvals retrieved successfully",
  "data": [
    {
      "approvalId": 1,
      "requestType": "stock_transfer",
      "requestId": 1,
      "requestedBy": "Site Manager",
      "status": "pending",
      "createdAt": "2026-04-19T10:30:00.000Z"
    }
  ]
}
```

---

## 23.2 Approve Request

```http
PATCH /approvals/:id/approve
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "remarks": "Approved"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Request approved successfully"
}
```

---

## 23.3 Reject Request

```http
PATCH /approvals/:id/reject
```

### Required Roles

```text
Admin, Manager
```

### Request Body

```json
{
  "remarks": "Rejected due to insufficient information"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Request rejected successfully"
}
```

---

# 24. Notification APIs

## 24.1 Get My Notifications

```http
GET /notifications
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Successful Response

```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Low Stock Alert",
      "message": "Safety Masks are below minimum stock level.",
      "isRead": false,
      "createdAt": "2026-04-19T10:30:00.000Z"
    }
  ]
}
```

---

## 24.2 Mark Notification as Read

```http
PATCH /notifications/:id/read
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Successful Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 24.3 Mark All Notifications as Read

```http
PATCH /notifications/read-all
```

### Required Roles

```text
Admin, Manager, Site Manager, Employee
```

### Successful Response

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

# 25. Report APIs

## 25.1 Inventory Report

```http
GET /reports/inventory
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Query Parameters

| Parameter   | Type   | Required | Description                     |
| ----------- | ------ | -------- | ------------------------------- |
| warehouseId | number | No       | Filter by warehouse             |
| categoryId  | number | No       | Filter by category              |
| status      | string | No       | normal, low_stock, out_of_stock |

### Successful Response

```json
{
  "success": true,
  "message": "Inventory report generated successfully",
  "data": [
    {
      "sku": "GLV-001",
      "productName": "Safety Gloves",
      "category": "Safety Equipment",
      "warehouse": "Melbourne Warehouse",
      "quantity": 100,
      "minStockLevel": 20,
      "stockStatus": "normal"
    }
  ]
}
```

---

## 25.2 Stock Movement Report

```http
GET /reports/stock-movements
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Query Parameters

| Parameter    | Type   | Required | Description                               |
| ------------ | ------ | -------- | ----------------------------------------- |
| fromDate     | string | No       | Start date                                |
| toDate       | string | No       | End date                                  |
| warehouseId  | number | No       | Filter by warehouse                       |
| productId    | number | No       | Filter by product                         |
| movementType | string | No       | stock_in, stock_out, transfer, adjustment |

### Successful Response

```json
{
  "success": true,
  "message": "Stock movement report generated successfully",
  "data": [
    {
      "movementId": 1,
      "movementType": "stock_in",
      "productName": "Safety Gloves",
      "warehouseName": "Melbourne Warehouse",
      "quantity": 100,
      "createdBy": "Warehouse Employee",
      "createdAt": "2026-04-19T10:30:00.000Z"
    }
  ]
}
```

---

## 25.3 Low Stock Report

```http
GET /reports/low-stock
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Successful Response

```json
{
  "success": true,
  "message": "Low-stock report generated successfully",
  "data": [
    {
      "sku": "MASK-001",
      "productName": "Safety Mask",
      "warehouse": "Melbourne Warehouse",
      "quantity": 5,
      "minStockLevel": 20,
      "shortageQuantity": 15
    }
  ]
}
```

---

## 25.4 User Activity Report

```http
GET /reports/user-activity
```

### Required Roles

```text
Admin, Manager
```

### Query Parameters

| Parameter | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| userId    | number | No       | Filter by user |
| roleId    | number | No       | Filter by role |
| fromDate  | string | No       | Start date     |
| toDate    | string | No       | End date       |

### Successful Response

```json
{
  "success": true,
  "message": "User activity report generated successfully",
  "data": [
    {
      "userName": "Warehouse Employee",
      "role": "Employee",
      "action": "Created stock-in record",
      "module": "Stock-In",
      "createdAt": "2026-04-19T10:30:00.000Z"
    }
  ]
}
```

---

## 25.5 Export Report

```http
GET /reports/export
```

### Required Roles

```text
Admin, Manager, Site Manager
```

### Query Parameters

| Parameter   | Type   | Required | Description                                          |
| ----------- | ------ | -------- | ---------------------------------------------------- |
| reportType  | string | Yes      | inventory, stock_movements, low_stock, user_activity |
| format      | string | Yes      | csv, xlsx, pdf                                       |
| fromDate    | string | No       | Start date                                           |
| toDate      | string | No       | End date                                             |
| warehouseId | number | No       | Filter by warehouse                                  |

### Example

```http
GET /reports/export?reportType=inventory&format=csv&warehouseId=1
```

### Successful Response

```json
{
  "success": true,
  "message": "Report export generated successfully",
  "data": {
    "downloadUrl": "/exports/inventory-report-2026-04-19.csv"
  }
}
```

---

# 26. Audit Log APIs

## 26.1 Get Audit Logs

```http
GET /audit-logs
```

### Required Roles

```text
Admin, Manager
```

### Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| userId    | number | No       | Filter by user   |
| module    | string | No       | Filter by module |
| action    | string | No       | Filter by action |
| fromDate  | string | No       | Start date       |
| toDate    | string | No       | End date         |

### Successful Response

```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": [
    {
      "id": 1,
      "userName": "System Admin",
      "action": "Created user",
      "module": "User Management",
      "details": "Created employee@moonlight.com",
      "createdAt": "2026-04-19T10:30:00.000Z"
    }
  ]
}
```

---

# 27. Backup and Export APIs

## 27.1 Create Backup

```http
POST /backup
```

### Required Role

```text
Admin
```

### Successful Response

```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "backupFile": "moonlight-backup-2026-04-19.sql",
    "downloadUrl": "/backups/moonlight-backup-2026-04-19.sql"
  }
}
```

---

## 27.2 Restore Backup

```http
POST /backup/restore
```

### Required Role

```text
Admin
```

### Request Body

```json
{
  "backupFile": "moonlight-backup-2026-04-19.sql"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Backup restored successfully"
}
```

---

## 27.3 Export Master Data

```http
GET /export/master-data
```

### Required Role

```text
Admin
```

### Query Parameters

| Parameter | Type   | Required | Description                            |
| --------- | ------ | -------- | -------------------------------------- |
| type      | string | Yes      | users, products, warehouses, suppliers |
| format    | string | Yes      | csv, xlsx, pdf                         |

### Example

```http
GET /export/master-data?type=products&format=xlsx
```

### Successful Response

```json
{
  "success": true,
  "message": "Master data exported successfully",
  "data": {
    "downloadUrl": "/exports/products.xlsx"
  }
}
```

---

# 28. Health Check API

## 28.1 Check API Status

```http
GET /health
```

### Successful Response

```json
{
  "success": true,
  "message": "Moonlight API is running",
  "timestamp": "2026-04-19T10:30:00.000Z"
}
```

---

# 29. Example Error Scenarios

## 29.1 Missing Token

```json
{
  "success": false,
  "message": "Authentication token is required"
}
```

Status:

```text
401 Unauthorized
```

---

## 29.2 Invalid Token

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

Status:

```text
401 Unauthorized
```

---

## 29.3 Access Denied

```json
{
  "success": false,
  "message": "Access denied. You do not have permission to perform this action."
}
```

Status:

```text
403 Forbidden
```

---

## 29.4 Validation Failed

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "quantity",
      "message": "Quantity must be greater than zero"
    }
  ]
}
```

Status:

```text
422 Unprocessable Entity
```

---

## 29.5 Duplicate SKU

```json
{
  "success": false,
  "message": "SKU already exists"
}
```

Status:

```text
409 Conflict
```

---

## 29.6 Insufficient Stock

```json
{
  "success": false,
  "message": "Insufficient stock available",
  "data": {
    "availableQuantity": 10,
    "requestedQuantity": 20
  }
}
```

Status:

```text
409 Conflict
```

---

# 30. Appendix A: Permission Matrix

| API Module            | Admin | Manager | Site Manager | Employee |
| --------------------- | ----- | ------- | ------------ | -------- |
| Authentication        | Yes   | Yes     | Yes          | Yes      |
| User Management       | Yes   | No      | No           | No       |
| Role Management       | Yes   | No      | No           | No       |
| Permission Management | Yes   | No      | No           | No       |
| Warehouse Management  | Yes   | Limited | Limited      | No       |
| Category Management   | Yes   | Yes     | View         | View     |
| Supplier Management   | Yes   | Yes     | View         | No       |
| Product Management    | Yes   | Yes     | Limited      | View     |
| Inventory View        | Yes   | Yes     | Yes          | Yes      |
| Stock-In              | Yes   | Yes     | Yes          | Yes      |
| Stock-Out             | Yes   | Yes     | Yes          | Yes      |
| Stock Adjustment      | Yes   | Yes     | Yes          | Limited  |
| Stock Transfer        | Yes   | Yes     | Yes          | No       |
| Approvals             | Yes   | Yes     | No           | No       |
| Notifications         | Yes   | Yes     | Yes          | Yes      |
| Reports               | Yes   | Yes     | Limited      | No       |
| Audit Logs            | Yes   | Limited | No           | No       |
| Backup/Restore        | Yes   | No      | No           | No       |

---

# 31. Appendix B: Example Data Models

## 31.1 User Model

```json
{
  "id": 1,
  "fullName": "System Admin",
  "email": "admin@moonlight.com",
  "phone": "0400000000",
  "roleId": 1,
  "warehouseId": null,
  "status": "active",
  "createdAt": "2026-04-19T10:30:00.000Z",
  "updatedAt": "2026-04-19T10:30:00.000Z"
}
```

## 31.2 Product Model

```json
{
  "id": 1,
  "sku": "GLV-001",
  "name": "Safety Gloves",
  "description": "Protective gloves for warehouse staff",
  "categoryId": 1,
  "supplierId": 1,
  "unit": "pair",
  "unitPrice": 12.5,
  "minStockLevel": 20,
  "maxStockLevel": 500,
  "status": "active",
  "createdAt": "2026-04-19T10:30:00.000Z",
  "updatedAt": "2026-04-19T10:30:00.000Z"
}
```

## 31.3 Warehouse Model

```json
{
  "id": 1,
  "name": "Melbourne Warehouse",
  "location": "Melbourne",
  "address": "Melbourne VIC",
  "contactPerson": "Site Manager",
  "phone": "0400000003",
  "capacity": 10000,
  "status": "active",
  "createdAt": "2026-04-19T10:30:00.000Z",
  "updatedAt": "2026-04-19T10:30:00.000Z"
}
```

## 31.4 Inventory Model

```json
{
  "id": 1,
  "productId": 1,
  "warehouseId": 1,
  "quantity": 100,
  "stockStatus": "normal",
  "updatedAt": "2026-04-19T10:30:00.000Z"
}
```

## 31.5 Stock Movement Model

```json
{
  "id": 1,
  "productId": 1,
  "warehouseId": 1,
  "movementType": "stock_in",
  "quantity": 100,
  "referenceNo": "PO-10021",
  "reason": "Initial stock received",
  "createdBy": 4,
  "createdAt": "2026-04-19T10:30:00.000Z"
}
```

## 31.6 Transfer Request Model

```json
{
  "id": 1,
  "productId": 1,
  "sourceWarehouseId": 1,
  "destinationWarehouseId": 2,
  "quantity": 50,
  "status": "pending",
  "requestedBy": 3,
  "approvedBy": null,
  "createdAt": "2026-04-19T10:30:00.000Z",
  "updatedAt": "2026-04-19T10:30:00.000Z"
}
```

```
