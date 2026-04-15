# Software Requirements Specification (SRS)

## Moonlight Warehouse Inventory Management System

**Repository:** MEL15-Avengers / Assignment1  
**Document Type:** Software Requirements Specification  
**Version:** 1.0  
**Prepared By:** MEL15-Avengers Team  
**Project:** Moonlight Warehouse Inventory Management System  

---

## Document Links

| Document | Path |
|---|---|
| Project Overview | [project_overview.docx](./project_overview.docx) |
| Functional and Non-Functional Requirements | [FR_and_NFR.docx](./FR_and_NFR.docx) |
| Research Document | [Research_moonlightWarehouse.docx](./Research_moonlightWarehouse.docx) |
| Budget Planning | [Budget_Planning.docx](./Budget_Planning.docx) |
| Gantt Chart | [Gantt_chart_moonlight.pdf](./Gantt_chart_moonlight.pdf) |
| Work Breakdown Structure | [Wbs_moonlight.svg](./Wbs_moonlight.svg) |
| Context Diagram | [Context_Diagram.png](./Context_Diagram.png) |
| ERD | [ERD_moonlight.pdf](./ERD_moonlight.pdf) |
| DFD Level 1 and 2 | [dfd-lvl1_2.pdf](./dfd-lvl1_2.pdf) |
| Sequence Diagram | [Seqences_Diagram.pdf](./Seqences_Diagram.pdf) |
| Deployment Diagram | [deployment_diagram.png](./deployment_diagram.png) |
| Wireframes | [wireframes.pdf](./wireframes.pdf) |
| DFD Source Files | [dfd1and2.zip](./dfd1and2.zip) |
| Wireframe Source Files | [wireframes.zip](./wireframes.zip) |

---

# 1. Introduction

## 1.1 Purpose

The purpose of this Software Requirements Specification document is to define the complete software requirements for the **Moonlight Warehouse Inventory Management System**.

This system is designed to help a warehouse-based business manage inventory, products, users, stock movement, warehouse locations, reporting, and administrative control through a digital web application.

The SRS explains what the system will do, who will use it, what modules are required, what functional and non-functional requirements must be included, and how the system will support real business operations.

---

## 1.2 Scope

The Moonlight Warehouse Inventory Management System will provide a centralized platform for managing inventory across one or more warehouse locations.

The system will include:

- User authentication and role-based access
- Admin user management
- Product management
- Inventory tracking
- Stock-in and stock-out records
- Warehouse location management
- Supplier and order management
- Reporting and analytics
- Dashboard overview
- Data export
- Audit tracking
- Secure database storage
- Cloud deployment support

The system will be developed as a modern web application using frontend, backend, and database technologies.

---

## 1.3 Intended Audience

This document is intended for:

- Project supervisor
- Development team
- Client/business owner
- System admin
- Warehouse manager
- Site manager
- Normal warehouse employees
- Testers
- Future maintainers

---

## 1.4 Project Objectives

The main objectives of the system are:

1. Replace manual inventory tracking with a digital system.
2. Improve stock accuracy.
3. Reduce human errors in warehouse operations.
4. Allow different user roles to access only relevant functions.
5. Provide real-time inventory visibility.
6. Support multiple warehouse locations.
7. Generate useful business reports.
8. Improve accountability through audit logs.
9. Provide a scalable system for future expansion.
10. Deploy the system using a professional cloud-based architecture.

---

# 2. Overall Description

## 2.1 Product Perspective

The Moonlight Warehouse Inventory Management System is a web-based business application. It will be accessible through a browser and will connect to a backend server and a PostgreSQL database.

The system is expected to support:

- Frontend user interface
- Backend API
- Relational database
- Secure authentication
- Role-based permissions
- Cloud hosting
- Domain-based access
- Reporting and export features

Related design documents are available here:

- [Context Diagram](./Context_Diagram.png)
- [ERD](./ERD_moonlight.pdf)
- [Deployment Diagram](./deployment_diagram.png)
- [Wireframes](./wireframes.pdf)

---

## 2.2 Product Functions

The system will include the following core functions:

- Login and logout
- User account management
- Role management
- Product creation and update
- Product category management
- Inventory quantity tracking
- Stock movement management
- Warehouse location management
- Supplier record management
- Order tracking
- Low-stock alerts
- Dashboard summaries
- Report generation
- Exporting data
- Audit log tracking

---

## 2.3 User Classes and Characteristics

| User Role | Description |
|---|---|
| Admin | Manages users, roles, permissions, system settings, and full system access |
| Manager | Oversees inventory, reports, products, suppliers, and warehouse activities |
| Site Manager | Manages a specific warehouse location and stock operations |
| Employee | Performs daily warehouse tasks such as stock-in, stock-out, and product updates |
| Client/Owner | Reviews reports, inventory summaries, and business performance |

---

# 3. System Modules

## 3.1 Authentication Module

The authentication module controls access to the system.

Main features:

- Login
- Logout
- Password validation
- Session handling
- Secure access control
- Role-based redirection

---

## 3.2 Admin Management Module

The admin module allows the administrator to manage system users and permissions.

Main features:

- Add users
- Edit users
- Delete users
- Assign roles
- Activate or deactivate accounts
- View user activity

---

## 3.3 Product Management Module

The product module manages warehouse product information.

Main features:

- Add product
- Edit product
- Delete product
- View product list
- Search product
- Filter product by category
- Assign product SKU/barcode
- Manage product description, price, and quantity

---

## 3.4 Inventory Management Module

The inventory module tracks stock levels.

Main features:

- View current stock
- Update stock
- Track stock-in
- Track stock-out
- View stock history
- Identify low stock
- Prevent negative stock quantity

---

## 3.5 Warehouse Location Module

This module manages multiple warehouse locations.

Main features:

- Add warehouse
- Edit warehouse
- Delete warehouse
- Assign products to warehouse
- Track inventory per warehouse
- Manage location details

---

## 3.6 Supplier Management Module

The supplier module stores supplier-related data.

Main features:

- Add supplier
- Edit supplier
- Delete supplier
- View supplier list
- Link supplier to products
- Track supplier contact details

---

## 3.7 Order Management Module

The order module manages purchase and stock movement records.

Main features:

- Create order
- Update order status
- Track received stock
- Track outgoing stock
- View order history
- Link orders with suppliers and products

---

## 3.8 Reporting Module

The reporting module provides business and warehouse reports.

Main features:

- Inventory report
- Product report
- Low-stock report
- Stock movement report
- Warehouse report
- Supplier report
- Export reports

---

## 3.9 Dashboard Module

The dashboard gives users a quick system overview.

Main features:

- Total products
- Total stock
- Low-stock alerts
- Recent stock movements
- Warehouse summary
- User activity summary
- Charts and statistics

---

## 3.10 Audit Log Module

The audit module records important system actions.

Main features:

- Track user actions
- Record product changes
- Record stock updates
- Record login activity
- Record admin changes
- Support accountability

---

# 4. Functional Requirements

Detailed functional requirements are available in:

[FR_and_NFR.docx](./FR_and_NFR.docx)

Summary of key functional requirements:

| ID | Requirement |
|---|---|
| FR-01 | The system shall allow users to log in securely. |
| FR-02 | The system shall allow users to log out. |
| FR-03 | The system shall support role-based access control. |
| FR-04 | The admin shall be able to create user accounts. |
| FR-05 | The admin shall be able to update user details. |
| FR-06 | The admin shall be able to deactivate users. |
| FR-07 | The system shall allow product creation. |
| FR-08 | The system shall allow product editing. |
| FR-09 | The system shall allow product deletion. |
| FR-10 | The system shall display all products in a list. |
| FR-11 | The system shall allow product search and filtering. |
| FR-12 | The system shall track inventory quantity. |
| FR-13 | The system shall record stock-in transactions. |
| FR-14 | The system shall record stock-out transactions. |
| FR-15 | The system shall prevent stock from becoming negative. |
| FR-16 | The system shall show low-stock alerts. |
| FR-17 | The system shall manage warehouse locations. |
| FR-18 | The system shall assign inventory to warehouse locations. |
| FR-19 | The system shall manage supplier information. |
| FR-20 | The system shall generate reports. |
| FR-21 | The system shall allow data export. |
| FR-22 | The system shall display dashboard statistics. |
| FR-23 | The system shall record audit logs. |
| FR-24 | The system shall allow managers to view inventory reports. |
| FR-25 | The system shall allow employees to perform assigned warehouse tasks. |

---

# 5. Non-Functional Requirements

Detailed non-functional requirements are available in:

[FR_and_NFR.docx](./FR_and_NFR.docx)

Summary:

| ID | Requirement |
|---|---|
| NFR-01 | The system shall be secure. |
| NFR-02 | The system shall protect user passwords. |
| NFR-03 | The system shall be available through a web browser. |
| NFR-04 | The system shall respond quickly to user requests. |
| NFR-05 | The system shall support multiple users. |
| NFR-06 | The system shall store data reliably. |
| NFR-07 | The system shall be easy to use. |
| NFR-08 | The system shall support future scalability. |
| NFR-09 | The system shall maintain audit records. |
| NFR-10 | The system shall support backup and recovery. |

---

# 6. External Interface Requirements

## 6.1 User Interface

The system will provide a browser-based user interface.

UI design reference:

[Wireframes](./wireframes.pdf)

The interface should include:

- Login page
- Dashboard
- User management page
- Product management page
- Inventory page
- Warehouse page
- Supplier page
- Reports page
- Settings page

---

## 6.2 Hardware Interface

The system will not require special hardware.

Users may access the system using:

- Desktop computer
- Laptop
- Tablet
- Mobile browser, if responsive design is implemented

---

## 6.3 Software Interface

The system may use:

- React or similar frontend framework
- Node.js/Express or similar backend framework
- PostgreSQL database
- REST API
- Cloud hosting
- Vercel for frontend deployment
- AWS for backend/database/infrastructure

Deployment reference:

[Deployment Diagram](./deployment_diagram.png)

---

## 6.4 Communication Interface

The system will communicate using:

- HTTPS
- REST API requests
- JSON data format
- Secure database connection

---

# 7. Database Requirements

The database will store:

- Users
- Roles
- Products
- Categories
- Inventory records
- Warehouses
- Suppliers
- Orders
- Stock movements
- Audit logs

Database design reference:

[ERD](./ERD_moonlight.pdf)

---

# 8. System Design References

## 8.1 Context Diagram

The context diagram shows how external users and systems interact with the Moonlight Warehouse Inventory Management System.

Reference:

[Context_Diagram.png](./Context_Diagram.png)

---

## 8.2 Data Flow Diagrams

The DFD shows how data flows between processes, users, and storage.

References:

- [dfd-lvl1_2.pdf](./dfd-lvl1_2.pdf)
- [dfd1and2.zip](./dfd1and2.zip)

---

## 8.3 Sequence Diagram

The sequence diagram explains the order of interactions between users, frontend, backend, and database.

Reference:

[Seqences_Diagram.pdf](./Seqences_Diagram.pdf)

---

## 8.4 Deployment Diagram

The deployment diagram shows how the system will be hosted and deployed.

Reference:

[deployment_diagram.png](./deployment_diagram.png)

---

## 8.5 Work Breakdown Structure

The WBS shows project tasks and work packages.

Reference:

[Wbs_moonlight.svg](./Wbs_moonlight.svg)

---

# 9. System Features

## 9.1 Login Feature

Users must enter valid credentials to access the system. Invalid users should not be allowed to access protected pages.

## 9.2 User Management Feature

Admins can create and manage user accounts. Each user must have an assigned role.

## 9.3 Product Management Feature

Authorized users can add, edit, delete, search, and view products.

## 9.4 Inventory Tracking Feature

The system must update inventory when stock is added or removed.

## 9.5 Warehouse Management Feature

The system must support multiple warehouse locations.

## 9.6 Reporting Feature

The system must generate useful inventory and business reports.

## 9.7 Export Feature

The system must allow users to export data for documentation, analysis, or backup.

---

# 10. Security Requirements

The system should include:

- Secure login
- Password hashing
- HTTPS
- Role-based permissions
- Protected API routes
- Input validation
- Error handling
- Database access control
- Audit logging
- Backup support

---

# 11. Assumptions and Dependencies

## 11.1 Assumptions

- Users will have internet access.
- Admin will manage user accounts.
- Warehouse employees will enter accurate stock data.
- The system will be deployed using cloud services.
- The database will be maintained regularly.

## 11.2 Dependencies

- Web hosting service
- Backend hosting service
- PostgreSQL database
- Domain provider
- Internet connection
- Browser compatibility
- Development tools and frameworks

---

# 12. Scope

## 12.1 In Scope

The following are included:

- User login
- Admin user management
- Product management
- Inventory tracking
- Warehouse management
- Supplier management
- Order management
- Reporting
- Data export
- Dashboard
- Audit logs
- Cloud deployment

## 12.2 Out of Scope

The following are not included in the initial version:

- Mobile application
- AI demand forecasting
- Advanced barcode scanner hardware integration
- Automated supplier payment
- Full accounting system
- Payroll system
- Delivery driver tracking
- IoT warehouse automation

---

# 13. Project Planning References

## 13.1 Budget Planning

The estimated project cost, including labour, software, infrastructure, training, maintenance, and contingency, is documented here:

[Budget_Planning.docx](./Budget_Planning.docx)

## 13.2 Gantt Chart

The project schedule and timeline are documented here:

[Gantt_chart_moonlight.pdf](./Gantt_chart_moonlight.pdf)

## 13.3 Research

Background research and warehouse system analysis are documented here:

[Research_moonlightWarehouse.docx](./Research_moonlightWarehouse.docx)

---

# 14. Testing Requirements

The system should be tested using:

- Unit testing
- Integration testing
- User acceptance testing
- Security testing
- Performance testing
- Database testing
- Role-based access testing
- UI testing

Main test areas:

| Test Area | Description |
|---|---|
| Login | Verify valid and invalid login |
| User Roles | Verify correct permissions |
| Product Management | Verify CRUD operations |
| Inventory | Verify stock updates |
| Warehouse | Verify location-based stock |
| Reports | Verify correct report data |
| Export | Verify exported files |
| Security | Verify protected pages and APIs |

---

# 15. Acceptance Criteria

The system will be accepted when:

1. Users can log in and log out successfully.
2. Admin can manage users.
3. Products can be added, updated, deleted, and viewed.
4. Inventory quantity updates correctly.
5. Stock-in and stock-out records are saved.
6. Warehouse locations are managed correctly.
7. Reports are generated correctly.
8. Role-based access works properly.
9. Data is stored in the database.
10. The system is deployed and accessible online.
11. Major bugs are fixed.
12. Documentation is complete.

---

# 16. Glossary

| Term | Meaning |
|---|---|
| SRS | Software Requirements Specification |
| Admin | User with full system control |
| Manager | User who manages inventory and reports |
| Site Manager | User responsible for a warehouse location |
| Employee | Normal warehouse user |
| Inventory | Stock or items stored in warehouse |
| SKU | Stock Keeping Unit |
| ERD | Entity Relationship Diagram |
| DFD | Data Flow Diagram |
| WBS | Work Breakdown Structure |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |

---

# 17. Conclusion

This SRS document defines the complete requirements for the Moonlight Warehouse Inventory Management System. It explains the system purpose, scope, users, modules, functional requirements, non-functional requirements, interfaces, database needs, security, testing, and acceptance criteria.

All supporting project documents are linked in this SRS so the development team, supervisor, and client can easily understand the complete project structure.

---

## Appendix: Repository Document Index

- [Project Overview](./project_overview.docx)
- [Functional and Non-Functional Requirements](./FR_and_NFR.docx)
- [Research Document](./Research_moonlightWarehouse.docx)
- [Budget Planning](./Budget_Planning.docx)
- [Gantt Chart](./Gantt_chart_moonlight.pdf)
- [WBS](./Wbs_moonlight.svg)
- [Context Diagram](./Context_Diagram.png)
- [ERD](./ERD_moonlight.pdf)
- [DFD Level 1 and 2](./dfd-lvl1_2.pdf)
- [Sequence Diagram](./Seqences_Diagram.pdf)
- [Deployment Diagram](./deployment_diagram.png)
- [Wireframes](./wireframes.pdf)
