# User Guide  
## Moonlight Warehouse Inventory Management System

**Version:** 1.0  
**Prepared For:** Moonlight Warehouse Inventory Management System  
**Document Type:** User Guide  
**Users Covered:** Admin, Manager, Site Manager, Employee  

---

## 1. Introduction

The Moonlight Warehouse Inventory Management System is a web-based system used to manage warehouse stock, users, products, suppliers, stock movement, reports, and warehouse operations.

This user guide explains how users can use the system step by step, including account creation, login, dashboard usage, stock management, product management, reporting, and logout.

---

## 2. User Roles

The system has different user roles. Each role has different permissions.

| Role | Description | Main Permissions |
|---|---|---|
| Admin | Main system controller | Manage users, roles, warehouses, products, reports, backups, and system settings |
| Manager | Warehouse/business manager | Approve stock actions, view reports, monitor inventory, manage operations |
| Site Manager | Manages one warehouse/site | Manage stock movements, check inventory, update stock status, handle site-level tasks |
| Employee | Normal warehouse staff | View assigned tasks, update stock-in/stock-out records, search products, report issues |

---

## 3. Account Creation / Registration

### 3.1 Register a New Account

1. Open the Moonlight Warehouse Inventory Management System in a web browser.
2. Click **Register** or **Create Account**.
3. Enter the required details:
   - Full Name
   - Email Address
   - Phone Number
   - Password
   - Confirm Password
   - Warehouse / Site, if available
4. Click **Submit** or **Register**.
5. The system will check if the email is already registered.
6. If the details are valid, the system will create the account.
7. Depending on system rules, the account may require admin approval before login.

### 3.2 Password Rules

The password should follow these rules:

- Must be at least 8 characters long.
- Should include uppercase and lowercase letters.
- Should include at least one number.
- Should include at least one special character.
- Password and confirm password must match.

### 3.3 Account Approval

Some accounts may not become active immediately.

1. After registration, the account status may show as **Pending Approval**.
2. Admin reviews the new account request.
3. Admin assigns the correct role.
4. Admin assigns the user to a warehouse or site.
5. After approval, the user can log in.

---

## 4. Login Guide

### 4.1 Login to the System

1. Open the system login page.
2. Enter your registered email address.
3. Enter your password.
4. Click **Login**.
5. If the details are correct, the system opens your dashboard.
6. If your account is inactive or pending, contact the Admin.

### 4.2 Login Errors

| Error Message | Meaning | Action |
|---|---|---|
| Invalid email or password | Login details are incorrect | Re-enter email and password |
| Account pending approval | Admin has not approved the account yet | Contact Admin |
| Account disabled | Admin has disabled your account | Contact Admin |
| Required field missing | Email or password is empty | Fill all required fields |

---

## 5. Forgot Password

### 5.1 Reset Password

1. Go to the login page.
2. Click **Forgot Password**.
3. Enter your registered email address.
4. Click **Send Reset Link**.
5. Open your email inbox.
6. Click the password reset link.
7. Enter a new password.
8. Confirm the new password.
9. Click **Reset Password**.
10. Login again using the new password.

---

## 6. Dashboard Guide

After login, users are redirected to the dashboard.

### 6.1 Dashboard Items

The dashboard may show:

- Total products
- Total stock quantity
- Low-stock products
- Out-of-stock products
- Pending stock requests
- Recent stock movements
- Warehouse summary
- Reports shortcut
- Alerts and notifications

### 6.2 Dashboard Usage

1. Review inventory summary cards.
2. Check low-stock alerts.
3. View pending approvals or tasks.
4. Open recent stock movement records.
5. Use navigation menu to access modules.

---

## 7. Profile Management

### 7.1 View Profile

1. Click your profile icon or name.
2. Select **My Profile**.
3. View your personal information:
   - Name
   - Email
   - Phone
   - Role
   - Assigned warehouse
   - Account status

### 7.2 Update Profile

1. Go to **My Profile**.
2. Click **Edit Profile**.
3. Update allowed fields such as name or phone number.
4. Click **Save Changes**.
5. The system updates your profile.

### 7.3 Change Password

1. Go to **My Profile**.
2. Click **Change Password**.
3. Enter current password.
4. Enter new password.
5. Confirm new password.
6. Click **Update Password**.

---

# ADMIN USER GUIDE

## 8. Admin Dashboard

Admin has access to full system management.

Admin can manage:

- Users
- Roles and permissions
- Warehouses
- Products
- Categories
- Suppliers
- Stock records
- Reports
- Audit logs
- Backup and export
- System settings

---

## 9. User Management

### 9.1 View Users

1. Login as Admin.
2. Go to **Users** or **User Management**.
3. View the list of registered users.
4. Use search/filter to find users by:
   - Name
   - Email
   - Role
   - Warehouse
   - Status

### 9.2 Create User Account

1. Go to **User Management**.
2. Click **Add User**.
3. Enter user details:
   - Full Name
   - Email
   - Phone
   - Password
   - Role
   - Assigned Warehouse
   - Account Status
4. Click **Create User**.
5. The system creates the user account.

### 9.3 Approve Registered User

1. Go to **User Management**.
2. Open **Pending Users**.
3. Select the user request.
4. Review user details.
5. Assign role.
6. Assign warehouse/site.
7. Click **Approve**.
8. The user account becomes active.

### 9.4 Reject User Request

1. Go to **Pending Users**.
2. Select the user request.
3. Click **Reject**.
4. Enter reason, if required.
5. Confirm rejection.

### 9.5 Edit User

1. Go to **User Management**.
2. Select a user.
3. Click **Edit**.
4. Update user details:
   - Name
   - Phone
   - Role
   - Warehouse
   - Status
5. Click **Save Changes**.

### 9.6 Disable User

1. Open **User Management**.
2. Select the user.
3. Click **Disable** or change status to **Inactive**.
4. Confirm action.
5. The user will no longer be able to log in.

### 9.7 Delete User

1. Go to **User Management**.
2. Select the user.
3. Click **Delete**.
4. Confirm deletion.

**Note:** For audit and security reasons, disabling a user is usually better than deleting a user.

---

## 10. Role and Permission Management

### 10.1 View Roles

1. Login as Admin.
2. Go to **Roles & Permissions**.
3. View available roles:
   - Admin
   - Manager
   - Site Manager
   - Employee

### 10.2 Assign Role to User

1. Go to **User Management**.
2. Select a user.
3. Click **Edit Role**.
4. Choose the correct role.
5. Click **Save**.

### 10.3 Manage Permissions

1. Go to **Roles & Permissions**.
2. Select a role.
3. Enable or disable permissions such as:
   - View products
   - Add products
   - Edit products
   - Delete products
   - Manage stock-in
   - Manage stock-out
   - Approve requests
   - View reports
   - Manage users
4. Click **Save Permissions**.

---

## 11. Warehouse Management

### 11.1 Add Warehouse

1. Login as Admin.
2. Go to **Warehouse Management**.
3. Click **Add Warehouse**.
4. Enter warehouse details:
   - Warehouse Name
   - Location
   - Address
   - Contact Person
   - Phone Number
   - Capacity
   - Status
5. Click **Save Warehouse**.

### 11.2 Edit Warehouse

1. Go to **Warehouse Management**.
2. Select a warehouse.
3. Click **Edit**.
4. Update required details.
5. Click **Save Changes**.

### 11.3 Disable Warehouse

1. Go to **Warehouse Management**.
2. Select warehouse.
3. Change status to **Inactive**.
4. Click **Save**.

---

## 12. Category Management

### 12.1 Add Product Category

1. Go to **Categories**.
2. Click **Add Category**.
3. Enter:
   - Category Name
   - Description
4. Click **Save**.

### 12.2 Edit Category

1. Go to **Categories**.
2. Select category.
3. Click **Edit**.
4. Update details.
5. Click **Save**.

---

## 13. Supplier Management

### 13.1 Add Supplier

1. Go to **Suppliers**.
2. Click **Add Supplier**.
3. Enter supplier details:
   - Supplier Name
   - Contact Person
   - Email
   - Phone
   - Address
   - Product Type
4. Click **Save Supplier**.

### 13.2 Edit Supplier

1. Open **Suppliers**.
2. Select supplier.
3. Click **Edit**.
4. Update supplier details.
5. Click **Save Changes**.

---

# PRODUCT AND INVENTORY GUIDE

## 14. Product Management

### 14.1 View Product List

1. Go to **Products**.
2. View all products.
3. Use search/filter by:
   - Product name
   - SKU
   - Category
   - Warehouse
   - Stock status

### 14.2 Add New Product

1. Go to **Products**.
2. Click **Add Product**.
3. Enter product details:
   - Product Name
   - SKU / Product Code
   - Category
   - Description
   - Unit of Measurement
   - Supplier
   - Warehouse
   - Initial Stock Quantity
   - Minimum Stock Level
   - Maximum Stock Level
   - Unit Price
   - Status
4. Click **Save Product**.
5. The system adds the product to inventory.

### 14.3 Edit Product

1. Go to **Products**.
2. Search and select the product.
3. Click **Edit**.
4. Update product details.
5. Click **Save Changes**.

### 14.4 Delete Product

1. Go to **Products**.
2. Select product.
3. Click **Delete**.
4. Confirm deletion.

**Note:** Products with stock movement history should usually be archived instead of deleted.

### 14.5 Archive Product

1. Go to **Products**.
2. Select product.
3. Click **Archive**.
4. Confirm action.
5. Product becomes inactive but history remains available.

---

## 15. Stock-In Workflow

Stock-in means adding inventory into the warehouse.

### 15.1 Create Stock-In Record

1. Go to **Stock Management**.
2. Select **Stock-In**.
3. Click **Add Stock-In**.
4. Select product.
5. Select warehouse.
6. Enter quantity received.
7. Select supplier, if required.
8. Enter purchase/reference number.
9. Enter received date.
10. Add remarks, if needed.
11. Click **Submit**.

### 15.2 System Response

After submission:

1. The system validates product and warehouse.
2. The system checks quantity.
3. The system adds quantity to available stock.
4. The system creates a stock movement record.
5. The system updates inventory reports.

### 15.3 Stock-In Example

| Field | Example |
|---|---|
| Product | Safety Gloves |
| SKU | SG-001 |
| Warehouse | Melbourne Warehouse |
| Quantity Received | 100 |
| Supplier | ABC Safety Supplies |
| Reference No. | PO-10021 |

---

## 16. Stock-Out Workflow

Stock-out means removing inventory from the warehouse.

### 16.1 Create Stock-Out Record

1. Go to **Stock Management**.
2. Select **Stock-Out**.
3. Click **Add Stock-Out**.
4. Select product.
5. Select warehouse.
6. Enter quantity to remove.
7. Select reason:
   - Sale
   - Internal use
   - Damaged item
   - Transfer
   - Adjustment
8. Enter reference number, if available.
9. Add remarks.
10. Click **Submit**.

### 16.2 System Response

After submission:

1. The system checks available stock.
2. If stock is sufficient, the system subtracts quantity.
3. The system records stock movement.
4. The system updates current stock.
5. If stock goes below minimum level, the system creates a low-stock alert.

### 16.3 Insufficient Stock Error

If requested quantity is more than available stock:

1. The system shows an error message.
2. The stock-out transaction is not completed.
3. User must reduce quantity or request stock transfer.

---

## 17. Stock Transfer Workflow

Stock transfer is used to move stock from one warehouse/site to another.

### 17.1 Create Transfer Request

1. Go to **Stock Transfer**.
2. Click **New Transfer Request**.
3. Select source warehouse.
4. Select destination warehouse.
5. Select product.
6. Enter quantity.
7. Enter reason for transfer.
8. Click **Submit Request**.

### 17.2 Approve Transfer Request

1. Manager or Admin opens **Transfer Requests**.
2. Select pending request.
3. Review:
   - Product
   - Quantity
   - Source warehouse
   - Destination warehouse
   - Reason
4. Click **Approve** or **Reject**.

### 17.3 Complete Transfer

1. After approval, source warehouse prepares stock.
2. Stock quantity is deducted from source warehouse.
3. Destination warehouse confirms received stock.
4. Quantity is added to destination warehouse.
5. System records complete transfer history.

---

## 18. Stock Adjustment Workflow

Stock adjustment is used when physical stock and system stock do not match.

### 18.1 Create Stock Adjustment

1. Go to **Stock Adjustment**.
2. Click **New Adjustment**.
3. Select product.
4. Select warehouse.
5. Enter current physical quantity.
6. Select adjustment reason:
   - Damaged item
   - Lost item
   - Counting error
   - System correction
   - Returned item
7. Add remarks.
8. Click **Submit**.

### 18.2 Approval Requirement

For important stock adjustments:

1. Employee or Site Manager submits adjustment.
2. Manager/Admin reviews the request.
3. Manager/Admin approves or rejects.
4. System updates stock only after approval.

---

## 19. Low Stock Alerts

### 19.1 View Low Stock Items

1. Go to **Dashboard**.
2. Click **Low Stock Alerts**.
3. View products below minimum stock level.
4. Open product details.
5. Create purchase request, stock-in, or transfer request.

### 19.2 Alert Meaning

| Alert | Meaning |
|---|---|
| Low Stock | Quantity is below minimum level |
| Out of Stock | Quantity is zero |
| Overstock | Quantity is above maximum level |
| Expiry Alert | Product is near expiry, if expiry tracking is enabled |

---

## 20. Inventory Search

### 20.1 Search Product

1. Go to **Inventory** or **Products**.
2. Use the search bar.
3. Enter product name, SKU, category, or supplier.
4. Press **Enter** or click **Search**.
5. View matching results.

### 20.2 Filter Inventory

Users can filter by:

- Warehouse
- Category
- Supplier
- Stock status
- Date added
- Minimum stock level
- Product status

---

# MANAGER GUIDE

## 21. Manager Dashboard

Manager can monitor inventory operations and approve important activities.

Manager can:

- View stock summary
- Approve stock transfers
- Approve stock adjustments
- View warehouse reports
- Monitor low-stock products
- Review employee activity
- Export reports

---

## 22. Approve Requests

### 22.1 View Pending Requests

1. Login as Manager.
2. Go to **Approvals**.
3. View pending requests:
   - Stock transfer
   - Stock adjustment
   - User request, if allowed
   - Purchase request, if included

### 22.2 Approve Request

1. Select a pending request.
2. Review details.
3. Click **Approve**.
4. Add remarks, if needed.
5. Submit approval.

### 22.3 Reject Request

1. Select request.
2. Click **Reject**.
3. Enter rejection reason.
4. Submit rejection.

---

## 23. View Reports

### 23.1 Open Reports

1. Go to **Reports**.
2. Select report type:
   - Inventory report
   - Stock movement report
   - Low-stock report
   - Warehouse report
   - Supplier report
   - User activity report
3. Select date range.
4. Apply filters.
5. Click **Generate Report**.

### 23.2 Export Reports

1. Generate required report.
2. Click **Export**.
3. Select format:
   - PDF
   - Excel
   - CSV
4. Download the report.

---

# SITE MANAGER GUIDE

## 24. Site Manager Dashboard

Site Manager handles one assigned warehouse or site.

Site Manager can:

- View site inventory
- Add stock-in records
- Add stock-out records
- Create transfer requests
- Submit stock adjustments
- View site-level reports
- Monitor low-stock alerts

---

## 25. Manage Site Inventory

### 25.1 View Assigned Warehouse Stock

1. Login as Site Manager.
2. Go to **Inventory**.
3. The system displays stock for assigned warehouse.
4. Search or filter products.
5. Open product details for more information.

### 25.2 Update Stock Records

1. Go to **Stock Management**.
2. Choose stock-in, stock-out, or adjustment.
3. Enter required data.
4. Submit record.
5. Wait for approval if required.

---

# EMPLOYEE GUIDE

## 26. Employee Dashboard

Employee has limited access based on assigned tasks.

Employee can usually:

- View assigned warehouse stock
- Search products
- Create stock-in records
- Create stock-out records
- Report damaged/lost stock
- View assigned tasks
- Update task status

---

## 27. Complete Assigned Task

### 27.1 View Tasks

1. Login as Employee.
2. Go to **My Tasks**.
3. View assigned tasks.
4. Open task details.

### 27.2 Update Task Status

1. Select task.
2. Click **Update Status**.
3. Choose status:
   - Pending
   - In Progress
   - Completed
4. Add remarks.
5. Click **Save**.

---

## 28. Report Stock Issue

### 28.1 Report Damaged or Missing Item

1. Go to **Inventory**.
2. Select product.
3. Click **Report Issue**.
4. Select issue type:
   - Damaged
   - Missing
   - Wrong quantity
   - Wrong location
5. Add description.
6. Upload image, if supported.
7. Click **Submit Report**.

---

# REPORTING GUIDE

## 29. Inventory Report

### 29.1 Generate Inventory Report

1. Go to **Reports**.
2. Select **Inventory Report**.
3. Select warehouse.
4. Select category, if needed.
5. Click **Generate**.
6. View product stock details.

### 29.2 Inventory Report Includes

- Product name
- SKU
- Category
- Warehouse
- Current quantity
- Minimum stock level
- Maximum stock level
- Stock status
- Last updated date

---

## 30. Stock Movement Report

### 30.1 Generate Stock Movement Report

1. Go to **Reports**.
2. Select **Stock Movement Report**.
3. Choose date range.
4. Select movement type:
   - Stock-in
   - Stock-out
   - Transfer
   - Adjustment
5. Click **Generate**.

### 30.2 Stock Movement Report Includes

- Movement ID
- Product
- Warehouse
- Quantity
- Movement type
- Created by
- Approved by
- Date and time
- Remarks

---

## 31. Low Stock Report

### 31.1 Generate Low Stock Report

1. Go to **Reports**.
2. Select **Low Stock Report**.
3. Select warehouse or all warehouses.
4. Click **Generate**.

### 31.2 Low Stock Report Includes

- Product name
- SKU
- Current quantity
- Minimum required quantity
- Shortage quantity
- Warehouse
- Suggested action

---

## 32. User Activity Report

### 32.1 Generate User Activity Report

1. Go to **Reports**.
2. Select **User Activity Report**.
3. Select user or role.
4. Select date range.
5. Click **Generate**.

### 32.2 User Activity Report Includes

- User name
- Role
- Action performed
- Date and time
- Module affected
- IP/device information, if available

---

# NOTIFICATION GUIDE

## 33. Notifications

### 33.1 View Notifications

1. Click the notification bell icon.
2. View recent notifications.
3. Click a notification to open details.

### 33.2 Notification Types

- Low-stock alert
- Out-of-stock alert
- Pending approval
- Transfer request update
- Stock adjustment result
- Account approval update
- Report generation complete

---

# DATA EXPORT GUIDE

## 34. Export Data

### 34.1 Export Inventory Data

1. Go to **Reports** or **Inventory**.
2. Apply filters.
3. Click **Export**.
4. Select format:
   - CSV
   - Excel
   - PDF
5. Click **Download**.

### 34.2 Export User Data

1. Login as Admin.
2. Go to **User Management**.
3. Click **Export Users**.
4. Select format.
5. Download file.

### 34.3 Export Stock Movement Data

1. Go to **Reports**.
2. Select **Stock Movement Report**.
3. Select date range.
4. Click **Export**.
5. Download file.

---

# BACKUP GUIDE

## 35. Data Backup

Only Admin can perform backup actions.

### 35.1 Create Backup

1. Login as Admin.
2. Go to **Settings**.
3. Select **Backup & Restore**.
4. Click **Create Backup**.
5. Wait for system confirmation.
6. Download backup file or save it to configured storage.

### 35.2 Restore Backup

1. Go to **Backup & Restore**.
2. Click **Restore Backup**.
3. Upload backup file.
4. Confirm restore action.
5. System restores saved data.

**Warning:** Restore action may replace current data.

---

# SYSTEM SETTINGS GUIDE

## 36. General Settings

Admin can manage system settings.

### 36.1 Update System Settings

1. Login as Admin.
2. Go to **Settings**.
3. Update available settings:
   - Company name
   - Warehouse rules
   - Default stock threshold
   - Notification preferences
   - Backup settings
4. Click **Save Settings**.

---

# LOGOUT GUIDE

## 37. Logout

### 37.1 Logout from System

1. Click your profile icon.
2. Click **Logout**.
3. The system ends your session.
4. You are redirected to the login page.

---

# COMMON ERRORS AND SOLUTIONS

## 38. Troubleshooting

| Problem | Possible Reason | Solution |
|---|---|---|
| Cannot login | Wrong email/password | Check login details or reset password |
| Account pending | Admin has not approved account | Contact Admin |
| Product not found | Wrong search keyword or product not added | Search by SKU or ask Admin/Site Manager |
| Cannot stock-out | Not enough stock available | Reduce quantity or request transfer |
| Report not loading | Large date range or network issue | Use smaller date range and try again |
| Access denied | User role does not have permission | Contact Admin |
| Export failed | File generation error | Try again or contact support |
| Low stock alert showing | Product quantity below minimum level | Add stock or request transfer |

---

# BEST PRACTICES

## 39. User Best Practices

- Always logout after using the system.
- Do not share your password.
- Check product SKU before updating stock.
- Verify warehouse location before stock-in or stock-out.
- Add clear remarks for adjustments and transfers.
- Report wrong stock quantity immediately.
- Use filters when generating large reports.
- Contact Admin if access is incorrect.

---

# QUICK WORKFLOW SUMMARY

## 40. Common User Workflows

### 40.1 New User Registration

```text
Open System → Register → Enter Details → Submit → Wait for Admin Approval → Login
```
### 40.2 Admin Creates User
```text
Admin Login → User Management → Add User → Assign Role → Assign Warehouse → Create User
```
### 40.3 Add Product
```text
Login → Products → Add Product → Enter Product Details → Save Product
```
### 40.4 Stock-In
```text
Login → Stock Management → Stock-In → Select Product → Enter Quantity → Submit
```
### 40.5 Stock-Out
```text
Login → Stock Management → Stock-Out → Select Product → Enter Quantity → Submit
```
### 40.6 Stock Transfer
```text
Login → Stock Transfer → New Request → Select Source/Destination → Submit → Approval → Complete Transfer
```
### 40.7 Generate Report
```text
Login → Reports → Select Report Type → Apply Filters → Generate → Export
```

## APPENDIX A: Glossary
Term	Meaning
Admin	User who controls system setup and user management
Manager	User who manages operations and approvals
Site Manager	User who manages one warehouse or site
Employee	Normal user who performs assigned warehouse tasks
SKU	Stock Keeping Unit, unique product code
Stock-In	Adding inventory into warehouse
Stock-Out	Removing inventory from warehouse
Stock Transfer	Moving stock from one warehouse to another
Stock Adjustment	Correcting inventory quantity
Low Stock	Stock quantity below minimum level
Warehouse	Physical storage location
Inventory	List of products and stock quantities
Audit Log	Record of user actions in the system
Export	Downloading data from the system
Backup	Saving system data for recovery
