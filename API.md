# API Documentation

**Base URL:** `http://localhost:8000/api`

All endpoints return JSON. Authentication uses JWT Bearer tokens.

---

## Authentication

### Register

```
POST /api/auth/register/
```

Creates a new user and sends a verification email.

**Request Body:**

| Field    | Type   | Required | Description                          |
|----------|--------|----------|--------------------------------------|
| name     | string | Yes      | Full name                            |
| email    | string | Yes      | Email address (must be unique)       |
| password | string | Yes      | Password (min 8 characters)          |
| role     | string | No       | `Admin`, `Manager`, or `User` (default: `User`) |

**Example Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "User"
}
```

**Success Response:** `201 Created`

```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "User"
}
```

**Error Response:** `400 Bad Request`

```json
{
  "email": ["user with this email already exists."]
}
```

---

### Verify Email

```
GET /api/auth/email-verify/?uid={uid}&token={token}
```

Verifies a user's email address using the link sent during registration.

**Query Parameters:**

| Param | Description                      |
|-------|----------------------------------|
| uid   | Base64-encoded user ID           |
| token | Email verification token         |

**Success Response:** `200 OK`

```json
{
  "message": "Email successfully verified. You can now login."
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Activation link is invalid or expired!"
}
```

---

### Login

```
POST /api/auth/login/
```

Authenticates a user and returns JWT tokens.

**Request Body:**

| Field    | Type   | Required |
|----------|--------|----------|
| email    | string | Yes      |
| password | string | Yes      |

**Example Request:**

```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Success Response:** `200 OK`

```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "User",
    "is_email_verified": true,
    "date_joined": "2026-03-01T10:30:00Z"
  },
  "access": "eyJ0eXAiOiJKV1Q...",
  "refresh": "eyJ0eXAiOiJKV1Q..."
}
```

**Error Responses:**

- `400` — Invalid credentials or unverified email

---

### Refresh Token

```
POST /api/auth/token/refresh/
```

Returns a new access token using a valid refresh token.

**Request Body:**

```json
{
  "refresh": "eyJ0eXAiOiJKV1Q..."
}
```

**Success Response:** `200 OK`

```json
{
  "access": "eyJ0eXAiOiJKV1Q..."
}
```

---

## User Management

> All endpoints below require authentication via `Authorization: Bearer <access_token>` header.

### List Users

```
GET /api/users/
```

Returns a list of users. Results vary by role:

| Role    | Returns                     |
|---------|-----------------------------|
| Admin   | All users                   |
| Manager | All users                   |
| User    | Only their own profile      |

**Success Response:** `200 OK`

```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "Admin",
    "is_email_verified": true,
    "date_joined": "2026-03-01T10:00:00Z"
  }
]
```

---

### Get User

```
GET /api/users/{id}/
```

Returns a single user's details.

| Role    | Access                                  |
|---------|-----------------------------------------|
| Admin   | Any user                                |
| Manager | Any user                                |
| User    | Own profile only                        |

---

### Update User

```
PATCH /api/users/{id}/
```

Updates user fields.

**Editable Fields:**

| Field | Who can edit                        |
|-------|-------------------------------------|
| name  | Admin (any user), User (own only)   |
| role  | Admin only                          |

**Example Request:**

```json
{
  "name": "Updated Name",
  "role": "Manager"
}
```

**Success Response:** `200 OK`

**Error Response (non-admin changing role):** `400 Bad Request`

```json
{
  "role": "Only an Admin can change user roles."
}
```

---

### Delete User

```
DELETE /api/users/{id}/
```

Permanently deletes a user.

| Role    | Access              |
|---------|---------------------|
| Admin   | Can delete any user |
| Manager | Not allowed         |
| User    | Not allowed         |

**Success Response:** `204 No Content`

---

## Permission Summary

| Action          | Admin | Manager | User           |
|-----------------|-------|---------|----------------|
| List users      | ✅    | ✅      | Own profile    |
| View user       | ✅    | ✅      | Own profile    |
| Create user     | ✅    | ❌      | ❌             |
| Update user     | ✅    | ❌      | Own profile    |
| Delete user     | ✅    | ❌      | ❌             |
| Change roles    | ✅    | ❌      | ❌             |

---

## JWT Token Details

| Setting                | Value     |
|------------------------|-----------|
| Access token lifetime  | 60 minutes |
| Refresh token lifetime | 1 day      |

Tokens are configured in `backend/core/settings.py` under `SIMPLE_JWT`.

---

## Error Format

All errors follow this pattern:

```json
{
  "field_name": ["Error message."],
  "detail": "Error description."
}
```

Common HTTP status codes:

| Code | Meaning               |
|------|-----------------------|
| 200  | Success               |
| 201  | Created               |
| 204  | Deleted               |
| 400  | Bad request / Validation error |
| 401  | Unauthorized (token expired or missing) |
| 403  | Forbidden (insufficient role) |
| 404  | Not found             |
