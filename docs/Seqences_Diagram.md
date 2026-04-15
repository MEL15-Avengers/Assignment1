# Sequence Diagrams Documentation

## Moonlight Warehouse Inventory Management System

**File:** `Seqences_Diagram.pdf`  
**Path:** `Assignment1/docs/Seqences_Diagram.pdf`  
**Total Pages:** 12  

Source: [Seqences_Diagram.pdf](Seqences_Diagram.pdf) :contentReference[oaicite:0]{index=0}

---

## 1. Purpose

This document explains the sequence diagrams for the Moonlight Warehouse Inventory Management System.

The sequence diagrams show how users, interfaces, controllers, services, databases, and notification components interact during important system workflows.

---

## 2. Sequence Diagram List

| Diagram | Name |
|---:|---|
| 1 | User Registration and Account Setup |
| 2 | User Login and Access Control |
| 3 | Product Creation and Inventory Initialization |
| 4 | Stock Receiving from Supplier |
| 5 | Stock Transfer Between Warehouses |
| 6 | Purchase Requisition to Purchase Order |
| 7 | Customer Order Placement and Stock Allocation |
| 8 | Pick, Pack, Dispatch, and Delivery Update |
| 9 | Return and Damaged Goods Processing |
| 10 | Report Generation and Alert Trigger |
| 11 | Password Reset and Verification |
| 12 | Role and Permission Management |

---

# Diagram 1: User Registration and Account Setup

## Actor

User

## Main Components

- Registration UI
- Registration Controller
- Validation Service
- User Service
- User Database
- Notification Service

## Main Flow

1. User enters registration details.
2. Registration UI sends `POST /api/register`.
3. Validation Service checks required fields, email format, phone format, password policy, and password match.
4. System checks whether the email already exists.
5. User Service hashes the password.
6. User record is inserted into the database.
7. Optional audit log is created.
8. Verification email is sent.
9. System returns registration success.
10. User sees account created confirmation.

## API Endpoint

```http
POST /api/register
```

## Validation Rules

- Full name is required.
- Email must be valid.
- Phone number must be valid.
- Password must be at least 8 characters.
- Password must include uppercase and special character.
- Confirm password must match password.

## Alternate Flows

| Condition | System Response |
|---|---|
| Invalid input | `400 Bad Request` |
| Email already registered | `409 Conflict` |
| Valid input | `201 Created` |

---

# Diagram 2: User Login and Access Control

## Actor

User

## Main Components

- Login UI
- Authentication Controller
- Credential Validation Service
- User Database
- Session / Token Service
- Audit Log Service

## Main Flow

1. User submits login form.
2. Login UI sends credentials to backend.
3. System validates email and password format.
4. User Database checks if the user exists.
5. System checks account status.
6. Password is compared using bcrypt.
7. Failed attempts are reset after successful login.
8. JWT and refresh token are generated.
9. Audit log records successful login.
10. System resolves role-based dashboard route.
11. User is redirected to correct dashboard.

## API Endpoint

```http
POST /api/auth/login
```

## Role-Based Routes

| Role | Route |
|---|---|
| Admin | `/admin/dashboard` |
| Manager | `/manager/dashboard` |
| Staff | `/staff/dashboard` |
| Supplier | `/supplier/dashboard` |

## Alternate Flows

| Condition | System Response |
|---|---|
| Empty or malformed input | `400 Bad Request` |
| User not found | `401 Unauthorized` |
| Account locked or inactive | `403 Forbidden` |
| Wrong password | `401 Unauthorized` |
| Successful login | `200 OK` |

---

# Diagram 3: Product Creation and Inventory Initialization

## Actor

Admin / Warehouse Manager

## Main Components

- Product Management UI
- Product Controller
- Validation Service
- Product Service
- Inventory Service
- Product Database
- Inventory Database

## Main Flow

1. Admin or warehouse manager enters product details.
2. UI sends product payload to backend.
3. Validation Service checks product details.
4. System checks SKU and barcode uniqueness.
5. Product Service creates product record.
6. Product Database stores product.
7. Audit log records product creation.
8. Inventory Service initializes inventory quantity as zero.
9. Inventory Database stores initial inventory record.
10. System returns product summary.
11. UI displays product creation confirmation.

## API Endpoint

```http
POST /api/products
```

## Product Fields

- Product name
- SKU
- Barcode
- Category
- Supplier reference
- Unit
- Price
- Reorder level

## Alternate Flows

| Condition | System Response |
|---|---|
| Invalid product data | `422 Unprocessable Entity` |
| SKU or barcode already exists | `409 Conflict` |
| Product created | `201 Created` |

---

# Diagram 4: Stock Receiving from Supplier

## Actor

Warehouse Staff

## Main Components

- Receiving UI
- Receiving Controller
- Procurement Service
- Purchase Order Database
- Inventory Service
- Warehouse Service
- Inventory Database
- Notification Service

## Main Flow

1. Warehouse staff enters purchase order number.
2. Staff scans received item barcodes.
3. System retrieves purchase order details.
4. System checks whether the PO is open.
5. Received items are matched against PO items.
6. Accepted items update inventory stock.
7. Warehouse Service assigns rack, bin, or zone.
8. Purchase order status is updated.
9. Manager is notified if discrepancy exists.
10. System displays receiving summary.

## API Endpoint

```http
POST /api/receiving/start
```

## Alternate Flows

| Condition | System Response |
|---|---|
| PO not found | `404 Not Found` |
| PO already closed | `404 Not Found` |
| Partial delivery | Mark as `PARTIAL_RECEIVED` |
| Damaged goods | Mark as `DAMAGED` |
| Rejected goods | No stock update |
| Successful receiving | `200 OK` |

---

# Diagram 5: Stock Transfer Between Warehouses

## Actor

Warehouse Manager

## Main Components

- Transfer UI
- Transfer Controller
- Inventory Service
- Warehouse Service
- Inventory Database
- Warehouse Database
- Notification Service

## Main Flow

1. Warehouse manager enters transfer request.
2. System validates source warehouse.
3. System validates destination warehouse.
4. System checks stock availability.
5. Inventory is deducted from source warehouse.
6. Transfer record is created with `IN_TRANSIT` status.
7. Audit log records stock transfer.
8. Destination warehouse is notified.
9. System displays transfer confirmation.

## API Endpoint

```http
POST /api/transfers
```

## Transfer Fields

- Source warehouse ID
- Destination warehouse ID
- Product ID
- Quantity
- Reason

## Alternate Flows

| Condition | System Response |
|---|---|
| Source warehouse not found | `404 Not Found` |
| Destination invalid | `400 Bad Request` |
| Insufficient stock | `422 Unprocessable Entity` |
| Transfer created | `201 Created` |

---

# Diagram 6: Purchase Requisition to Purchase Order

## Actor

Warehouse Manager

## Main Components

- Procurement UI
- Requisition Controller
- Inventory Service
- Procurement Service
- Approval Service
- Supplier Service
- Procurement Database
- Supplier Database
- Notification Service

## Main Flow

1. Low stock alert triggers requisition or manager opens requisition manually.
2. Manager submits requisition.
3. System checks current stock level.
4. Requisition is created with `PENDING` status.
5. Requisition is submitted for approval.
6. Approval Service approves or rejects requisition.
7. Supplier Service selects preferred supplier.
8. Purchase order is generated.
9. Purchase order is sent to supplier.
10. Manager receives PO confirmation.
11. System displays PO number and expected delivery.

## API Endpoint

```http
POST /api/requisitions
```

## Alternate Flows

| Condition | System Response |
|---|---|
| Stock already sufficient | `200 OK` |
| Requisition rejected | `200 OK`, no PO created |
| No active supplier | `422 Unprocessable Entity` |
| PO created | `201 Created` |

---

# Diagram 7: Customer Order Placement and Stock Allocation

## Actor

Customer / Sales Team

## Main Components

- Order UI
- Order Controller
- Order Service
- Inventory Service
- Sales Order Database
- Inventory Database
- Notification Service

## Main Flow

1. Customer or sales team enters order details.
2. System validates order data.
3. Inventory Service checks stock availability.
4. System selects warehouse for order.
5. Stock is reserved for the order.
6. Sales order is created.
7. Audit log records order placement.
8. Customer receives order confirmation.
9. System displays order summary.

## API Endpoint

```http
POST /api/orders
```

## Alternate Flows

| Condition | System Response |
|---|---|
| Invalid order data | `400 Bad Request` |
| Product out of stock | `422 Unprocessable Entity` |
| Order created | `201 Created` |

---

# Diagram 8: Pick, Pack, Dispatch, and Delivery Update

## Actor

Warehouse Staff

## Main Components

- Fulfillment UI
- Fulfillment Controller
- Order Service
- Inventory Service
- Dispatch Service
- Sales Order Database
- Dispatch Database
- Delivery Partner
- Notification Service

## Main Flow

1. Warehouse staff opens fulfillment screen.
2. System retrieves pick list.
3. Staff scans items at rack/bin location.
4. System confirms picked items.
5. Inventory quantity and reserved quantity are deducted.
6. Sales order status changes to `PACKING`.
7. Staff confirms package details.
8. Dispatch record is created.
9. Shipment is sent to delivery partner API.
10. Tracking number is returned.
11. Sales order status changes to `DISPATCHED`.
12. Customer receives dispatch notification.
13. System displays dispatch confirmation.

## API Endpoints

```http
GET /api/fulfillment/picklist/:orderId
POST /api/fulfillment/pick-confirm
POST /api/fulfillment/pack-confirm
```

## Alternate Flows

| Condition | System Response |
|---|---|
| Pick shortage | `409 Conflict` |
| Wrong barcode scanned | `409 Conflict` |
| Courier API unavailable | Mark as `HANDOVER_FAILED` |
| Dispatch successful | `200 OK` |

---

# Diagram 9: Return and Damaged Goods Processing

## Actor

Customer / Warehouse Staff

## Main Components

- Return UI
- Return Controller
- Return Service
- Sales Order Database
- Inventory Service
- Inventory Database
- Audit Log Service
- Notification Service

## Main Flow

1. Customer submits return request.
2. System checks original order.
3. System validates return eligibility.
4. Return record is created with `PENDING_INSPECTION`.
5. Staff physically inspects returned items.
6. Staff records item condition.
7. Inventory is updated based on condition.
8. Return status is updated to `COMPLETED`.
9. Refund or replacement may be triggered.
10. Audit log records return event.
11. Customer receives return outcome notification.
12. System displays return outcome.

## API Endpoints

```http
POST /api/returns
POST /api/returns/:returnId/inspect
```

## Inspection Outcomes

| Outcome | System Action |
|---|---|
| Resellable | Add item back to stock |
| Damaged | Add item to damaged stock |
| Reject | Reject return and do not update sellable stock |

## Alternate Flows

| Condition | System Response |
|---|---|
| Order not found | `404 Not Found` |
| Item mismatch | `404 Not Found` |
| Return window expired | `403 Forbidden` |
| Return completed | `200 OK` |

---

# Diagram 10: Report Generation and Alert Trigger

## Actor

Admin / Manager / Finance User

## Main Components

- Reporting UI
- Reporting Controller
- Report Service
- Inventory Database
- Procurement Database
- Sales Order Database
- Audit Log Database
- Notification Service

## Main Flow

1. User selects report type and filters.
2. System validates report filters.
3. Report Service collects data from required sources.
4. System aggregates data and calculates KPIs.
5. Report is displayed with charts and summary.
6. User may export report as PDF or Excel.
7. System evaluates alert conditions.
8. Alerts are dispatched to relevant managers.
9. Report displays alert banner if critical conditions exist.

## API Endpoints

```http
POST /api/reports/generate
POST /api/reports/:reportId/export
```

## Report Filters

- Report type
- Date from
- Date to
- Warehouse ID
- Category
- Supplier ID

## Alert Types

| Alert Type | Recipient |
|---|---|
| Low Stock | Warehouse Manager |
| Delayed Order | Operations Manager |
| Supplier Issue | Procurement Manager |
| Compliance Alert | Finance / Admin |

## Alternate Flows

| Condition | System Response |
|---|---|
| Invalid filters | `400 Bad Request` |
| No data found | `200 OK` with empty report |
| Notification failure | Log failure and queue retry |
| Report generated | `200 OK` |

---

# Diagram 11: Password Reset and Verification

## Actor

User

## Main Components

- Login UI
- Auth Controller
- Token Service
- User Database
- Notification Service

## Phase 1: Forgot Password Request

1. User clicks forgot password.
2. User enters registered email.
3. System checks whether email exists.
4. System generates secure password reset token.
5. Token is hashed before storage.
6. Token is saved with expiry time.
7. Password reset email is sent.
8. Generic response is shown.

## Phase 2: Token Verification and Password Update

1. User opens reset link.
2. User enters new password and confirm password.
3. System validates new password.
4. System verifies reset token.
5. Password is hashed using bcrypt.
6. User password is updated.
7. Reset token is marked as used.
8. Security email is sent.
9. User is redirected to login page.

## API Endpoints

```http
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Security Rules

- Token is random and secure.
- Token is hashed using SHA-256 before storage.
- Token expires after 15 minutes.
- Token can be used once only.
- System does not reveal whether email exists.

## Alternate Flows

| Condition | System Response |
|---|---|
| Email not registered | Generic `200 OK` |
| Invalid password | `400 Bad Request` |
| Expired token | `400 Bad Request` |
| Password reset successful | `200 OK` |

---

# Diagram 12: Role and Permission Management

## Actor

Admin

## Main Components

- Admin UI
- Access Controller
- Role Service
- User Database
- Configuration Store
- Audit Log

## Phase 1: Load User Profile and Current Role

1. Admin opens User Management.
2. Admin selects target user.
3. System verifies admin authorization.
4. User Database loads target user profile.
5. Role Service loads permission matrix.
6. System displays current role and permission toggles.

## Phase 2: Apply Role Update and Permission Assignment

1. Admin selects new role or custom permissions.
2. Admin saves changes.
3. System validates role change rules.
4. User role is updated.
5. Permission matrix is updated.
6. Audit log records role change.
7. Target user may receive email notification.
8. System displays success message.

## API Endpoints

```http
GET /api/admin/users/:userId/role-permissions
PUT /api/admin/users/:userId/role
```

## Roles

- SUPER_ADMIN
- ADMIN
- WAREHOUSE_MANAGER
- STAFF
- SUPPLIER

## Example Permissions

- VIEW_INVENTORY
- EDIT_STOCK
- APPROVE_PO
- MANAGE_USERS
- VIEW_REPORTS
- PROCESS_RETURNS

## Business Rules

- Admin cannot assign a role higher than their own.
- SUPER_ADMIN role can only be assigned by another SUPER_ADMIN.
- A user cannot demote themselves.
- Role changes must be recorded in audit log.

## Alternate Flows

| Condition | System Response |
|---|---|
| Requesting user not admin | `403 Forbidden` |
| Target user not found | `404 Not Found` |
| Rule violation | `403 Forbidden` |
| Role updated | `200 OK` |

---

# Overall System Interaction Summary

The sequence diagrams show that Moonlight Warehouse Inventory Management System follows a layered architecture:

```text
User / Staff / Admin
   ↓
User Interface
   ↓
Controller
   ↓
Validation / Business Service
   ↓
Database / External Service
   ↓
Notification / Audit Log
```

---

# Common Design Patterns Used

## 1. Validation Before Processing

Every major workflow validates user input before database changes.

Examples:

- Registration validation
- Login validation
- Product validation
- Order validation
- Report filter validation

---

## 2. Role-Based Access Control

Sensitive operations require role checking.

Examples:

- Product creation
- Stock transfer
- Role management
- Report generation
- User permission management

---

## 3. Audit Logging

Important actions are recorded for accountability.

Examples:

- User registration
- Login event
- Product creation
- Stock transfer
- Order placement
- Return processing
- Role change

---

## 4. Notification Support

The system sends notifications for important events.

Examples:

- Verification email
- Login/security event
- Purchase order notification
- Stock discrepancy alert
- Dispatch notification
- Return outcome
- Role change notification

---

## 5. Inventory Control

Inventory workflows protect stock accuracy by checking availability, reserving stock, deducting stock, and recording movement history.

Examples:

- Receiving stock
- Transferring stock
- Reserving stock for orders
- Deducting picked stock
- Returning resellable items
- Recording damaged goods

---

# Conclusion

The sequence diagrams define the detailed workflows for the Moonlight Warehouse Inventory Management System.

They cover authentication, product management, inventory control, warehouse operations, procurement, order fulfilment, returns, reports, alerts, password reset, and role management.

These diagrams provide a strong foundation for backend API development, database design, frontend screen behaviour, testing, and final SRS documentation.
