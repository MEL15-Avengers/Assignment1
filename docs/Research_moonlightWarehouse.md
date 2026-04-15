# Market Research

## Moonlight Warehouse Inventory Management System

See full research source: [Research_moonlightWarehouse.docx](sandbox:/mnt/data/Research_moonlightWarehouse.docx) :contentReference[oaicite:0]{index=0}

---

## Executive Summary

This market research reviews current warehouse and inventory management platforms to identify the features, workflows, and business expectations most relevant to the **Moonlight Warehouse Inventory Management System**.

The analysis focuses on four reference products:

- Zoho Inventory
- Odoo Inventory
- Cin7
- NetSuite Inventory/WMS

Across these systems, several common features appear:

- Real-time stock visibility
- Batch or lot traceability
- Low-stock and reorder support
- Supplier awareness
- Role-based access control
- Operational reporting

The main insight is that Moonlight does not need to reproduce a full enterprise ERP. Instead, it should deliver a focused warehouse inventory system with secure user access, product and supplier management, stock movement history, batch and expiry visibility, and alert-driven decision support.

---

## 1. Research Objective

The objective of this document is to evaluate current warehouse and inventory management platforms, identify repeated market features, and determine which capabilities are most suitable for the Moonlight Warehouse Inventory Management System.

This research supports:

- Business problem specification
- System requirements
- Feature justification
- SRS development
- Future implementation planning

---

## 2. Market Context

Inventory management software has evolved from simple stock lists into platforms that support:

- Real-time visibility
- Traceability
- Replenishment control
- Role-based operations
- Warehouse transfers
- Location control
- Batch handling
- Stock movement tracking
- Operational dashboards

Moonlight is not just a product list or database project. It sits between classic inventory management and warehouse execution.

Therefore, the system should support:

- Stock visibility
- Stock-in workflows
- Stock-out workflows
- Damage tracking
- Batch-based item monitoring
- Perishable product monitoring

---

## 3. Competitor Review

### 3.1 Zoho Inventory

Zoho Inventory is a cloud-based inventory platform focused on operational visibility.

Key features include:

- Barcode/RFID tracking
- Batch tracking
- Serial number tracking
- Reorder points
- Low-stock alerts
- Stock adjustments
- Reports
- User roles and permissions
- Warehouse stock transfers

#### Relevance to Moonlight

Zoho is highly relevant because it includes the core features expected in a practical warehouse inventory system:

- Products
- Warehouses
- Traceability
- Alerts
- Reports
- Role-based access

Moonlight should adopt the core operational ideas without copying the full commercial SaaS ecosystem.

Reference: <https://www.zoho.com/inventory>

---

### 3.2 Odoo Inventory

Odoo Inventory is part of a broader ERP system.

Key features include:

- Lot numbers
- Serial numbers
- Expiration-date monitoring
- Perishable product tracking
- Inventory visibility
- ERP-style integration

#### Relevance to Moonlight

Odoo shows that traceability and expiry monitoring are standard features in modern warehouse systems.

Moonlight should use Odoo as evidence for including:

- Batch tracking
- Expiry visibility
- Process-backed inventory control

However, Moonlight should not expand into full ERP modules such as manufacturing, procurement, or accounting.

Reference: <https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory>

---

### 3.3 Cin7

Cin7 focuses on real-time visibility and multi-location inventory control.

Key features include:

- Real-time inventory visibility
- Multi-location tracking
- Centralized stock data
- Product and component tracking
- Data-driven decision support
- Spreadsheet replacement

#### Relevance to Moonlight

Cin7 is relevant because poor visibility is a common warehouse problem.

Moonlight should include:

- Inventory dashboards
- Live product quantities
- Low-stock awareness
- Centralized stock information

Reference: <https://www.cin7.com>

---

### 3.4 NetSuite Inventory / WMS

NetSuite is an enterprise-level inventory and warehouse management benchmark.

Key features include:

- Multi-location inventory tracking
- Receiving
- Putaway
- Inventory tracking
- Barcode-supported workflows
- Pick and pack workflows
- Reorder points
- Safety stock
- Cycle counts
- Inventory optimization

#### Relevance to Moonlight

NetSuite shows that mature warehouse systems connect inventory visibility with operational control.

Moonlight should borrow concepts such as:

- Centralized inventory data
- Replenishment awareness
- Movement traceability
- Warehouse process control

Moonlight should not attempt to fully replicate advanced enterprise WMS functionality.

Reference: <https://www.netsuite.com/portal/products/erp/warehouse-fulfillment/inventory-management.shtml>

---

## 4. Comparative Feature Matrix

| Feature | Zoho | Odoo | Cin7 | NetSuite | Relevance to Moonlight |
|---|---|---|---|---|---|
| Real-time inventory visibility | Yes | Yes | Yes | Yes | Essential for dashboard and product list |
| Batch / lot tracking | Yes | Yes | Indirect/publicly implied | Yes | Important for perishable and traceable goods |
| Expiry monitoring | Yes | Yes | Not strongly public-facing | Supported through advanced inventory practices | Important for warehouse alerts |
| Low-stock / reorder support | Yes | Supported through inventory controls | Yes | Yes | Important for replenishment awareness |
| Role-based access | Yes | Yes | Yes | Yes | Required for admin, manager, and staff roles |
| Multi-location / warehouse support | Yes | Yes | Yes | Yes | Useful for future scalability |
| Operational reporting | Yes | Yes | Yes | Yes | Required for decision support and management visibility |

**Table 1: Comparative Feature Matrix**

---

## 5. Market Insights Relevant to Moonlight

### 5.1 Real-Time Stock Visibility

Real-time stock visibility is a baseline expectation in modern inventory systems.

Moonlight should provide clear visibility of:

- Available stock
- Reserved stock
- Damaged stock
- Low-stock products
- Warehouse-specific stock

---

### 5.2 Batch, Lot, and Expiry Control

Batch, lot, and expiry tracking are important where perishable or traceable products are involved.

Moonlight should support:

- Batch numbers
- Expiry dates
- Expiry alerts
- Batch movement history

---

### 5.3 Role-Based Access

Different users require different permissions.

Moonlight should include roles such as:

- Administrator
- Warehouse Manager
- Site Manager
- Warehouse Staff / Employee

---

### 5.4 Reporting and Alerting

Dashboards, reports, and stock warnings are core business functions.

Moonlight should include:

- Inventory reports
- Low-stock reports
- Stock movement reports
- Supplier reports
- Warehouse reports
- Dashboard summaries

---

### 5.5 Warehouse Execution Support

Enterprise systems combine inventory control with warehouse execution.

Moonlight should support practical warehouse workflows such as:

- Receiving stock
- Stock-out records
- Warehouse transfers
- Damage tracking
- Movement history
- Location-based inventory control

---

## 6. Identified Market Gap and Opportunity

The reviewed products are powerful but often broad commercial suites.

This creates an opportunity for Moonlight to provide a simpler, warehouse-focused system that sits between manual tracking and enterprise ERP.

Moonlight can target the following gap:

- More structured than spreadsheets
- Simpler than enterprise ERP
- Focused on warehouse inventory operations
- Suitable for small to medium warehouse environments
- Practical for an academic capstone project

Recommended Moonlight positioning:

> Moonlight Warehouse Inventory Management System is a focused warehouse platform that provides secure user roles, product and supplier records, inventory quantities, stock movement history, batch visibility, expiry monitoring, and operational alerts.

---

## 7. Recommended Scope Implications for Moonlight

Moonlight should include the following features:

1. Secure login and role-based access
2. Product management
3. Category management
4. Supplier management
5. Inventory quantity tracking
6. Stock-in management
7. Stock-out management
8. Damaged stock tracking
9. Reserved stock tracking
10. Batch tracking
11. Expiry date visibility
12. Low-stock alerts
13. Dashboard reporting
14. Warehouse/location management
15. Stock movement audit history

---

## 8. Recommended System Modules

Based on the market research, Moonlight should include these modules:

| Module | Purpose |
|---|---|
| Authentication Module | Secure login and logout |
| User Management Module | Manage users, roles, and permissions |
| Product Management Module | Manage product details |
| Supplier Management Module | Store supplier information |
| Inventory Management Module | Track stock quantities |
| Stock Movement Module | Record stock-in, stock-out, transfer, and damage |
| Warehouse Module | Manage warehouse locations |
| Batch and Expiry Module | Track batch numbers and expiry dates |
| Reporting Module | Generate business and inventory reports |
| Dashboard Module | Show real-time operational overview |

---

## 9. Conclusion

The market research confirms that Moonlight Warehouse should be designed as a practical warehouse inventory system rather than a generic database or simplified retail app.

Public information from Zoho Inventory, Odoo, Cin7, and NetSuite shows that the most relevant market features are:

- Stock visibility
- Traceability
- Low-stock awareness
- Movement control
- Role-based access
- Reporting

The best strategic decision is to build a focused warehouse solution that solves a real operational problem: poor inventory visibility and weak warehouse control.

By keeping the scope clear and aligned with market expectations, Moonlight can present strong business relevance and a realistic technical design for the final SRS and development stages.

---

## 10. References

Zoho Inventory. Online inventory management software. Available at: <https://www.zoho.com/inventory>  
Accessed: 29 March 2026.

Zoho Inventory. Online warehouse management system. Available at: <https://www.zoho.com/inventory/warehouse-inventory-management>  
Accessed: 29 March 2026.

Odoo Documentation 19.0. Expiration dates. Available at: <https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/product_management/product_tracking/expiration_dates.html>  
Accessed: 29 March 2026.

Odoo Documentation 19.0. Lot numbers. Available at: <https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/product_management/product_tracking/lots.html>  
Accessed: 29 March 2026.

Cin7. Inventory management software and small business ERP. Available at: <https://www.cin7.com>  
Accessed: 29 March 2026.

Cin7. Best cloud inventory management software features. Available at: <https://www.cin7.com/features>  
Accessed: 29 March 2026.

NetSuite. Inventory management systems software. Available at: <https://www.netsuite.com/portal/products/erp/warehouse-fulfillment/inventory-management.shtml>  
Accessed: 29 March 2026.

NetSuite. Warehouse management system. Available at: <https://www.netsuite.com/portal/products/erp/warehouse-fulfillment/wms.shtml>  
Accessed: 29 March 2026.

NetSuite. Advanced inventory. Available at: <https://www.netsuite.com/portal/products/erp/warehouse-fulfillment/inventory-management.shtml>  
Accessed: 29 March 2026.
