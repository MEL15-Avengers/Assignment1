# ERD Documentation

## Moonlight Warehouse Inventory Management System

**File:** `ERD_moonlight.pdf`  
**Path:** `Assignment1/docs/ERD_moonlight.pdf`  

Source: [ERD_moonlight.pdf](ERD_moonlight.pdf)

---

## 1. Purpose

This document explains the Entity Relationship Diagram for the Moonlight Warehouse Inventory Management System.

The ERD defines the main database entities, primary keys, foreign keys, and relationships required to support product management, inventory tracking, procurement, dispatch, returns, reporting, and system administration.

---

## 2. Main Database Domains

The ERD is divided into the following domains:

| Domain | Purpose |
|---|---|
| Products, Categories, Suppliers | Stores product master data |
| Inventory and Stock Movements | Tracks stock quantities, batches, locations, and movements |
| Units of Measure | Handles unit conversion |
| Customers, Contacts, and Pricing | Stores customer and pricing data |
| Procurement | Manages purchase orders and goods receipts |
| Supplier Invoicing | Tracks supplier invoices |
| Dispatch and Shipments | Manages customer dispatch and delivery |
| Returns | Handles customer and supplier returns |
| Stock Counts | Supports stocktake and variance checking |
| Promotions, Tags, and Attachments | Adds product metadata and files |
| System, Users, Jobs, and Reports | Supports users, jobs, and report exports |

---

# 3. Core Domain: Products, Categories, and Suppliers

## 3.1 Categories

Stores product category information.

| Field | Type | Key |
|---|---|---|
| category_id | char36 | PK |
| category_name | varchar |  |
| is_active | tinyint |  |

---

## 3.2 Products

Stores product master records.

| Field | Type | Key |
|---|---|---|
| product_id | char36 | PK |
| sku | varchar |  |
| product_name | varchar |  |
| category_id | char36 | FK |
| unit_cost | decimal |  |
| selling_price | decimal |  |
| reorder_level | int |  |
| reorder_quantity | int |  |
| status | varchar |  |

---

## 3.3 Suppliers

Stores supplier master records.

| Field | Type | Key |
|---|---|---|
| supplier_id | char36 | PK |
| supplier_code | varchar |  |
| supplier_name | varchar |  |
| email | varchar |  |
| phone | varchar |  |

---

## 3.4 Product Suppliers

Links products with suppliers.

| Field | Type | Key |
|---|---|---|
| product_supplier_id | char36 | PK |
| product_id | char36 | FK |
| supplier_id | char36 | FK |
| preferred_supplier | tinyint |  |
| lead_time_days | int |  |

---

## 3.5 Relationships

| Relationship | Description |
|---|---|
| Categories to Products | One category can classify many products |
| Products to Product Suppliers | One product can have many supplier links |
| Suppliers to Product Suppliers | One supplier can supply many products |

---

# 4. Inventory and Stock Movements

## 4.1 Warehouses

Stores warehouse information.

| Field | Type | Key |
|---|---|---|
| warehouse_id | char36 | PK |
| warehouse_code | varchar |  |
| warehouse_name | varchar |  |
| status | varchar |  |

---

## 4.2 Warehouse Locations

Stores specific locations inside a warehouse.

| Field | Type | Key |
|---|---|---|
| location_id | char36 | PK |
| warehouse_id | char36 | FK |
| location_code | varchar |  |
| full_path | varchar |  |
| is_active | tinyint |  |

---

## 4.3 Batches

Stores product batch and expiry information.

| Field | Type | Key |
|---|---|---|
| batch_id | char36 | PK |
| product_id | char36 | FK |
| batch_number | varchar |  |
| expiry_date | date |  |
| manufacture_date | date |  |
| quantity | decimal |  |

---

## 4.4 Inventory

Stores current stock quantities.

| Field | Type | Key |
|---|---|---|
| inventory_id | char36 | PK |
| product_id | char36 | FK |
| warehouse_id | char36 | FK |
| location_id | char36 | FK |
| batch_id | char36 | FK |
| quantity_on_hand | decimal |  |
| quantity_reserved | decimal |  |
| quantity_available | decimal |  |
| quantity_damaged | decimal |  |

---

## 4.5 Stock Movements

Stores stock movement header records.

| Field | Type | Key |
|---|---|---|
| movement_id | char36 | PK |
| movement_code | varchar |  |
| movement_type | varchar |  |
| warehouse_id | char36 | FK |
| source_location_id | char36 | FK |
| target_location_id | char36 | FK |
| status | varchar |  |

---

## 4.6 Stock Movement Items

Stores individual stock movement lines.

| Field | Type | Key |
|---|---|---|
| movement_item_id | char36 | PK |
| movement_id | char36 | FK |
| product_id | char36 | FK |
| batch_id | char36 | FK |
| source_inventory_id | char36 | FK |
| target_inventory_id | char36 | FK |
| quantity | decimal |  |
| unit_cost | decimal |  |

---

## 4.7 Alerts

Stores stock, expiry, and system alerts.

| Field | Type | Key |
|---|---|---|
| alert_id | char36 | PK |
| product_id | char36 | FK |
| inventory_id | char36 | FK |
| batch_id | char36 | FK |
| alert_type | varchar |  |
| priority | varchar |  |
| status | varchar |  |

---

## 4.8 Relationships

| Relationship | Description |
|---|---|
| Warehouses to Locations | One warehouse contains many locations |
| Products to Batches | One product can have many batches |
| Products to Inventory | One product can have many inventory records |
| Warehouses to Inventory | One warehouse holds many inventory records |
| Locations to Inventory | One location stores many inventory records |
| Batches to Inventory | One batch can be linked to inventory |
| Stock Movements to Stock Movement Items | One movement contains many movement items |
| Inventory to Alerts | Inventory conditions can trigger alerts |

---

# 5. Units of Measure and Conversions

## 5.1 Units of Measure

Stores unit definitions.

| Field | Type | Key |
|---|---|---|
| uom_id | char36 | PK |
| uom_code | varchar |  |
| uom_name | varchar |  |
| uom_type | varchar |  |
| symbol | varchar |  |
| is_base_unit | tinyint |  |
| is_active | tinyint |  |

---

## 5.2 UOM Conversions

Stores conversion rules between units.

| Field | Type | Key |
|---|---|---|
| conversion_id | char36 | PK |
| from_uom_id | char36 | FK |
| to_uom_id | char36 | FK |
| conversion_factor | decimal |  |
| is_active | tinyint |  |

---

## 5.3 Relationships

| Relationship | Description |
|---|---|
| UOM to UOM Conversions | One unit can be converted from or to another unit |

---

# 6. Customers, Contacts, and Pricing

## 6.1 Users

Stores user account information.

| Field | Type | Key |
|---|---|---|
| user_id | char36 | PK |
| full_name | varchar |  |
| email | varchar |  |
| role | varchar |  |

---

## 6.2 Customers

Stores customer records.

| Field | Type | Key |
|---|---|---|
| customer_id | char36 | PK |
| customer_code | varchar |  |
| customer_name | varchar |  |
| phone | varchar |  |
| email | varchar |  |
| city | varchar |  |
| status | varchar |  |

---

## 6.3 Contacts

Stores customer and supplier contact people.

| Field | Type | Key |
|---|---|---|
| contact_id | char36 | PK |
| customer_id | char36 | FK |
| supplier_id | char36 | FK |
| contact_type | varchar |  |
| full_name | varchar |  |
| email | varchar |  |

---

## 6.4 Price Lists

Stores pricing list headers.

| Field | Type | Key |
|---|---|---|
| price_list_id | char36 | PK |
| price_list_code | varchar |  |
| price_list_name | varchar |  |
| currency_code | varchar |  |
| valid_from | date |  |
| valid_to | date |  |
| status | varchar |  |

---

## 6.5 Price List Items

Stores product prices inside price lists.

| Field | Type | Key |
|---|---|---|
| price_list_item_id | char36 | PK |
| price_list_id | char36 | FK |
| product_id | char36 | FK |
| unit_price | decimal |  |
| min_quantity | int |  |

---

## 6.6 Relationships

| Relationship | Description |
|---|---|
| Customers to Contacts | One customer can have many contacts |
| Suppliers to Contacts | One supplier can have many contacts |
| Price Lists to Price List Items | One price list contains many item prices |
| Products to Price List Items | One product can appear in many price lists |

---

# 7. Procurement: Purchase Orders and Goods Receipts

## 7.1 Purchase Orders

Stores supplier purchase orders.

| Field | Type | Key |
|---|---|---|
| po_id | char36 | PK |
| po_number | varchar |  |
| supplier_id | char36 | FK |
| warehouse_id | char36 | FK |
| status | varchar |  |
| order_date | date |  |
| expected_delivery | date |  |
| total_amount | decimal |  |

---

## 7.2 Purchase Order Items

Stores purchase order line items.

| Field | Type | Key |
|---|---|---|
| po_item_id | char36 | PK |
| po_id | char36 | FK |
| product_id | char36 | FK |
| uom_id | char36 | FK |
| ordered_qty | decimal |  |
| received_qty | decimal |  |
| unit_cost | decimal |  |
| line_subtotal | decimal |  |

---

## 7.3 Goods Receipts

Stores goods received notes.

| Field | Type | Key |
|---|---|---|
| grn_id | char36 | PK |
| grn_number | varchar |  |
| po_id | char36 | FK |
| supplier_id | char36 | FK |
| warehouse_id | char36 | FK |
| status | varchar |  |
| received_date | date |  |

---

## 7.4 Goods Receipt Items

Stores received goods line items.

| Field | Type | Key |
|---|---|---|
| grn_item_id | char36 | PK |
| grn_id | char36 | FK |
| po_item_id | char36 | FK |
| product_id | char36 | FK |
| batch_id | char36 | FK |
| received_qty | decimal |  |
| accepted_qty | decimal |  |
| rejected_qty | decimal |  |

---

## 7.5 Relationships

| Relationship | Description |
|---|---|
| Suppliers to Purchase Orders | One supplier can supply many purchase orders |
| Warehouses to Purchase Orders | One warehouse receives many purchase orders |
| Purchase Orders to Purchase Order Items | One purchase order has many line items |
| Purchase Orders to Goods Receipts | One purchase order can have goods receipts |
| Goods Receipts to Goods Receipt Items | One goods receipt has many received items |

---

# 8. Supplier Invoicing

## 8.1 Supplier Invoices

Stores supplier invoice headers.

| Field | Type | Key |
|---|---|---|
| invoice_id | char36 | PK |
| invoice_number | varchar |  |
| supplier_id | char36 | FK |
| po_id | char36 | FK |
| grn_id | char36 | FK |
| status | varchar |  |
| invoice_date | date |  |
| due_date | date |  |
| total_amount | decimal |  |
| amount_paid | decimal |  |

---

## 8.2 Supplier Invoice Items

Stores supplier invoice line items.

| Field | Type | Key |
|---|---|---|
| invoice_item_id | char36 | PK |
| invoice_id | char36 | FK |
| po_item_id | char36 | FK |
| product_id | char36 | FK |
| quantity | decimal |  |
| unit_cost | decimal |  |
| line_total | decimal |  |

---

## 8.3 Relationships

| Relationship | Description |
|---|---|
| Suppliers to Supplier Invoices | One supplier can issue many invoices |
| Supplier Invoices to Supplier Invoice Items | One invoice contains many invoice items |
| Purchase Orders to Supplier Invoices | An invoice may relate to a purchase order |
| Goods Receipts to Supplier Invoices | An invoice may relate to a goods receipt |

---

# 9. Dispatch, Shipments, and Carriers

## 9.1 Carriers

Stores delivery carrier information.

| Field | Type | Key |
|---|---|---|
| carrier_id | char36 | PK |
| carrier_code | varchar |  |
| carrier_name | varchar |  |
| tracking_url_template | varchar |  |
| is_active | tinyint |  |

---

## 9.2 Dispatch Orders

Stores dispatch order headers.

| Field | Type | Key |
|---|---|---|
| dispatch_id | char36 | PK |
| dispatch_number | varchar |  |
| customer_id | char36 | FK |
| warehouse_id | char36 | FK |
| status | varchar |  |
| priority | int |  |
| scheduled_date | date |  |
| delivery_address | text |  |

---

## 9.3 Dispatch Order Items

Stores dispatch order line items.

| Field | Type | Key |
|---|---|---|
| dispatch_item_id | char36 | PK |
| dispatch_id | char36 | FK |
| product_id | char36 | FK |
| batch_id | char36 | FK |
| requested_qty | decimal |  |
| picked_qty | decimal |  |
| dispatched_qty | decimal |  |

---

## 9.4 Shipments

Stores shipment records.

| Field | Type | Key |
|---|---|---|
| shipment_id | char36 | PK |
| shipment_number | varchar |  |
| dispatch_id | char36 | FK |
| carrier_id | char36 | FK |
| status | varchar |  |
| tracking_number | varchar |  |
| shipped_at | datetime |  |
| actual_delivery | datetime |  |

---

## 9.5 Shipment Events

Stores shipment tracking events.

| Field | Type | Key |
|---|---|---|
| event_id | char36 | PK |
| shipment_id | char36 | FK |
| event_status | varchar |  |
| location_description | varchar |  |
| occurred_at | datetime |  |

---

## 9.6 Relationships

| Relationship | Description |
|---|---|
| Customers to Dispatch Orders | One customer can receive many dispatch orders |
| Warehouses to Dispatch Orders | One warehouse dispatches many orders |
| Dispatch Orders to Dispatch Order Items | One dispatch order contains many items |
| Dispatch Orders to Shipments | One dispatch order can generate shipment records |
| Carriers to Shipments | One carrier can carry many shipments |
| Shipments to Shipment Events | One shipment has many tracking events |

---

# 10. Returns

## 10.1 Return Orders

Stores return header records.

| Field | Type | Key |
|---|---|---|
| return_id | char36 | PK |
| return_number | varchar |  |
| return_type | varchar |  |
| warehouse_id | char36 | FK |
| customer_id | char36 | FK |
| supplier_id | char36 | FK |
| dispatch_id | char36 | FK |
| po_id | char36 | FK |
| reason | varchar |  |
| status | varchar |  |
| return_date | date |  |
| refund_amount | decimal |  |

---

## 10.2 Return Order Items

Stores return line items.

| Field | Type | Key |
|---|---|---|
| return_item_id | char36 | PK |
| return_id | char36 | FK |
| product_id | char36 | FK |
| batch_id | char36 | FK |
| location_id | char36 | FK |
| returned_qty | decimal |  |
| accepted_qty | decimal |  |
| rejected_qty | decimal |  |
| restock_decision | varchar |  |

---

## 10.3 Relationships

| Relationship | Description |
|---|---|
| Warehouses to Return Orders | One warehouse accepts many returns |
| Return Orders to Return Order Items | One return order contains many returned items |
| Customers to Return Orders | Customer returns can be linked to customer records |
| Suppliers to Return Orders | Supplier returns can be linked to supplier records |
| Dispatch Orders to Return Orders | Customer returns may reference original dispatch |
| Purchase Orders to Return Orders | Supplier returns may reference purchase order |

---

# 11. Stock Counts

## 11.1 Stock Counts

Stores stocktake headers.

| Field | Type | Key |
|---|---|---|
| count_id | char36 | PK |
| count_number | varchar |  |
| warehouse_id | char36 | FK |
| status | varchar |  |
| count_type | varchar |  |
| scheduled_date | date |  |
| total_items | int |  |
| counted_items | int |  |
| variance_items | int |  |

---

## 11.2 Stock Count Items

Stores stocktake item records.

| Field | Type | Key |
|---|---|---|
| count_item_id | char36 | PK |
| count_id | char36 | FK |
| product_id | char36 | FK |
| location_id | char36 | FK |
| batch_id | char36 | FK |
| inventory_id | char36 | FK |
| system_qty | decimal |  |
| counted_qty | decimal |  |
| variance_qty | decimal |  |
| adjustment_posted | tinyint |  |

---

## 11.3 Relationships

| Relationship | Description |
|---|---|
| Warehouses to Stock Counts | One warehouse can have many stock counts |
| Stock Counts to Stock Count Items | One stock count includes many counted items |
| Inventory to Stock Count Items | Stock count items compare against system inventory |
| Products to Stock Count Items | Counted items are linked to products |
| Locations to Stock Count Items | Counted items are linked to warehouse locations |
| Batches to Stock Count Items | Counted items may be linked to batches |

---

# 12. Promotions, Tags, and Attachments

## 12.1 Promotions

Stores promotion records.

| Field | Type | Key |
|---|---|---|
| promotion_id | char36 | PK |
| promotion_code | varchar |  |
| promotion_name | varchar |  |
| discount_type | varchar |  |
| discount_value | decimal |  |
| is_active | tinyint |  |
| valid_from | datetime |  |
| valid_to | datetime |  |

---

## 12.2 Promotion Products

Links promotions to products.

| Field | Type | Key |
|---|---|---|
| promo_product_id | char36 | PK |
| promotion_id | char36 | FK |
| product_id | char36 | FK |

---

## 12.3 Tags

Stores product tags.

| Field | Type | Key |
|---|---|---|
| tag_id | char36 | PK |
| tag_name | varchar |  |
| color_hex | varchar |  |
| is_active | tinyint |  |

---

## 12.4 Product Tags

Links products to tags.

| Field | Type | Key |
|---|---|---|
| product_tag_id | char36 | PK |
| product_id | char36 | FK |
| tag_id | char36 | FK |
| tagged_by | char36 | FK |
| tagged_at | datetime |  |

---

## 12.5 Attachments

Stores file metadata.

| Field | Type | Key |
|---|---|---|
| attachment_id | char36 | PK |
| entity_type | varchar |  |
| entity_id | char36 |  |
| file_name | varchar |  |
| mime_type | varchar |  |
| storage_path | text |  |
| uploaded_by | char36 | FK |

---

## 12.6 Relationships

| Relationship | Description |
|---|---|
| Promotions to Promotion Products | One promotion can apply to many products |
| Products to Promotion Products | One product can be included in many promotions |
| Tags to Product Tags | One tag can label many products |
| Products to Product Tags | One product can have many tags |
| Users to Product Tags | A user can tag products |
| Attachments to Entities | Attachments can be linked to different entity types |

---

# 13. System: Users, Jobs, and Reports

## 13.1 Users

Stores system user accounts.

| Field | Type | Key |
|---|---|---|
| user_id | char36 | PK |
| full_name | varchar |  |
| email | varchar |  |
| role | varchar |  |
| is_active | tinyint |  |
| created_at | datetime |  |

---

## 13.2 Scheduled Jobs

Stores background job records.

| Field | Type | Key |
|---|---|---|
| job_id | char36 | PK |
| job_name | varchar |  |
| job_type | varchar |  |
| status | varchar |  |
| scheduled_at | datetime |  |
| started_at | datetime |  |
| completed_at | datetime |  |
| duration_ms | int |  |
| triggered_by | char36 | FK |

---

## 13.3 Report Exports

Stores exported report metadata.

| Field | Type | Key |
|---|---|---|
| export_id | char36 | PK |
| report_name | varchar |  |
| export_format | varchar |  |
| filters_applied | json |  |
| file_size_bytes | bigint |  |
| row_count | int |  |
| exported_by | char36 | FK |
| exported_at | datetime |  |
| expires_at | datetime |  |
| is_deleted | tinyint |  |

---

## 13.4 Relationships

| Relationship | Description |
|---|---|
| Users to Scheduled Jobs | A user can trigger scheduled jobs |
| Users to Report Exports | A user can export reports |
| Scheduled Jobs to Reports | Jobs can generate reports |
| Report Exports to Files | Export records point to generated files |

---

# 14. Key Primary Keys

| Entity | Primary Key |
|---|---|
| Categories | category_id |
| Products | product_id |
| Suppliers | supplier_id |
| Product Suppliers | product_supplier_id |
| Warehouses | warehouse_id |
| Warehouse Locations | location_id |
| Batches | batch_id |
| Inventory | inventory_id |
| Stock Movements | movement_id |
| Stock Movement Items | movement_item_id |
| Alerts | alert_id |
| Units of Measure | uom_id |
| UOM Conversions | conversion_id |
| Customers | customer_id |
| Contacts | contact_id |
| Price Lists | price_list_id |
| Purchase Orders | po_id |
| Goods Receipts | grn_id |
| Supplier Invoices | invoice_id |
| Dispatch Orders | dispatch_id |
| Shipments | shipment_id |
| Return Orders | return_id |
| Stock Counts | count_id |
| Promotions | promotion_id |
| Tags | tag_id |
| Attachments | attachment_id |
| Users | user_id |
| Scheduled Jobs | job_id |
| Report Exports | export_id |

---

# 15. Key Foreign Key Examples

| Foreign Key | References | Purpose |
|---|---|---|
| products.category_id | categories.category_id | Links product to category |
| product_suppliers.product_id | products.product_id | Links supplier relationship to product |
| product_suppliers.supplier_id | suppliers.supplier_id | Links product supplier to supplier |
| warehouse_locations.warehouse_id | warehouses.warehouse_id | Links location to warehouse |
| batches.product_id | products.product_id | Links batch to product |
| inventory.product_id | products.product_id | Links inventory to product |
| inventory.warehouse_id | warehouses.warehouse_id | Links inventory to warehouse |
| inventory.location_id | warehouse_locations.location_id | Links inventory to warehouse location |
| inventory.batch_id | batches.batch_id | Links inventory to batch |
| stock_movement_items.movement_id | stock_movements.movement_id | Links movement item to movement header |
| purchase_orders.supplier_id | suppliers.supplier_id | Links purchase order to supplier |
| purchase_orders.warehouse_id | warehouses.warehouse_id | Links purchase order to warehouse |
| goods_receipts.po_id | purchase_orders.po_id | Links goods receipt to purchase order |
| dispatch_orders.customer_id | customers.customer_id | Links dispatch to customer |
| dispatch_orders.warehouse_id | warehouses.warehouse_id | Links dispatch to warehouse |
| shipments.dispatch_id | dispatch_orders.dispatch_id | Links shipment to dispatch |
| return_orders.warehouse_id | warehouses.warehouse_id | Links return to warehouse |
| stock_count_items.inventory_id | inventory.inventory_id | Links stock count item to inventory |

---

# 16. Database Design Summary

The ERD supports a complete warehouse inventory management system by covering:

- Product catalogue management
- Supplier management
- Warehouse and location control
- Batch and expiry tracking
- Inventory quantity tracking
- Stock movement history
- Low-stock and expiry alerts
- Purchase orders and receiving
- Supplier invoicing
- Customer dispatch
- Shipment tracking
- Returns and damaged goods
- Stock counts and variance control
- Promotions and tagging
- Attachments and file storage
- Users, reports, and scheduled jobs

---

# 17. Conclusion

The ERD provides a professional relational database structure for the Moonlight Warehouse Inventory Management System.

It supports both academic documentation and real-world warehouse operations by defining clear entities, keys, and relationships across inventory, procurement, dispatch, returns, reporting, and system administration.
