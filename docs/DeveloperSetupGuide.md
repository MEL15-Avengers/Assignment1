
# Developer Setup Guide  
## Moonlight Warehouse Inventory Management System

**Version:** 1.0  
**Document Type:** Developer Setup Guide  
**Project Name:** Moonlight Warehouse Inventory Management System  
**Repository:** MEL15-Avengers / Assignment1  
**Frontend:** React / Vite  
**Backend:** Node.js / Express.js  
**Database:** PostgreSQL  
**Deployment:** Vercel / AWS  
**Prepared By:** MEL15-Avengers Team  

---

## Table of Contents

1. Introduction  
2. Purpose of this Guide  
3. System Overview  
4. Technology Stack  
5. Prerequisites  
6. Repository Setup  
7. Recommended Project Structure  
8. Environment Variables  
9. Frontend Setup  
10. Backend Setup  
11. PostgreSQL Database Setup  
12. Database Schema Overview  
13. Database Migration and Seeding  
14. Running the Full Project Locally  
15. API Testing Setup  
16. Common API Endpoints  
17. Authentication Setup  
18. Role-Based Access Setup  
19. File and Folder Naming Conventions  
20. Git Workflow  
21. Testing Guide  
22. Debugging Guide  
23. Build Guide  
24. Deployment Guide  
25. Backup and Restore Guide  
26. Troubleshooting  
27. Security Notes for Developers  
28. Maintenance Notes  
29. Quick Command Summary  
30. Appendix A: Example SQL Schema  
31. Appendix B: Example `.env` Files  
32. Appendix C: Glossary  

---

# 1. Introduction

This Developer Setup Guide explains how to install, configure, run, test, and maintain the Moonlight Warehouse Inventory Management System in a local development environment.

The system is a web-based warehouse inventory management application designed to manage products, users, roles, warehouses, stock-in, stock-out, stock transfers, stock adjustments, reports, notifications, and audit records.

This guide is intended for developers, testers, technical support members, and project evaluators who need to run or understand the project setup.

---

# 2. Purpose of this Guide

The purpose of this guide is to provide complete technical setup instructions for the Moonlight Warehouse Inventory Management System.

This guide covers:

- Required software installation
- Repository cloning
- Frontend setup
- Backend setup
- PostgreSQL database setup
- Environment variable configuration
- Running the system locally
- API testing
- Database migration and seeding
- Troubleshooting
- Deployment preparation
- Developer best practices

---

# 3. System Overview

The Moonlight Warehouse Inventory Management System has three main layers.

| Layer | Description |
|---|---|
| Frontend | The user interface used by Admin, Manager, Site Manager, and Employee |
| Backend API | Handles authentication, authorization, business logic, validation, and database communication |
| Database | Stores users, roles, warehouses, products, inventory records, stock movements, approvals, reports, and logs |

## 3.1 Main System Modules

The system includes the following modules:

| Module | Description |
|---|---|
| Authentication Module | Handles registration, login, logout, password reset, and session handling |
| User Management Module | Allows Admin to create, update, approve, disable, and manage users |
| Role and Permission Module | Controls access for Admin, Manager, Site Manager, and Employee |
| Warehouse Module | Manages warehouse/site details |
| Product Module | Manages product master data |
| Category Module | Manages product categories |
| Supplier Module | Manages supplier information |
| Inventory Module | Tracks available stock quantity |
| Stock-In Module | Records stock received into warehouse |
| Stock-Out Module | Records stock removed from warehouse |
| Stock Transfer Module | Handles stock movement between warehouses |
| Stock Adjustment Module | Corrects stock mismatch or damaged/lost item records |
| Reporting Module | Generates inventory, stock movement, low-stock, and user activity reports |
| Notification Module | Shows alerts for low stock, approval status, and system events |
| Audit Log Module | Tracks important user actions for accountability |
| Backup and Export Module | Supports data export and backup operations |

---

# 4. Technology Stack

| Component | Technology |
|---|---|
| Frontend Framework | React |
| Frontend Build Tool | Vite |
| Frontend Language | JavaScript / JSX |
| Styling | CSS / Tailwind CSS / Bootstrap, depending on implementation |
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Database | PostgreSQL |
| Authentication | JWT-based authentication |
| Password Hashing | bcrypt or bcryptjs |
| API Format | REST API |
| Package Manager | npm |
| Version Control | Git and GitHub |
| API Testing Tool | Postman / Thunder Client |
| Database GUI Tool | pgAdmin / DBeaver / TablePlus |
| Frontend Deployment | Vercel |
| Backend Deployment | AWS / Render / Railway / EC2 / Elastic Beanstalk, depending on final hosting |
| Database Hosting | AWS RDS PostgreSQL / Supabase / Neon / Railway PostgreSQL |

---

# 5. Prerequisites

Before running the project, install the required software.

## 5.1 Required Software

| Software | Purpose |
|---|---|
| Node.js | Runs JavaScript frontend and backend |
| npm | Installs project dependencies |
| Git | Clones and manages repository |
| PostgreSQL | Runs local database |
| VS Code | Recommended code editor |
| pgAdmin or DBeaver | Optional database management |
| Postman or Thunder Client | API testing |

## 5.2 Recommended Versions

```text
Node.js: 18.x or later
npm: 9.x or later
PostgreSQL: 14.x or later
Git: Latest stable version
VS Code: Latest stable version
````

## 5.3 Check Installed Versions

Run these commands in terminal:

```bash
node -v
npm -v
git --version
psql --version
```

Expected example output:

```text
v18.18.0
9.8.1
git version 2.x.x
psql 14.x
```

---

# 6. Repository Setup

## 6.1 Clone the Repository

Open terminal and run:

```bash
git clone https://github.com/MEL15-Avengers/Assignment1.git
```

Move into the project folder:

```bash
cd Assignment1
```

## 6.2 Check Current Branch

```bash
git branch
```

## 6.3 Pull Latest Code

```bash
git pull origin main
```

If the main branch is named `master`, use:

```bash
git pull origin master
```

## 6.4 Open Project in VS Code

```bash
code .
```

---

# 7. Recommended Project Structure

The recommended full-stack structure is:

```text
Assignment1/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── server.js
│   ├── migrations/
│   ├── seeders/
│   ├── package.json
│   └── .env
│
├── docs/
│   ├── SRS.docx
│   ├── USER_GUIDE.md
│   ├── ADMIN_GUIDE.md
│   ├── API_REFERENCE.md
│   ├── TEST_PLAN.md
│   ├── ERD.pdf
│   ├── DFD.pdf
│   ├── wireframes.pdf
│   └── deployment_diagram.png
│
├── README.md
├── .gitignore
└── package.json
```

## 7.1 If the Project Uses Root-Level React Files

If the project has:

```text
App.jsx
main.jsx
package.json
```

in the root folder instead of a separate `frontend/` folder, run frontend commands from the root folder.

Example:

```bash
npm install
npm run dev
```

---

# 8. Environment Variables

Environment variables store configuration values such as database credentials, API URLs, ports, and secret keys.

## 8.1 Important Rule

Never upload real `.env` files to GitHub.

Add `.env` to `.gitignore`:

```gitignore
.env
.env.local
.env.development
.env.production
node_modules
dist
build
```

## 8.2 Frontend Environment Variables

Frontend `.env` file location:

```text
frontend/.env
```

Example:

```env
VITE_APP_NAME=Moonlight Warehouse Inventory Management System
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

## 8.3 Backend Environment Variables

Backend `.env` file location:

```text
backend/.env
```

Example:

```env
NODE_ENV=development
PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=moonlight_warehouse
DATABASE_USER=postgres
DATABASE_PASSWORD=your_postgres_password

JWT_SECRET=replace_this_with_a_strong_secret_key
JWT_EXPIRES_IN=1d

CORS_ORIGIN=http://localhost:5173
```

---

# 9. Frontend Setup

## 9.1 Go to Frontend Folder

```bash
cd frontend
```

If frontend files are in the root folder, skip this step and stay in the root project folder.

## 9.2 Install Frontend Dependencies

```bash
npm install
```

## 9.3 Create Frontend `.env` File

For macOS/Linux:

```bash
touch .env
```

For Windows PowerShell:

```powershell
New-Item .env
```

Add this content:

```env
VITE_APP_NAME=Moonlight Warehouse Inventory Management System
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

## 9.4 Start Frontend Development Server

```bash
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## 9.5 Frontend Build Command

```bash
npm run build
```

## 9.6 Preview Production Build

```bash
npm run preview
```

---

# 10. Backend Setup

## 10.1 Go to Backend Folder

Open a new terminal window.

```bash
cd backend
```

If backend files are in the root folder, stay in the root project folder.

## 10.2 Install Backend Dependencies

```bash
npm install
```

## 10.3 Create Backend `.env` File

For macOS/Linux:

```bash
touch .env
```

For Windows PowerShell:

```powershell
New-Item .env
```

Add this content:

```env
NODE_ENV=development
PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=moonlight_warehouse
DATABASE_USER=postgres
DATABASE_PASSWORD=your_postgres_password

JWT_SECRET=replace_this_with_a_strong_secret_key
JWT_EXPIRES_IN=1d

CORS_ORIGIN=http://localhost:5173
```

## 10.4 Install Common Backend Packages

If backend dependencies are missing, install them:

```bash
npm install express cors dotenv pg jsonwebtoken bcryptjs
```

For development auto-restart:

```bash
npm install nodemon --save-dev
```

## 10.5 Backend `package.json` Scripts

Recommended scripts:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "migrate": "node src/database/migrate.js",
    "seed": "node src/database/seed.js"
  }
}
```

If your server file is not inside `src/`, update the path:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 10.6 Start Backend Server

```bash
npm run dev
```

If no `dev` script exists:

```bash
node src/server.js
```

or:

```bash
node server.js
```

The backend should run on:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

---

# 11. PostgreSQL Database Setup

## 11.1 Start PostgreSQL

### Windows

```text
Open Services → PostgreSQL → Start
```

### macOS using Homebrew

```bash
brew services start postgresql
```

### Linux

```bash
sudo service postgresql start
```

## 11.2 Login to PostgreSQL

```bash
psql -U postgres
```

Enter your PostgreSQL password.

## 11.3 Create Database

Inside PostgreSQL shell:

```sql
CREATE DATABASE moonlight_warehouse;
```

Exit PostgreSQL:

```sql
\q
```

## 11.4 Optional: Create Separate Database User

```sql
CREATE USER moonlight_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE moonlight_warehouse TO moonlight_user;
```

Then update backend `.env`:

```env
DATABASE_USER=moonlight_user
DATABASE_PASSWORD=strong_password_here
```

## 11.5 Connect to Database

```bash
psql -U postgres -d moonlight_warehouse
```

## 11.6 Check Existing Tables

Inside `psql`:

```sql
\dt
```

---

# 12. Database Schema Overview

The database should include the following main tables.

| Table Name        | Purpose                                                      |
| ----------------- | ------------------------------------------------------------ |
| users             | Stores user account details                                  |
| roles             | Stores system roles                                          |
| permissions       | Stores system permission names                               |
| role_permissions  | Maps roles to permissions                                    |
| warehouses        | Stores warehouse/site details                                |
| categories        | Stores product categories                                    |
| suppliers         | Stores supplier details                                      |
| products          | Stores product master data                                   |
| inventory         | Stores stock quantity per product and warehouse              |
| stock_movements   | Stores stock-in, stock-out, transfer, and adjustment records |
| transfer_requests | Stores stock transfer requests                               |
| approvals         | Stores approval records                                      |
| notifications     | Stores system notifications                                  |
| audit_logs        | Stores user actions                                          |
| reports           | Stores generated report metadata, if required                |

---

# 13. Database Migration and Seeding

## 13.1 Migration Meaning

Migration means creating or updating database tables using code or SQL scripts.

## 13.2 Seed Meaning

Seeding means inserting initial data into the database.

Example seed data:

* Default roles
* Default admin user
* Sample warehouse
* Sample categories
* Sample products

## 13.3 Run Migration

If the project has a migration script:

```bash
npm run migrate
```

Alternative commands depending on framework:

```bash
npx sequelize db:migrate
```

```bash
npx prisma migrate dev
```

## 13.4 Run Seeder

```bash
npm run seed
```

Alternative:

```bash
npx sequelize db:seed:all
```

## 13.5 Recommended Default Roles

```text
Admin
Manager
Site Manager
Employee
```

## 13.6 Recommended Default Admin

```text
Email: admin@moonlight.com
Password: Admin@12345
Role: Admin
Status: Active
```

Important:

```text
Change the default admin password after first login.
```

---

# 14. Running the Full Project Locally

## 14.1 Run Backend

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Expected backend URL:

```text
http://localhost:5000
```

## 14.2 Run Frontend

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Expected frontend URL:

```text
http://localhost:5173
```

## 14.3 Open Application

Open browser:

```text
http://localhost:5173
```

## 14.4 Root-Level Run Option

If the project has a root `package.json` that runs both frontend and backend:

```bash
npm install
npm run dev
```

Example root script:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
  }
}
```

Install `concurrently` if needed:

```bash
npm install concurrently --save-dev
```

---

# 15. API Testing Setup

Use Postman or Thunder Client to test backend APIs.

## 15.1 Base API URL

```text
http://localhost:5000/api
```

## 15.2 Health Check API

```http
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Moonlight API is running"
}
```

## 15.3 Login API Example

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "admin@moonlight.com",
  "password": "Admin@12345"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "fullName": "System Admin",
    "email": "admin@moonlight.com",
    "role": "Admin"
  }
}
```

## 15.4 Use JWT Token in Postman

After login, copy the token.

Add it to request headers:

```http
Authorization: Bearer jwt_token_here
```

---

# 16. Common API Endpoints

## 16.1 Authentication APIs

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| POST   | `/api/auth/register`        | Register a new user        |
| POST   | `/api/auth/login`           | Login user                 |
| POST   | `/api/auth/logout`          | Logout user                |
| POST   | `/api/auth/forgot-password` | Request password reset     |
| POST   | `/api/auth/reset-password`  | Reset password             |
| GET    | `/api/auth/profile`         | Get logged-in user profile |

## 16.2 User APIs

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| GET    | `/api/users`            | Get all users               |
| GET    | `/api/users/:id`        | Get user by ID              |
| POST   | `/api/users`            | Create user                 |
| PUT    | `/api/users/:id`        | Update user                 |
| PATCH  | `/api/users/:id/status` | Activate or deactivate user |
| DELETE | `/api/users/:id`        | Delete user                 |

## 16.3 Role APIs

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/api/roles`                 | Get all roles           |
| POST   | `/api/roles`                 | Create role             |
| PUT    | `/api/roles/:id`             | Update role             |
| DELETE | `/api/roles/:id`             | Delete role             |
| PUT    | `/api/roles/:id/permissions` | Update role permissions |

## 16.4 Warehouse APIs

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/warehouses`     | Get all warehouses  |
| GET    | `/api/warehouses/:id` | Get warehouse by ID |
| POST   | `/api/warehouses`     | Create warehouse    |
| PUT    | `/api/warehouses/:id` | Update warehouse    |
| DELETE | `/api/warehouses/:id` | Delete warehouse    |

## 16.5 Product APIs

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/api/products`     | Get all products          |
| GET    | `/api/products/:id` | Get product by ID         |
| POST   | `/api/products`     | Create product            |
| PUT    | `/api/products/:id` | Update product            |
| DELETE | `/api/products/:id` | Delete or archive product |

## 16.6 Inventory APIs

| Method | Endpoint                                | Description                |
| ------ | --------------------------------------- | -------------------------- |
| GET    | `/api/inventory`                        | Get inventory list         |
| GET    | `/api/inventory/:productId`             | Get product inventory      |
| GET    | `/api/inventory/warehouse/:warehouseId` | Get inventory by warehouse |
| GET    | `/api/inventory/low-stock`              | Get low-stock products     |

## 16.7 Stock Movement APIs

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| POST   | `/api/stock/in`         | Create stock-in record     |
| POST   | `/api/stock/out`        | Create stock-out record    |
| POST   | `/api/stock/adjustment` | Create stock adjustment    |
| GET    | `/api/stock/movements`  | Get stock movement history |

## 16.8 Transfer APIs

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| GET    | `/api/transfers`              | Get transfer requests   |
| POST   | `/api/transfers`              | Create transfer request |
| PATCH  | `/api/transfers/:id/approve`  | Approve transfer        |
| PATCH  | `/api/transfers/:id/reject`   | Reject transfer         |
| PATCH  | `/api/transfers/:id/complete` | Complete transfer       |

## 16.9 Report APIs

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| GET    | `/api/reports/inventory`       | Generate inventory report      |
| GET    | `/api/reports/stock-movements` | Generate stock movement report |
| GET    | `/api/reports/low-stock`       | Generate low-stock report      |
| GET    | `/api/reports/user-activity`   | Generate user activity report  |
| GET    | `/api/reports/export`          | Export report                  |

---

# 17. Authentication Setup

## 17.1 Authentication Flow

```text
User enters email and password
        ↓
Backend validates credentials
        ↓
Backend checks account status
        ↓
Backend creates JWT token
        ↓
Frontend stores token
        ↓
User accesses protected routes
```

## 17.2 JWT Token Storage

Recommended frontend storage options:

| Option           | Description                                 |
| ---------------- | ------------------------------------------- |
| HTTP-only Cookie | More secure option                          |
| Local Storage    | Easier for student projects but less secure |
| Session Storage  | Clears when browser session ends            |

For this project, local storage may be used during development.

Example:

```js
localStorage.setItem("token", token);
```

## 17.3 Protected API Request Example

```js
const token = localStorage.getItem("token");

fetch("http://localhost:5000/api/products", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
```

## 17.4 Logout

```js
localStorage.removeItem("token");
localStorage.removeItem("user");
```

---

# 18. Role-Based Access Setup

The system should restrict access based on user role.

## 18.1 Roles

| Role         | Access Level                             |
| ------------ | ---------------------------------------- |
| Admin        | Full system access                       |
| Manager      | Reports, approvals, warehouse operations |
| Site Manager | Assigned warehouse operations            |
| Employee     | Limited stock and task operations        |

## 18.2 Example Permission Matrix

| Feature                 | Admin | Manager | Site Manager | Employee |
| ----------------------- | ----- | ------- | ------------ | -------- |
| Manage Users            | Yes   | No      | No           | No       |
| Manage Roles            | Yes   | No      | No           | No       |
| Manage Warehouses       | Yes   | Limited | No           | No       |
| Add Product             | Yes   | Yes     | Limited      | No       |
| Edit Product            | Yes   | Yes     | Limited      | No       |
| View Inventory          | Yes   | Yes     | Yes          | Yes      |
| Stock-In                | Yes   | Yes     | Yes          | Yes      |
| Stock-Out               | Yes   | Yes     | Yes          | Yes      |
| Approve Transfer        | Yes   | Yes     | No           | No       |
| Create Transfer Request | Yes   | Yes     | Yes          | No       |
| View Reports            | Yes   | Yes     | Limited      | No       |
| Export Data             | Yes   | Yes     | Limited      | No       |
| View Audit Logs         | Yes   | Limited | No           | No       |

## 18.3 Frontend Route Protection Example

```jsx
function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
```

Example usage:

```jsx
<ProtectedRoute allowedRoles={["Admin"]}>
  <UserManagement />
</ProtectedRoute>
```

---

# 19. File and Folder Naming Conventions

## 19.1 Frontend Naming

| Item       | Convention                | Example             |
| ---------- | ------------------------- | ------------------- |
| Components | PascalCase                | `ProductCard.jsx`   |
| Pages      | PascalCase                | `InventoryPage.jsx` |
| Hooks      | camelCase with use prefix | `useAuth.js`        |
| Utilities  | camelCase                 | `formatDate.js`     |
| Services   | camelCase                 | `productService.js` |

## 19.2 Backend Naming

| Item        | Convention              | Example                |
| ----------- | ----------------------- | ---------------------- |
| Routes      | camelCase               | `productRoutes.js`     |
| Controllers | camelCase               | `productController.js` |
| Models      | PascalCase or camelCase | `Product.js`           |
| Middleware  | camelCase               | `authMiddleware.js`    |
| Services    | camelCase               | `inventoryService.js`  |
| Validators  | camelCase               | `productValidator.js`  |

---

# 20. Git Workflow

## 20.1 Pull Latest Code Before Work

```bash
git pull origin main
```

## 20.2 Create New Branch

```bash
git checkout -b feature/product-management
```

## 20.3 Check File Changes

```bash
git status
```

## 20.4 Add Files

```bash
git add .
```

## 20.5 Commit Changes

```bash
git commit -m "Add product management module"
```

## 20.6 Push Branch

```bash
git push origin feature/product-management
```

## 20.7 Create Pull Request

After pushing the branch:

```text
GitHub → Repository → Pull Requests → New Pull Request
```

## 20.8 Recommended Branch Names

```text
feature/authentication
feature/user-management
feature/inventory-module
feature/reporting-module
bugfix/login-error
bugfix/stock-calculation
docs/srs-update
docs/api-reference
```

## 20.9 Recommended Commit Message Format

```text
Add login page UI
Create product API routes
Fix stock-out quantity validation
Update developer setup guide
Add low-stock report
```

---

# 21. Testing Guide

## 21.1 Testing Types

| Testing Type            | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| Unit Testing            | Tests individual functions or components |
| Integration Testing     | Tests communication between modules      |
| API Testing             | Tests backend endpoints                  |
| UI Testing              | Tests frontend screens and forms         |
| Database Testing        | Tests data storage and retrieval         |
| Security Testing        | Tests authentication and authorization   |
| User Acceptance Testing | Confirms system meets user needs         |

## 21.2 Manual Test Example

| Test Case ID | Feature              | Steps                                        | Expected Result                         |
| ------------ | -------------------- | -------------------------------------------- | --------------------------------------- |
| TC-001       | Login                | Enter valid email and password               | User logs in successfully               |
| TC-002       | Register             | Enter valid user details                     | Account is created or sent for approval |
| TC-003       | Add Product          | Submit valid product form                    | Product is saved                        |
| TC-004       | Stock-In             | Add quantity to product                      | Inventory quantity increases            |
| TC-005       | Stock-Out            | Remove valid quantity                        | Inventory quantity decreases            |
| TC-006       | Stock-Out Validation | Remove quantity greater than available stock | System shows insufficient stock error   |
| TC-007       | Low Stock Alert      | Reduce stock below minimum level             | Low-stock alert is created              |
| TC-008       | Report Export        | Export inventory report                      | File downloads successfully             |

## 21.3 Run Frontend Tests

If tests are configured:

```bash
npm test
```

or:

```bash
npm run test
```

## 21.4 Run Backend Tests

```bash
npm test
```

or:

```bash
npm run test
```

---

# 22. Debugging Guide

## 22.1 Frontend Debugging

Common frontend checks:

```text
Browser Console
Network Tab
React Developer Tools
Vite terminal output
```

Check API request errors:

```text
Open browser developer tools → Network → Select failed request → Check status code and response
```

## 22.2 Backend Debugging

Check backend terminal logs.

Common debug code:

```js
console.log("Request body:", req.body);
console.log("Logged in user:", req.user);
```

## 22.3 Database Debugging

Check database connection:

```bash
psql -U postgres -d moonlight_warehouse
```

List tables:

```sql
\dt
```

Check users:

```sql
SELECT id, full_name, email, status FROM users;
```

Check products:

```sql
SELECT id, sku, name FROM products;
```

Check inventory:

```sql
SELECT * FROM inventory;
```

---

# 23. Build Guide

## 23.1 Build Frontend

```bash
cd frontend
npm run build
```

Build output folder:

```text
frontend/dist
```

## 23.2 Preview Frontend Build

```bash
npm run preview
```

## 23.3 Start Backend in Production Mode

```bash
cd backend
npm start
```

## 23.4 Production Environment Variables

Production `.env` should use real deployed URLs:

```env
NODE_ENV=production
PORT=5000
DATABASE_HOST=production_database_host
DATABASE_PORT=5432
DATABASE_NAME=moonlight_warehouse
DATABASE_USER=production_user
DATABASE_PASSWORD=production_password
JWT_SECRET=very_strong_secret_key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

Frontend production `.env`:

```env
VITE_APP_NAME=Moonlight Warehouse Inventory Management System
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_ENVIRONMENT=production
```

---

# 24. Deployment Guide

## 24.1 Frontend Deployment on Vercel

Steps:

1. Push frontend code to GitHub.
2. Login to Vercel.
3. Click **Add New Project**.
4. Import GitHub repository.
5. Select frontend folder if project is inside `/frontend`.
6. Set build command:

```bash
npm run build
```

7. Set output directory:

```text
dist
```

8. Add environment variable:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

9. Click **Deploy**.

## 24.2 Backend Deployment Options

Backend can be deployed using:

| Platform               | Notes                                           |
| ---------------------- | ----------------------------------------------- |
| AWS EC2                | Full server control                             |
| AWS Elastic Beanstalk  | Easier Node.js deployment                       |
| Render                 | Simple backend hosting                          |
| Railway                | Simple backend and database hosting             |
| Vercel Serverless      | Possible but not ideal for full Express backend |
| Heroku-style platforms | Easy deployment if supported                    |

## 24.3 AWS EC2 Backend Deployment Summary

1. Create EC2 instance.
2. Install Node.js and Git.
3. Clone repository.
4. Install backend dependencies.
5. Create production `.env`.
6. Start backend using PM2.
7. Configure Nginx reverse proxy.
8. Add SSL certificate.
9. Connect backend to PostgreSQL database.

## 24.4 Install PM2

```bash
npm install pm2 -g
```

## 24.5 Start Backend with PM2

```bash
pm2 start src/server.js --name moonlight-backend
```

If server file is root-level:

```bash
pm2 start server.js --name moonlight-backend
```

## 24.6 Save PM2 Process

```bash
pm2 save
pm2 startup
```

## 24.7 AWS RDS PostgreSQL

For production database:

1. Create PostgreSQL RDS instance.
2. Configure security group.
3. Allow backend server IP.
4. Copy database host endpoint.
5. Update backend `.env`.

Example:

```env
DATABASE_HOST=moonlight-db.xxxxxx.ap-southeast-2.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=moonlight_warehouse
DATABASE_USER=postgres
DATABASE_PASSWORD=production_password
```

---

# 25. Backup and Restore Guide

## 25.1 Create PostgreSQL Backup

```bash
pg_dump -U postgres -d moonlight_warehouse > moonlight_backup.sql
```

## 25.2 Restore PostgreSQL Backup

```bash
psql -U postgres -d moonlight_warehouse < moonlight_backup.sql
```

## 25.3 Backup Specific Table

```bash
pg_dump -U postgres -d moonlight_warehouse -t products > products_backup.sql
```

## 25.4 Export Data as CSV

```sql
COPY products TO '/tmp/products.csv' DELIMITER ',' CSV HEADER;
```

---

# 26. Troubleshooting

## 26.1 `npm install` Fails

Possible causes:

* Wrong Node.js version
* Corrupted `node_modules`
* Package lock conflict

Fix:

```bash
rm -rf node_modules package-lock.json
npm install
```

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## 26.2 Port Already in Use

Error:

```text
EADDRINUSE: address already in use
```

Fix by changing port in `.env`:

```env
PORT=5001
```

Or kill process.

macOS/Linux:

```bash
lsof -i :5000
kill -9 <PID>
```

Windows:

```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 26.3 Database Connection Error

Check:

* PostgreSQL is running
* Database exists
* Username is correct
* Password is correct
* Port is correct
* `.env` is loaded correctly

Test connection:

```bash
psql -U postgres -d moonlight_warehouse
```

## 26.4 CORS Error

Error:

```text
Access to fetch at backend URL has been blocked by CORS policy
```

Fix backend CORS setting:

```env
CORS_ORIGIN=http://localhost:5173
```

Express example:

```js
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

## 26.5 Vite Environment Variable Not Working

Make sure variable starts with `VITE_`.

Correct:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Wrong:

```env
API_BASE_URL=http://localhost:5000/api
```

Restart frontend server after changing `.env`.

## 26.6 JWT Invalid Token Error

Possible causes:

* Token expired
* Wrong JWT secret
* Token missing from request header
* User is logged out

Correct header:

```http
Authorization: Bearer jwt_token_here
```

## 26.7 React Blank Page

Check:

* Browser console errors
* Wrong route path
* Missing component import
* API URL error
* Build error in terminal

## 26.8 API Returns 404

Check:

* Backend server is running
* Correct endpoint path
* Correct HTTP method
* Route is registered in Express app

Example route registration:

```js
app.use("/api/products", productRoutes);
```

## 26.9 Login Works in Backend but Not Frontend

Check:

* Frontend API base URL
* CORS setting
* Token storage
* Login form field names
* Backend response structure

---

# 27. Security Notes for Developers

## 27.1 Password Security

* Never store plain-text passwords.
* Use bcrypt or bcryptjs for hashing.
* Use strong password rules.
* Do not log passwords in console.

Example:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

## 27.2 JWT Security

* Use strong `JWT_SECRET`.
* Do not commit secret keys.
* Set token expiry.
* Validate token on protected routes.

## 27.3 Database Security

* Use parameterized queries.
* Do not directly concatenate user input into SQL.
* Validate all input fields.
* Restrict production database access.

Safe query example:

```js
const result = await pool.query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);
```

Unsafe query example:

```js
const result = await pool.query(
  "SELECT * FROM users WHERE email = '" + email + "'"
);
```

## 27.4 Environment Security

Never commit:

```text
.env
database passwords
JWT secret
API keys
production credentials
backup files
```

## 27.5 Access Control

Every protected backend route should check:

1. Is the user logged in?
2. Is the token valid?
3. Does the user role have permission?

---

# 28. Maintenance Notes

## 28.1 Add a New Frontend Page

1. Create page file in:

```text
frontend/src/pages/
```

Example:

```text
ReportsPage.jsx
```

2. Add route in route file or `App.jsx`.

3. Add navigation menu item.

4. Connect page to API service if required.

## 28.2 Add a New Backend API Module

1. Create route file:

```text
backend/src/routes/reportRoutes.js
```

2. Create controller:

```text
backend/src/controllers/reportController.js
```

3. Register route in server:

```js
app.use("/api/reports", reportRoutes);
```

4. Test API in Postman.

## 28.3 Add a New Database Table

1. Create migration or SQL script.
2. Run migration.
3. Add model/query file.
4. Add controller logic.
5. Add API route.
6. Test with sample data.

---

# 29. Quick Command Summary

## 29.1 Clone Repository

```bash
git clone https://github.com/MEL15-Avengers/Assignment1.git
cd Assignment1
```

## 29.2 Frontend

```bash
cd frontend
npm install
npm run dev
```

## 29.3 Backend

```bash
cd backend
npm install
npm run dev
```

## 29.4 Database

```bash
psql -U postgres
CREATE DATABASE moonlight_warehouse;
\q
```

## 29.5 Run Migration

```bash
npm run migrate
```

## 29.6 Run Seeder

```bash
npm run seed
```

## 29.7 Build Frontend

```bash
npm run build
```

## 29.8 Start Backend Production

```bash
npm start
```

---

# 30. Appendix A: Example SQL Schema

Use this SQL only if the project does not already have migration files.

```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    address TEXT,
    contact_person VARCHAR(100),
    phone VARCHAR(30),
    capacity INTEGER,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    warehouse_id INTEGER REFERENCES warehouses(id),
    status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(30),
    address TEXT,
    product_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(80) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    supplier_id INTEGER REFERENCES suppliers(id),
    unit VARCHAR(30),
    unit_price NUMERIC(12,2) DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id)
);

CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    warehouse_id INTEGER REFERENCES warehouses(id),
    movement_type VARCHAR(30) NOT NULL,
    quantity INTEGER NOT NULL,
    reference_no VARCHAR(100),
    reason TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transfer_requests (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    source_warehouse_id INTEGER REFERENCES warehouses(id),
    destination_warehouse_id INTEGER REFERENCES warehouses(id),
    quantity INTEGER NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    requested_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE approvals (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(50) NOT NULL,
    request_id INTEGER NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(150) NOT NULL,
    module VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 31. Appendix B: Example `.env` Files

## 31.1 Frontend `.env`

```env
VITE_APP_NAME=Moonlight Warehouse Inventory Management System
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

## 31.2 Backend `.env`

```env
NODE_ENV=development
PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=moonlight_warehouse
DATABASE_USER=postgres
DATABASE_PASSWORD=your_postgres_password

JWT_SECRET=replace_this_with_a_strong_secret_key
JWT_EXPIRES_IN=1d

CORS_ORIGIN=http://localhost:5173
```

## 31.3 Production Frontend `.env`

```env
VITE_APP_NAME=Moonlight Warehouse Inventory Management System
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_ENVIRONMENT=production
```

## 31.4 Production Backend `.env`

```env
NODE_ENV=production
PORT=5000

DATABASE_HOST=production_database_host
DATABASE_PORT=5432
DATABASE_NAME=moonlight_warehouse
DATABASE_USER=production_database_user
DATABASE_PASSWORD=production_database_password

JWT_SECRET=very_strong_production_secret
JWT_EXPIRES_IN=1d

CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

---

# 32. Appendix C: Glossary

| Term                 | Meaning                                         |
| -------------------- | ----------------------------------------------- |
| API                  | Application Programming Interface               |
| Backend              | Server-side part of the system                  |
| Frontend             | User interface part of the system               |
| Database             | Structured storage for application data         |
| PostgreSQL           | Relational database management system           |
| React                | JavaScript library for building user interfaces |
| Vite                 | Frontend build tool used with React             |
| Node.js              | Runtime environment for JavaScript backend      |
| Express.js           | Node.js framework for creating APIs             |
| JWT                  | JSON Web Token used for authentication          |
| CORS                 | Cross-Origin Resource Sharing                   |
| CRUD                 | Create, Read, Update, Delete                    |
| SKU                  | Stock Keeping Unit                              |
| Stock-In             | Adding stock into warehouse                     |
| Stock-Out            | Removing stock from warehouse                   |
| Stock Transfer       | Moving stock from one warehouse to another      |
| Migration            | Database table creation or update process       |
| Seeder               | Script that inserts initial data                |
| Environment Variable | Configuration value stored outside source code  |
| Repository           | Project code storage location                   |
| Branch               | Separate line of development in Git             |
| Pull Request         | Request to merge code changes                   |
| Deployment           | Publishing application to production            |
| PM2                  | Node.js process manager                         |
| AWS                  | Amazon Web Services                             |
| Vercel               | Frontend deployment platform                    |

```
