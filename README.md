# 💰 Finance Dashboard Backend
### Finance Data Processing and Access Control Backend

A production-inspired, role-based finance dashboard backend API built with
Node.js, Express, PostgreSQL, and Prisma. Designed with clean architecture,
clear separation of concerns, and real-world backend engineering practices.

---

## 🚀 Live Demo

| | URL |
|---|---|
| **Live API** | https://finance-data-processing-and-access-0nv5.onrender.com |
| **Swagger Docs** | https://finance-data-processing-and-access-0nv5.onrender.com/api-docs |
| **Health Check** | https://finance-data-processing-and-access-0nv5.onrender.com/health |

> **Note:** Hosted on Render free tier — first request may take 30-50 seconds to wake up. All subsequent requests will be instant.

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Test Credentials](#test-credentials)
- [API Endpoints](#api-endpoints)
- [Role Permissions](#role-permissions)
- [Record Filtering & Pagination](#record-filtering--pagination)
- [Access Control Design](#access-control-design)
- [Validation & Error Handling](#validation--error-handling)
- [Database Design](#database-design)
- [Assumptions Made](#assumptions-made)
- [Design Decisions & Tradeoffs](#design-decisions--tradeoffs)
- [Features Implemented](#features-implemented)
- [Future Improvements](#future-improvements)

---

## Overview

This project is the backend for a **Finance Dashboard System** where different
users interact with financial records based on their assigned role.

The system supports:
- Secure JWT based authentication
- Three distinct roles — VIEWER, ANALYST, ADMIN — with clearly enforced permissions
- Full financial records management with filtering and pagination
- Dashboard summary APIs returning aggregated analytics
- Clean, consistent API responses across all endpoints
- Soft delete for financial data integrity
- Swagger UI for interactive API documentation

---

## Tech Stack

| Layer | Technology | Reason for Choice |
|---|---|---|
| Runtime | Node.js | Industry standard, fast async I/O for APIs |
| Framework | Express.js | Minimal and explicit — shows clear understanding of middleware and routing |
| Database | PostgreSQL | Relational DB is the right fit for structured financial data |
| ORM | Prisma 5 | Clean declarative schema, type-safe queries, readable migrations |
| Authentication | JWT (jsonwebtoken) | Stateless, industry standard token based auth |
| Password Hashing | bcryptjs | Secure one-way hashing for user passwords |
| Validation | Zod | Schema based validation with precise field level error messages |
| API Docs | Swagger UI | Interactive documentation — evaluators can test without any setup |
| Security | Helmet + CORS | Basic but important security headers out of the box |
| Dev Tools | Nodemon | Auto restart on file changes during development |

---

## Project Structure
```
finance-backend/
│
├── prisma/
│   ├── schema.prisma          # All database models and enums
│   └── seed.js                # Sample data for testing
│
├── src/
│   ├── config/
│   │   └── db.js              # Single Prisma client instance
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT token verification
│   │   └── role.middleware.js  # Role based access control
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validator.js
│   │   │
│   │   ├── users/
│   │   │   ├── users.routes.js
│   │   │   ├── users.controller.js
│   │   │   └── users.service.js
│   │   │
│   │   ├── records/
│   │   │   ├── records.routes.js
│   │   │   ├── records.controller.js
│   │   │   ├── records.service.js
│   │   │   └── records.validator.js
│   │   │
│   │   └── dashboard/
│   │       ├── dashboard.routes.js
│   │       ├── dashboard.controller.js
│   │       └── dashboard.service.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js     # Consistent response shape for all endpoints
│   │   └── errorHandler.js    # Global error handler with Prisma error mapping
│   │
│   ├── swagger/
│   │   └── swagger.js         # Swagger config
│   │
│   └── app.js                 # Express app — middleware, routes, error handler
│
├── .env.example               # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

### Why this structure?

Each module is completely self-contained with its own routes, controller,
and service. This separation means:
- **Routes** only define endpoints and attach middleware
- **Controllers** only handle HTTP request/response
- **Services** only contain business logic and database queries

This makes the codebase easy to navigate, test, and extend.

---

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- PostgreSQL installed and running
- npm

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/finance-backend.git
cd finance-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/finance_db"
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
```

### 4. Create the database
```bash
psql -U postgres -c "CREATE DATABASE finance_db;"
```

### 5. Run database migrations
```bash
npm run db:migrate
```
When prompted for migration name, type: `init`

### 6. Seed sample data
```bash
npm run db:seed
```

This creates 3 users (one per role) and 30 sample financial records.

### 7. Start the development server
```bash
npm run dev
```

| URL | Description |
|---|---|
| `http://localhost:3000/health` | Health check |
| `http://localhost:3000/api-docs` | Swagger UI — test all APIs here |

---

## Test Credentials

These are created automatically by the seed script.

| Role | Email | Password |
|---|---|---|
| ADMIN | admin@finance.com | password123 |
| ANALYST | analyst@finance.com | password123 |
| VIEWER | viewer@finance.com | password123 |

---

## API Endpoints

### Authentication — Public Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

#### Register Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "VIEWER"
}
```

#### Login Request Body
```json
{
  "email": "admin@finance.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@finance.com",
      "role": "ADMIN"
    }
  }
}
```

> All protected routes require header: `Authorization: Bearer <token>`

---

### User Management — ADMIN Only
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get single user by ID |
| PATCH | `/api/users/:id/role` | Update user role |
| PATCH | `/api/users/:id/status` | Activate or deactivate user |
| DELETE | `/api/users/:id` | Delete user |

#### Update Role Request Body
```json
{
  "role": "ANALYST"
}
```

#### Update Status Request Body
```json
{
  "status": "INACTIVE"
}
```

---

### Financial Records
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/records` | ALL ROLES | Get all records with filters |
| GET | `/api/records/:id` | ALL ROLES | Get single record |
| POST | `/api/records` | ADMIN only | Create new record |
| PUT | `/api/records/:id` | ADMIN only | Update record |
| DELETE | `/api/records/:id` | ADMIN only | Soft delete record |

#### Create Record Request Body
```json
{
  "amount": 5000.00,
  "type": "INCOME",
  "category": "Salary",
  "date": "2024-01-15T00:00:00.000Z",
  "notes": "January salary"
}
```

---

### Dashboard Analytics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | ALL ROLES | Total income, expense, net balance |
| GET | `/api/dashboard/recent` | ALL ROLES | Recent transactions |
| GET | `/api/dashboard/breakdown` | ANALYST, ADMIN | Category wise totals |
| GET | `/api/dashboard/trends` | ANALYST, ADMIN | Monthly trends for last 24 months |

#### Summary Response
```json
{
  "success": true,
  "message": "Dashboard summary fetched",
  "data": {
    "totalIncome": 45000.00,
    "totalExpense": 18500.00,
    "netBalance": 26500.00,
    "totalRecords": 30,
    "incomeCount": 10,
    "expenseCount": 20
  }
}
```

---

## Role Permissions

The three roles are designed to be meaningfully distinct — not just names.

| Action | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| Login and authenticate | ✅ | ✅ | ✅ |
| View financial records | ✅ | ✅ | ✅ |
| View basic dashboard summary | ✅ | ✅ | ✅ |
| View recent activity | ✅ | ✅ | ✅ |
| View monthly trends | ❌ | ✅ | ✅ |
| View category breakdown | ❌ | ✅ | ✅ |
| Create financial records | ❌ | ❌ | ✅ |
| Update financial records | ❌ | ❌ | ✅ |
| Delete financial records | ❌ | ❌ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Update user roles | ❌ | ❌ | ✅ |
| Activate / deactivate users | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |

### Role Design Rationale

- **VIEWER** — Read only access to basic data. Suitable for stakeholders who
  only need to monitor the dashboard.
- **ANALYST** — Everything a VIEWER can do plus access to advanced analytics
  like trends and category breakdowns. Cannot modify any data.
- **ADMIN** — Full access. Can manage both financial records and users.

---

## Record Filtering & Pagination

The `GET /api/records` endpoint supports multiple query parameters:
```
# Filter by type
GET /api/records?type=INCOME
GET /api/records?type=EXPENSE

# Filter by category (case insensitive, partial match)
GET /api/records?category=salary

# Filter by date range
GET /api/records?from=2024-01-01&to=2024-12-31

# Pagination
GET /api/records?page=1&limit=10

# Combined filters
GET /api/records?type=INCOME&category=salary&from=2024-01-01&page=1&limit=5
```

#### Paginated Response Shape
```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": {
    "records": [...],
    "pagination": {
      "total": 30,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

---

## Access Control Design

Access control is implemented as **reusable Express middleware** — clean,
composable, and applied at the route level.

### How it works
```
Request → authenticate middleware → authorize middleware → controller
```

**Step 1 — authenticate** verifies the JWT token and attaches the decoded
user (userId, role, email) to `req.user`.

**Step 2 — authorize(...roles)** checks if `req.user.role` is in the allowed
roles list. If not, returns 403 immediately.

### Code example from routes
```javascript
// ALL roles can view records
router.get('/', authenticate, authorize('ADMIN','ANALYST','VIEWER'), getRecords);

// Only ADMIN can create records
router.post('/', authenticate, authorize('ADMIN'), createRecord);

// Only ANALYST and ADMIN can see trends
router.get('/trends', authenticate, authorize('ADMIN','ANALYST'), getMonthlyTrends);
```

### 403 Response when unauthorized
```json
{
  "success": false,
  "message": "Access denied. This action requires: ADMIN or ANALYST role.",
  "data": null
}
```

---

## Validation & Error Handling

### Input Validation with Zod

All incoming request bodies are validated using Zod schemas before reaching
any business logic. This means invalid data never reaches the database layer.

#### Example — validation error response
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "amount": ["Amount must be a positive number"],
    "type": ["Type must be INCOME or EXPENSE"],
    "date": ["Invalid date"]
  }
}
```

### Global Error Handler

A centralized error handler catches all errors and maps them to appropriate
HTTP responses — including Prisma specific errors.

| Error Type | HTTP Status | Message |
|---|---|---|
| Duplicate entry (Prisma P2002) | 409 | A record with this value already exists |
| Record not found (Prisma P2025) | 404 | Record not found |
| Invalid token | 401 | Invalid or expired token |
| Inactive user login | 403 | Account has been deactivated |
| Unauthorized role | 403 | Access denied |
| Validation failure | 400 | Validation failed with field errors |
| Server error | 500 | Internal server error |

### Consistent Response Shape

Every single endpoint in the API returns the same structure:
```json
{
  "success": true | false,
  "message": "Human readable message",
  "data": { } | [ ] | null
}
```

This makes the API completely predictable for any frontend consuming it.

---

## Database Design

### Models

**User**
```
id        UUID (primary key)
name      String
email     String (unique)
password  String (bcrypt hashed)
role      Enum: VIEWER | ANALYST | ADMIN
status    Enum: ACTIVE | INACTIVE
createdAt DateTime
updatedAt DateTime
```

**FinancialRecord**
```
id        UUID (primary key)
amount    Decimal(12,2)
type      Enum: INCOME | EXPENSE
category  String
date      DateTime
notes     String (optional)
isDeleted Boolean (default: false)
createdAt DateTime
updatedAt DateTime
userId    UUID (foreign key → User)
```

### Key Modeling Decisions

- **Decimal(12,2) for money** — Never Float. Floating point arithmetic causes
  precision errors with financial calculations.
- **UUID primary keys** — More secure than sequential integers. Prevents
  enumeration attacks.
- **Soft delete** — `isDeleted` flag instead of actual deletion. Financial
  records should never be permanently removed.
- **Timestamps on every model** — `createdAt` and `updatedAt` are essential
  for financial audit trails.
- **Relational structure** — Each record is linked to the user who created it,
  enabling future audit and user-specific filtering.

---

## Assumptions Made

1. **Role assignment on registration is open** — Any role can be assigned
   during registration. In a real system this would be admin-only, but for
   assessment purposes this allows easy testing of all three roles.

2. **Soft delete for financial records** — Financial data should never be
   permanently deleted for audit and compliance reasons. Records are marked
   `isDeleted: true` and excluded from all queries.

3. **Inactive users cannot login** — If an admin deactivates a user account,
   that user immediately loses access with a clear error message.

4. **All roles can see basic dashboard** — VIEWER gets basic summary data
   (totals, recent activity). Advanced analytics (trends, breakdowns) are
   restricted to ANALYST and ADMIN. This distinction makes the three roles
   meaningfully different.

5. **Pagination defaults** — Default page size is 10 records, maximum is 100.
   This prevents accidentally returning thousands of records.

6. **Password is never returned** — The password field is always excluded from
   any user response using destructuring.

---

## Design Decisions & Tradeoffs

### Why PostgreSQL over MongoDB?
Financial data is inherently relational — users own records, records have
fixed schemas, and aggregations (SUM, GROUP BY) are core operations. A
relational database is the correct tool for this domain.

### Why Prisma 5 over raw SQL or Sequelize?
Prisma's schema file is the single source of truth for the database structure.
It's readable, version controlled, and generates migrations automatically.
Sequelize is older and more verbose. Raw SQL would reduce readability without
meaningful performance benefit at this scale.

### Why Zod over Joi or express-validator?
Zod is schema-first, TypeScript-friendly, and produces precise field-level
error messages out of the box. The `safeParse` pattern is clean and doesn't
throw exceptions for validation failures.

### Why JWT over sessions?
JWTs are stateless — no session store needed. This makes the API horizontally
scalable. For an internship assignment context, JWT is also the most widely
understood auth mechanism.

### Modular structure vs flat structure
A flat structure (all files in one folder) is simpler but doesn't scale. The
modular structure used here mirrors how real backend teams organize code —
each feature is self-contained and a new developer can find any file
immediately.

---

## Features Implemented

### Core Requirements
- ✅ User and Role Management (create, assign roles, activate/deactivate)
- ✅ Financial Records CRUD (create, read, update, soft delete)
- ✅ Record Filtering (by type, category, date range)
- ✅ Dashboard Summary APIs (totals, trends, category breakdown, recent activity)
- ✅ Role Based Access Control (VIEWER / ANALYST / ADMIN enforced via middleware)
- ✅ Input Validation and Error Handling (Zod + global error handler)
- ✅ Data Persistence (PostgreSQL with Prisma migrations)

### Optional Enhancements
- ✅ JWT Authentication
- ✅ Pagination on record listing
- ✅ Soft delete functionality
- ✅ API documentation (Swagger UI at `/api-docs`)
- ✅ Seed data for immediate testing
- ✅ Consistent API response format across all endpoints
- ✅ Inactive user access prevention

---

## Future Improvements

Given more time, these are the improvements I would prioritize:

1. **Rate limiting** on auth endpoints to prevent brute force attacks
2. **Refresh token** support so users are not logged out every 24 hours
3. **Unit and integration tests** using Jest and Supertest
4. **Search support** across record notes and categories
5. **CSV export** for financial records — common requirement in finance tools
6. **Weekly trends** in addition to monthly trends
7. **Audit log** — track every create, update, delete with timestamp and user
8. **Role-scoped record visibility** — analysts only see records they are
   assigned to
