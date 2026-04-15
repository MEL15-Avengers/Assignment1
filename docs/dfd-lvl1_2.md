# DFD Level 1 and Level 2 Documentation

## Moonlight Warehouse Inventory Management System

**File:** `dfd-lvl1_2.pdf`  
**Path:** `Assignment1/docs/dfd-lvl1_2.pdf`  
**Total Pages:** 9  

Source: [dfd-lvl1_2.pdf](dfd-lvl1_2.pdf) 

---

## 1. Purpose

This document explains the Data Flow Diagrams for the Moonlight Warehouse Inventory Management System.

The DFDs show how data moves between external users, system processes, databases, and supporting services.

---

## 2. DFD Page Summary

| Page | Diagram Area | Description |
|---:|---|---|
| 1 | Level 1 Overall DFD | Full system data flow overview |
| 2 | User and Access Management | Login, registration, profile, password, roles |
| 3 | Product and Inventory Management | Products, SKU, stock, availability, alerts |
| 4 | Warehouse Operations | Receiving, inspection, storage, transfer, picking |
| 5 | Supplier and Procurement Management | Suppliers, requisitions, purchase orders, invoices |
| 6 | Order and Dispatch Management | Orders, returns, shipping, fulfilment |
| 7 | Reporting and Analytics | Inventory, procurement, dispatch, financial reports |
| 8 | Notification and Alert Management | Alerts, notifications, escalation |
| 9 | System Administration Management | Configuration, monitoring, audit, backup |

---

# Page 1: Level 1 Overall DFD

## Purpose

The Level 1 DFD gives a full overview of the system and shows the major processes, external entities, and data stores.

## External Entities

| Entity | Description |
|---|---|
| System Administrator | Manages system configuration and administration |
| Admin | Manages users, roles, products, and access |
| Product and Inventory Management | Handles product and stock-related operations |
| Reporting and Analytics | Requests reports and receives analytics data |
| Finance Department | Receives invoices and financial reports |
| Supplier | Sends supplier data, purchase orders, and invoices |
| Warehouse Manager | Oversees warehouse operations |
| Warehouse Staff | Handles stock receiving, picking, and scanning |
| Customer and Sales Team | Sends orders and returns |
| Delivery and Logistics Partner | Handles dispatch coordination |
| Notification Service | Sends notifications and alerts |

## Main Processes

| Process | Description |
|---|---|
| User and Access Management | Handles registration, login, roles, and access tokens |
| Product and Inventory Management | Handles product records, inventory data, and stock updates |
| Supplier and Procurement Management | Handles suppliers, purchase orders, and procurement data |
| Warehouse Operations Management | Handles receiving, inspection, storage, picking, and transfers |
| Order and Dispatch Management | Handles orders, dispatch, returns, and shipment coordination |
| System Administration Management | Handles configuration, notification rules, and system settings |

## Main Data Stores

| Data Store | Description |
|---|---|
| User Database | Stores user accounts and roles |
| Product Database | Stores product records |
| Inventory Database | Stores inventory quantities and stock records |
| Supplier Database | Stores supplier details |
| Purchase Order Database | Stores purchase orders |
| Sales Order Database | Stores customer sales orders |
| Dispatch Database | Stores dispatch and shipment data |
| Analytics Data Store | Stores reporting and analytics information |
| Audit Log | Stores audit events |
| Notification Log | Stores notification records |
| System Settings | Stores configuration settings |
| Warehouse Database | Stores warehouse and location data |

---

# Page 2: User and Access Management DFD

## Purpose

This DFD explains how user registration, login, logout, profile management, password reset, and role permissions work.

## External Entities

| Entity | Description |
|---|---|
| User | Logs in, logs out, updates profile, resets password |
| Admin | Registers users and assigns roles |
| System Administrator | Receives system confirmation or errors |

## Processes

| Process | Description |
|---|---|
| Register User | Creates a new user account |
| Authenticate User Login | Verifies login details |
| Logout and Session Management | Ends user session |
| Update User Profile | Updates user profile data |
| Reset or Change Password | Handles password reset or password change |
| Manage Roles and Permissions | Assigns access level and permissions |

## Data Stores

| Data Store | Description |
|---|---|
| User Database | Stores account, profile, role, and credential data |
| Configuration Settings | Stores role and permission rules |
| Audit Log | Stores login, registration, and profile change logs |
| Notification Log | Stores notifications sent to users |

## Key Data Flows

| Data Flow | Description |
|---|---|
| Registration form | User details submitted for account creation |
| Username/password | Login credentials |
| Access token | Granted after successful authentication |
| Profile data | User profile information |
| Reset request / OTP / password | Password reset data |
| Role assignment request | Admin role update request |
| Login success or failure | Authentication result |
| Log update | Login and profile activity saved to audit log |

---

# Page 3: Product and Inventory Management DFD

## Purpose

This DFD explains how product records, barcode/SKU data, stock levels, inventory adjustments, and alerts are handled.

## External Entities

| Entity | Description |
|---|---|
| Admin | Creates or updates product data |
| Warehouse Staff | Scans products and updates stock |
| Warehouse Manager | Receives stock status and low-stock information |
| Customer and Sales Team | Requests product availability |

## Processes

| Process | Description |
|---|---|
| Create or Update Product | Adds or modifies product details |
| Manage Barcode and SKU | Creates and maintains barcode/SKU data |
| Adjust Stock | Updates stock quantity |
| Maintain Inventory Records | Maintains inventory details and locations |
| Track Stock Levels | Monitors current stock quantity |
| Check Product Availability | Checks whether product is available |
| Trigger Reorder Threshold Check | Checks reorder level and creates alerts |

## Data Stores

| Data Store | Description |
|---|---|
| Product Database | Stores product records |
| Inventory Database | Stores stock quantity and location |
| Warehouse Database | Stores warehouse and location information |
| Configuration Settings | Stores threshold settings |
| Audit Log | Stores product and inventory changes |
| Notification Log | Stores stock alert notifications |

## Key Data Flows

| Data Flow | Description |
|---|---|
| Product details, SKU, barcode, pricing | Product creation/update data |
| Barcode data | Barcode scan, creation, or update |
| Stock adjustment | Stock increase/decrease data |
| Location update | Updated warehouse location |
| Stock info / stock levels | Current inventory quantity |
| Threshold settings | Reorder configuration |
| Reorder alert | Alert when stock is below threshold |
| Availability request/result | Product availability response |

---

# Page 4: Warehouse Operations DFD

## Purpose

This DFD explains warehouse operational workflows including receiving, inspection, put-away, location management, stock transfer, picking, packing, and damaged goods.

## External Entities

| Entity | Description |
|---|---|
| Delivery Partner | Sends delivered goods and goods receipt notes |
| Warehouse Staff | Receives, scans, stores, transfers, picks, and packs stock |
| Warehouse Manager | Receives warehouse status, damage reports, and transfer confirmations |

## Processes

| Process | Description |
|---|---|
| Receive Goods | Receives delivered goods |
| Inspect and Verify Goods | Checks received stock against order details |
| Put Away Stock | Moves accepted goods into storage |
| Manage Warehouse Location | Assigns and updates stock locations |
| Transfer Stock Between Warehouses | Handles inter-warehouse stock transfer |
| Pick and Pack Items | Picks and packs customer orders |
| Record Damaged or Returned Goods | Records damage and returned items |

## Data Stores

| Data Store | Description |
|---|---|
| Sales Order Database | Stores customer order data |
| Procurement Database | Stores purchase order and receiving data |
| Warehouse Database | Stores warehouse locations |
| Inventory Database | Stores stock quantities |
| Dispatch Database | Stores dispatch status |
| Audit Log | Stores receiving, transfer, and damage logs |

## Key Data Flows

| Data Flow | Description |
|---|---|
| Delivery note / goods receipt note | Goods received from delivery partner |
| Inspection checklist | Quality and quantity verification |
| Accepted or rejected goods | Inspection outcome |
| Kept goods | Stock accepted into warehouse |
| Assign location | Put-away location assignment |
| Pick instruction | Picking task for warehouse staff |
| Packed order | Order prepared for dispatch |
| Damage report / returned stock | Damaged or returned goods record |
| Transfer request | Request to move stock between warehouses |
| Transfer confirmation | Transfer completion response |
| Updated stock levels | Inventory changes after operations |

---

# Page 5: Supplier and Procurement Management DFD

## Purpose

This DFD explains supplier registration, purchase requisitions, purchase order approval, supplier invoice processing, delivered goods matching, and supplier performance evaluation.

## External Entities

| Entity | Description |
|---|---|
| Admin | Registers supplier details |
| Warehouse Manager | Creates requisitions and approves purchase orders |
| Finance Department | Processes invoices |
| Supplier | Receives purchase orders and provides supplier data |

## Processes

| Process | Description |
|---|---|
| Register Supplier | Creates or updates supplier record |
| Create Purchase Requisition | Creates requisition from low-stock or manual request |
| Approve Purchase Order | Approves or rejects purchase order |
| Generate Purchase Order | Creates purchase order for supplier |
| Process Supplier Invoice | Handles supplier invoice records |
| Match Delivered Goods | Matches received goods against purchase order |
| Evaluate Supplier Performance | Measures supplier performance using historical data |

## Data Stores

| Data Store | Description |
|---|---|
| Supplier Database | Stores supplier records |
| Procurement Database | Stores requisitions and purchase orders |
| Inventory Database | Stores inventory data |
| Report Data | Stores supplier reports |
| Audit Log | Stores procurement and supplier actions |

## Key Data Flows

| Data Flow | Description |
|---|---|
| Supplier details/contact information | Supplier registration data |
| Purchase requisition | Request to buy stock |
| Low-stock alert | Trigger for procurement |
| Approved PO | Purchase order approved for supplier |
| Rejected PO notice | Notification that PO was rejected |
| Purchase order | Sent to supplier |
| Invoice | Supplier invoice |
| Invoice approval / processing data | Finance processing data |
| Delivered items | Goods received from supplier |
| Goods receipt match result | Matched delivery result |
| Supplier performance report | Evaluation result |

---

# Page 6: Order and Dispatch Management DFD

## Purpose

This DFD explains customer order capture, stock validation, inventory allocation, fulfilment, shipment, delivery updates, and returns.

## External Entities

| Entity | Description |
|---|---|
| Customer | Places orders and return requests |
| Warehouse Manager | Reviews orders and approves or rejects returns |
| Warehouse Staff | Picks and packs stock |
| Delivery Partner | Handles dispatch and delivery |
| Customer and Sales Team | Provides order-related data |

## Processes

| Process | Description |
|---|---|
| Capture Customer Order | Records customer order |
| Validate Order and Stock | Checks order details and stock availability |
| Allocate Inventory | Reserves inventory for order |
| Generate Pick and Pack Dispatch Tasks | Creates warehouse fulfilment tasks |
| Manage Shipment | Coordinates dispatch with delivery partner |
| Update Order Status | Updates fulfilment and delivery status |
| Process Returns | Handles return requests and return outcomes |

## Data Stores

| Data Store | Description |
|---|---|
| Inventory Database | Stores stock data |
| Sales Order Database | Stores customer orders |
| Dispatch Database | Stores shipment and delivery data |
| Audit Log | Stores order and dispatch activity |

## Key Data Flows

| Data Flow | Description |
|---|---|
| Order information | Customer order details |
| Stock check | Inventory availability check |
| Validated order | Approved order for fulfilment |
| Allocation record | Reserved stock data |
| Pick and packing slip | Warehouse task instruction |
| Dispatch request | Delivery partner handover request |
| Tracking details | Delivery status information |
| Delivery confirmation | Confirmation from delivery partner |
| Return request | Customer return request |
| Return approval or rejection | Manager return decision |
| Updated stock status | Inventory changes after allocation, dispatch, or return |

---

# Page 7: Reporting and Analytics DFD

## Purpose

This DFD explains how reports, dashboard KPIs, analytics, procurement reports, dispatch reports, financial reports, and audit reports are generated.

## External Entities

| Entity | Description |
|---|---|
| Warehouse Manager | Requests operational and inventory reports |
| Finance Department | Requests cost, expense, and financial reports |
| Admin | Requests reports and login history |
| System Administrator | Receives compliance reports |

## Processes

| Process | Description |
|---|---|
| Generate Inventory Reports | Produces stock and inventory reports |
| Generate Warehouse Performance Reports | Produces warehouse performance reports |
| Generate Order and Dispatch Reports | Produces customer order and dispatch reports |
| Generate Procurement Reports | Produces purchase order and supplier reports |
| Generate Financial Summary Reports | Produces financial reports |
| Generate Audit and User Activity Reports | Produces audit and activity reports |
| Display Dashboard KPI | Shows KPI values on dashboard |

## Data Stores

| Data Store | Description |
|---|---|
| Report Analytics Store | Stores analytics and report data |
| Warehouse Database | Supplies warehouse data |
| Inventory Database | Supplies stock data |
| Product Database | Supplies product data |
| Dispatch Database | Supplies dispatch data |
| Supplier Database | Supplies supplier data |
| Sales Order Database | Supplies sales data |
| Procurement Database | Supplies procurement data |
| User Database | Supplies user data |
| Audit Log | Supplies audit data |

## Key Data Flows

| Data Flow | Description |
|---|---|
| Request report | User report request |
| Inventory overstock report | Stock condition report |
| Dashboard KPIs | KPI data for dashboard |
| Fulfilment delay report | Warehouse delay information |
| Cost, expense, warehouse cost reports | Financial data |
| Supplier performance | Supplier performance analytics |
| Compliance report | Audit and compliance report |
| Login history and user actions | User activity report |

---

# Page 8: Notification and Alert Management DFD

## Purpose

This DFD explains how alerts are detected, generated, sent, logged, and escalated.

## External Entities

| Entity | Description |
|---|---|
| Warehouse Staff | Receives receipt-related notifications |
| Supplier | Receives receipt or procurement notifications |
| Customer and Sales Team | Receives customer/order-related notifications |
| Admin | Receives escalation notifications |
| Warehouse Manager | Receives escalation notifications |
| Notification Service | Sends email, SMS, and in-app alerts |

## System Events

| Event | Description |
|---|---|
| Low Stock Trigger | Triggered when stock is below threshold |
| Failed Login | Triggered by failed authentication |
| Shipment Status | Triggered by shipping updates |
| PO Approval Required | Triggered when purchase order approval is needed |
| System Fault | Triggered by technical issue |

## Processes

| Process | Description |
|---|---|
| Detect Alert Event | Identifies alert trigger |
| Generate Notification Content | Creates alert message |
| Send Notification | Sends notification to users |
| Record Notification Log | Saves notification delivery record |
| Escalate Critical Alert | Escalates urgent alerts to admin or warehouse manager |

## Data Stores

| Data Store | Description |
|---|---|
| Configuration and System Settings | Stores alert rules and notification templates |
| Sales Order Database | Supplies order data |
| Inventory Database | Supplies inventory data |
| Notification Log | Stores sent notification records |

## Key Data Flows

| Data Flow | Description |
|---|---|
| Alert rules | Rules used to detect alerts |
| Notification template | Message format |
| Inventory data | Used for stock alerts |
| Order data | Used for order notifications |
| Message content | Notification content |
| Email, SMS, app alert | Notification sent to user |
| Delivery record | Notification delivery result |
| Escalation message | Critical alert escalation |
| Unresolved critical issue | Issue requiring escalation |

---

# Page 9: System Administration Management DFD

## Purpose

This DFD explains system configuration, monitoring, audit, security, backup, and recovery workflows.

## External Entities

| Entity | Description |
|---|---|
| Admin | Updates configuration and views reports |
| System Administrator | Runs backup/restore and receives status |
| System Events | Sends service status and security incident reports |
| System Actions | Sends critical action data |

## Processes

| Process | Description |
|---|---|
| Manage System Configuration | Updates system settings, thresholds, and rules |
| Monitor System Health | Tracks service status and system health |
| Review Security Events | Reviews failed access and suspicious activity |
| Maintain Audit Trail | Records critical actions |
| Backup Data | Creates system backup |
| Restore Data | Restores system data from backup |

## Data Stores

| Data Store | Description |
|---|---|
| User Database | Stores user data |
| All Databases | Source for backup and recovery |
| Configuration Settings | Stores system configuration |
| Audit Log | Stores security and activity records |

## Key Data Flows

| Data Flow | Description |
|---|---|
| Configuration changes / threshold updates | Admin system setting changes |
| Save settings | Stored configuration updates |
| Log changes | Configuration change audit |
| Service status | Health monitoring data |
| Security incident report | Security issue data |
| Failed access / suspicious activity | Security event data |
| Read security logs | Audit/security review |
| Critical actions | Audit trail input |
| Backup request | Request to back up data |
| Backup confirmation | Backup result |
| Restore request | Request to restore data |
| Restore confirmation | Restore result |
| Status report / alert | Admin/system administrator notification |

---

# 3. Overall Data Store Summary

| Data Store | Used By |
|---|---|
| User Database | User access, roles, reporting, administration |
| Product Database | Product management, reporting |
| Inventory Database | Inventory, warehouse, orders, alerts, reports |
| Supplier Database | Supplier management, procurement, reporting |
| Purchase Order / Procurement Database | Procurement, receiving, reports |
| Sales Order Database | Orders, returns, reporting |
| Dispatch Database | Dispatch, delivery, reporting |
| Warehouse Database | Warehouse operations, locations, reports |
| Analytics Data Store | Reports and dashboard KPIs |
| Audit Log | Security, reports, administration |
| Notification Log | Alerts and notification history |
| System Settings | Configuration, roles, thresholds, alert rules |

---

# 4. DFD Design Summary

The DFDs show that Moonlight Warehouse Inventory Management System is structured around these main process groups:

1. User and access management
2. Product and inventory management
3. Warehouse operations
4. Supplier and procurement management
5. Order and dispatch management
6. Reporting and analytics
7. Notification and alert management
8. System administration management

---

# 5. Conclusion

The DFD Level 1 and Level 2 diagrams provide a complete view of data movement across the Moonlight Warehouse Inventory Management System.

They show how users, managers, warehouse staff, suppliers, customers, delivery partners, databases, notifications, reports, and system administration processes interact.

These diagrams support the final SRS by clearly defining process boundaries, external entities, data stores, and data flows.
