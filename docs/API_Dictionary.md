# SandBank - API Dictionary

## Conventions

- Base API URL: `http://localhost:8000/api`
- Authentication: `Authorization: Bearer <jwt>`
- Content type: `application/json` unless noted otherwise
- Error shape:

```json
{
  "detail": "Human-readable message"
}
```

## Authentication

| Method | Path             | Auth   | Request body     | Response             | Notes                             |
| ------ | ---------------- | ------ | ---------------- | -------------------- | --------------------------------- |
| `POST` | `/auth/register` | Public | `RegisterSchema` | `AuthResponseSchema` | Creates account and returns token |
| `POST` | `/auth/login`    | Public | `LoginSchema`    | `AuthResponseSchema` | Returns token for existing user   |

### RegisterSchema

```json
{
  "username": "string, 3-50 chars",
  "email": "valid email",
  "password": "string, min 8 chars"
}
```

### LoginSchema

```json
{
  "email": "valid email",
  "password": "string"
}
```

### AuthResponseSchema

```json
{
  "id": 1,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "User",
  "expires_at": "2026-05-14T12:30:00"
}
```

## Users

| Method   | Path                 | Auth  | Request body           | Response                | Notes                           |
| -------- | -------------------- | ----- | ---------------------- | ----------------------- | ------------------------------- |
| `GET`    | `/users/me`          | User  | none                   | `UserSchema`            | Returns the authenticated user  |
| `PUT`    | `/users/me`          | User  | `UpdateProfileSchema`  | `UserSchema`            | Username and email are optional |
| `PUT`    | `/users/me/password` | User  | `UpdatePasswordSchema` | empty body              | Returns `204 No Content`        |
| `GET`    | `/users/me/balance`  | User  | none                   | `{ "balance": number }` | Balance helper endpoint         |
| `GET`    | `/users/`            | Admin | none                   | `UserSchema[]`          | Admin-only user list            |
| `GET`    | `/users/{user_id}`   | Admin | none                   | `UserSchema`            | `404` if missing                |
| `DELETE` | `/users/{user_id}`   | Admin | none                   | empty body              | Returns `204 No Content`        |

## Activities

| Method   | Path                        | Auth           | Request body           | Response           | Notes                                            |
| -------- | --------------------------- | -------------- | ---------------------- | ------------------ | ------------------------------------------------ |
| `GET`    | `/activities/`              | Public         | none                   | `ActivitySchema[]` | Supports `title` and `max_duration` query params |
| `GET`    | `/activities/{activity_id}` | Public         | none                   | `ActivitySchema`   | `404` if missing                                 |
| `POST`   | `/activities/`              | User           | `CreateActivitySchema` | `ActivitySchema`   | Creates a new activity                           |
| `PUT`    | `/activities/{activity_id}` | Owner          | `UpdateActivitySchema` | `ActivitySchema`   | `403` if caller is not owner                     |
| `DELETE` | `/activities/{activity_id}` | Owner or Admin | none                   | empty body         | Returns `204 No Content`                         |

### Activity query parameters

| Param          | Type    | Meaning                       |
| -------------- | ------- | ----------------------------- |
| `title`        | string  | Partial title filter          |
| `max_duration` | integer | Maximum token cost / duration |

## Service Requests

The service request lifecycle uses lowercase status values in the backend: `pending`, `accepted`, `rejected`, `cancelled`, `completed`.

| Method | Path                              | Auth                  | Request body                 | Response                 | Notes                                                                   |
| ------ | --------------------------------- | --------------------- | ---------------------------- | ------------------------ | ----------------------------------------------------------------------- |
| `POST` | `/requests/`                      | User                  | `CreateServiceRequestSchema` | `ServiceRequestSchema`   | Fails if requester owns the activity or lacks balance                   |
| `GET`  | `/requests/me`                    | User                  | none                         | `ServiceRequestSchema[]` | Outgoing requests                                                       |
| `GET`  | `/requests/incoming`              | User                  | none                         | `ServiceRequestSchema[]` | Requests against activities owned by current user                       |
| `PUT`  | `/requests/{request_id}/accept`   | Activity owner        | none                         | `ServiceRequestSchema`   | Transfers credits immediately and creates a transaction                 |
| `PUT`  | `/requests/{request_id}/reject`   | Activity owner        | none                         | `ServiceRequestSchema`   | Allowed only from `pending`                                             |
| `PUT`  | `/requests/{request_id}/cancel`   | Requester             | none                         | `ServiceRequestSchema`   | Allowed only from `pending`                                             |
| `PUT`  | `/requests/{request_id}/complete` | Requester or provider | none                         | `ServiceRequestSchema`   | Changes status from `accepted` to `completed`; no extra credit transfer |

### Example service request

```json
{
  "id": 1,
  "activity_id": 4,
  "requester_id": 2,
  "status": "pending",
  "created_at": "2026-05-14T10:00:00"
}
```

## Transactions

| Method | Path               | Auth | Request body | Response              | Notes                    |
| ------ | ------------------ | ---- | ------------ | --------------------- | ------------------------ |
| `GET`  | `/transactions/me` | User | none         | `TransactionSchema[]` | Returns personal history |

### Example transaction

```json
{
  "id": 1,
  "sender_id": 2,
  "receiver_id": 1,
  "amount": 2,
  "description": "Payment for 'Guitar Lessons'",
  "service_request_id": 10,
  "created_at": "2026-05-14T12:00:00"
}
```

## Payments

| Method | Path                 | Auth             | Request body           | Response                 | Notes                                     |
| ------ | -------------------- | ---------------- | ---------------------- | ------------------------ | ----------------------------------------- |
| `POST` | `/payments/checkout` | User             | `CreateCheckoutSchema` | `CheckoutResponseSchema` | Valid packs: `starter`, `standard`, `pro` |
| `POST` | `/payments/webhook`  | Stripe signature | raw request body       | `{ "status": "ok" }`     | Requires `stripe-signature` header        |
| `GET`  | `/payments/me`       | User             | none                   | `PaymentSchema[]`        | Personal Stripe payment history           |

### Payment packs

| Pack       | Credits | Amount         |
| ---------- | ------- | -------------- |
| `starter`  | 10      | 500 EUR cents  |
| `standard` | 25      | 1000 EUR cents |
| `pro`      | 60      | 2000 EUR cents |

## Ratings

| Method | Path                              | Auth   | Request body         | Response         | Notes                             |
| ------ | --------------------------------- | ------ | -------------------- | ---------------- | --------------------------------- |
| `POST` | `/ratings/`                       | User   | `CreateRatingSchema` | `RatingSchema`   | Stars must be between 1 and 5     |
| `GET`  | `/ratings/user/{user_id}`         | Public | none                 | `RatingSchema[]` | Ratings received by a user        |
| `GET`  | `/ratings/activity/{activity_id}` | Public | none                 | `RatingSchema[]` | Ratings related to an activity    |
| `GET`  | `/ratings/me`                     | User   | none                 | `RatingSchema[]` | Ratings submitted by current user |

## Admin

All admin endpoints require a valid bearer token for a user whose role is `Admin`.

| Method   | Path                                      | Auth  | Request body                    | Response              | Notes                                                       |
| -------- | ----------------------------------------- | ----- | ------------------------------- | --------------------- | ----------------------------------------------------------- |
| `GET`    | `/admin/stats`                            | Admin | none                            | stats object          | Totals across users, activities, transactions, and payments |
| `GET`    | `/admin/users`                            | Admin | none                            | `UserSchema[]`        | Full user list                                              |
| `PUT`    | `/admin/users/{user_id}/active`           | Admin | `{ "is_active": boolean }`      | `UserSchema`          | Activates or deactivates account                            |
| `PUT`    | `/admin/users/{user_id}/role`             | Admin | `{ "role": "Admin" or "User" }` | `UserSchema`          | Rejects other role values                                   |
| `GET`    | `/admin/activities`                       | Admin | none                            | `ActivitySchema[]`    | Includes hidden activities                                  |
| `PUT`    | `/admin/activities/{activity_id}/visible` | Admin | `{ "is_visible": boolean }`     | `ActivitySchema`      | Toggles listing visibility                                  |
| `DELETE` | `/admin/activities/{activity_id}`         | Admin | none                            | empty body            | Returns `204 No Content`                                    |
| `GET`    | `/admin/transactions`                     | Admin | none                            | `TransactionSchema[]` | Global transaction ledger                                   |
| `GET`    | `/admin/ratings`                          | Admin | none                            | `RatingSchema[]`      | Global ratings list                                         |
| `DELETE` | `/admin/ratings/{rating_id}`              | Admin | none                            | empty body            | Returns `204 No Content`                                    |

### Admin stats response shape

```json
{
  "total_users": 12,
  "active_users": 10,
  "total_activities": 24,
  "visible_activities": 21,
  "total_transactions": 37,
  "total_credits_in_circulation": 268,
  "total_payments": 9
}
```

## Shared Schemas

### UserSchema

| Field        | Type     |
| ------------ | -------- |
| `id`         | integer  |
| `username`   | string   |
| `email`      | string   |
| `role`       | string   |
| `balance`    | integer  |
| `is_active`  | boolean  |
| `created_at` | datetime |

### UpdateProfileSchema

| Field      | Type         | Required |
| ---------- | ------------ | -------- |
| `username` | string       | No       |
| `email`    | email string | No       |

### UpdatePasswordSchema

| Field              | Type   |
| ------------------ | ------ |
| `current_password` | string |
| `new_password`     | string |

### ActivitySchema

| Field         | Type             |
| ------------- | ---------------- |
| `id`          | integer          |
| `title`       | string           |
| `description` | string           |
| `duration`    | integer          |
| `start_date`  | datetime         |
| `created_at`  | datetime         |
| `updated_at`  | datetime or null |
| `owner_id`    | integer          |
| `is_visible`  | boolean          |

### CreateActivitySchema

| Field         | Type     |
| ------------- | -------- |
| `title`       | string   |
| `description` | string   |
| `duration`    | integer  |
| `start_date`  | datetime |

### UpdateActivitySchema

| Field         | Type     | Required |
| ------------- | -------- | -------- |
| `title`       | string   | No       |
| `description` | string   | No       |
| `duration`    | integer  | No       |
| `start_date`  | datetime | No       |

### ServiceRequestSchema

| Field          | Type     |
| -------------- | -------- |
| `id`           | integer  |
| `activity_id`  | integer  |
| `requester_id` | integer  |
| `status`       | string   |
| `created_at`   | datetime |

### CreateServiceRequestSchema

| Field         | Type    |
| ------------- | ------- |
| `activity_id` | integer |

### TransactionSchema

| Field                | Type            |
| -------------------- | --------------- |
| `id`                 | integer         |
| `sender_id`          | integer         |
| `receiver_id`        | integer         |
| `amount`             | integer         |
| `description`        | string          |
| `service_request_id` | integer or null |
| `created_at`         | datetime        |

### CreateCheckoutSchema

| Field  | Type                             |
| ------ | -------------------------------- |
| `pack` | `starter` \| `standard` \| `pro` |

### CheckoutResponseSchema

| Field          | Type   |
| -------------- | ------ |
| `checkout_url` | string |

### PaymentSchema

| Field               | Type     |
| ------------------- | -------- |
| `id`                | integer  |
| `user_id`           | integer  |
| `stripe_session_id` | string   |
| `credits`           | integer  |
| `amount_eur`        | integer  |
| `status`            | string   |
| `created_at`        | datetime |

### CreateRatingSchema

| Field                | Type           | Notes    |
| -------------------- | -------------- | -------- |
| `service_request_id` | integer        | Required |
| `stars`              | integer        | 1 to 5   |
| `review`             | string or null | Optional |

### RatingSchema

| Field                | Type           |
| -------------------- | -------------- |
| `id`                 | integer        |
| `service_request_id` | integer        |
| `reviewer_id`        | integer        |
| `reviewee_id`        | integer        |
| `stars`              | integer        |
| `review`             | string or null |
| `created_at`         | datetime       |

## Common Status Codes

| Code  | Meaning in this API                                                            |
| ----- | ------------------------------------------------------------------------------ |
| `200` | Successful read or update                                                      |
| `201` | Resource created                                                               |
| `204` | Successful operation with no response body                                     |
| `400` | Invalid request, invalid state transition, or validation/business rule failure |
| `403` | Authenticated but not permitted                                                |
| `404` | Resource not found                                                             |

---

## Detailed Endpoint Reference

### `GET /api/transactions/me`

Get the current user's transaction history.

| Field      | Details               |
| ---------- | --------------------- |
| **Auth**   | Bearer token required |
| **Status** | `200 OK`              |

**Response:**

```json
[
  {
    "id": 1,
    "sender_id": 2,
    "receiver_id": 1,
    "amount": 2,
    "description": "Payment for Guitar Lessons",
    "service_request_id": 1,
    "created_at": "2026-05-14T12:00:00"
  }
]
```

---

## Payments

### `POST /api/payments/checkout`

Create a Stripe checkout session to purchase credits.

| Field      | Details               |
| ---------- | --------------------- |
| **Auth**   | Bearer token required |
| **Status** | `200 OK`              |

**Request Body:**

```json
{
  "pack": "starter | standard | pro"
}
```

**Response:**

```json
{
  "checkout_url": "https://checkout.stripe.com/c/pay/..."
}
```

**Errors:** `400` — Invalid pack name

---

### `POST /api/payments/webhook`

Stripe webhook endpoint. Called by Stripe after payment events.

| Field      | Details                                      |
| ---------- | -------------------------------------------- |
| **Auth**   | Stripe signature header (`stripe-signature`) |
| **Status** | `200 OK`                                     |

**Headers:** `stripe-signature` (required)

**Request Body:** Raw Stripe event payload (bytes)

**Response:**

```json
{
  "status": "ok"
}
```

**Errors:** `400` — Missing signature / invalid event

---

### `GET /api/payments/me`

Get the current user's payment history.

| Field      | Details               |
| ---------- | --------------------- |
| **Auth**   | Bearer token required |
| **Status** | `200 OK`              |

**Response:**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "stripe_session_id": "cs_live_...",
    "credits": 5,
    "amount_eur": 500,
    "status": "completed",
    "created_at": "2026-05-14T10:00:00"
  }
]
```

---

## Ratings

### `POST /api/ratings/`

Submit a rating for a completed service request.

| Field      | Details               |
| ---------- | --------------------- |
| **Auth**   | Bearer token required |
| **Status** | `201 Created`         |

**Request Body:**

```json
{
  "service_request_id": 1,
  "stars": 5,
  "review": "Excellent teacher!"
}
```

| Field                | Type   | Constraints |
| -------------------- | ------ | ----------- |
| `service_request_id` | int    | Required    |
| `stars`              | int    | 1–5         |
| `review`             | string | Optional    |

**Response:**

```json
{
  "id": 1,
  "service_request_id": 1,
  "reviewer_id": 2,
  "reviewee_id": 1,
  "stars": 5,
  "review": "Excellent teacher!",
  "created_at": "2026-05-14T15:00:00"
}
```

**Errors:** `403` — Not the requester · `400` — Already rated / request not completed

---

### `GET /api/ratings/user/{user_id}`

Get all ratings received by a user.

| Field      | Details     |
| ---------- | ----------- |
| **Auth**   | No (Public) |
| **Status** | `200 OK`    |

**Path Params:** `user_id` (int)

**Response:** Array of RatingSchema

---

### `GET /api/ratings/activity/{activity_id}`

Get all ratings for a specific activity.

| Field      | Details     |
| ---------- | ----------- |
| **Auth**   | No (Public) |
| **Status** | `200 OK`    |

**Path Params:** `activity_id` (int)

**Response:** Array of RatingSchema

---

### `GET /api/ratings/me`

Get ratings submitted by the current user.

| Field      | Details               |
| ---------- | --------------------- |
| **Auth**   | Bearer token required |
| **Status** | `200 OK`              |

**Response:** Array of RatingSchema

---

## Admin

> All admin endpoints require an authenticated user with `role: "Admin"`.

### `GET /api/admin/stats`

Get platform statistics (user count, activity count, etc.)

| Field      | Details              |
| ---------- | -------------------- |
| **Auth**   | Admin token required |
| **Status** | `200 OK`             |

**Response:** Platform stats object (dynamic)

---

### `GET /api/admin/users`

List all registered users.

| Field      | Details              |
| ---------- | -------------------- |
| **Auth**   | Admin token required |
| **Status** | `200 OK`             |

**Response:** Array of UserSchema

---

### `PUT /api/admin/users/{user_id}/active`

Activate or deactivate a user account.

| Field      | Details              |
| ---------- | -------------------- |
| **Auth**   | Admin token required |
| **Status** | `200 OK`             |

**Path Params:** `user_id` (int)

**Request Body:**

```json
{
  "is_active": true
}
```

**Response:** Updated UserSchema

**Errors:** `404` — User not found

---

### `PUT /api/admin/users/{user_id}/role`

Change a user's role.

| Field      | Details              |
| ---------- | -------------------- |
| **Auth**   | Admin token required |
| **Status** | `200 OK`             |

**Path Params:** `user_id` (int)

**Request Body:**

```json
{
  "role": "Admin | User"
}
```

**Response:** Updated UserSchema

**Errors:** `400` — Invalid role

---

### `GET /api/admin/activities`

List all activities (including hidden ones).

| Field      | Details              |
| ---------- | -------------------- |
| **Auth**   | Admin token required |
| **Status** | `200 OK`             |

**Response:** Array of ActivitySchema

---

### `PUT /api/admin/activities/{activity_id}/visible`

Show or hide an activity.

| Field      | Details              |
| ---------- | -------------------- |
| **Auth**   | Admin token required |
| **Status** | `200 OK`             |

**Path Params:** `activity_id` (int)

**Request Body:**

```json
{
  "is_visible": true
}
```

**Response:** Updated ActivitySchema

**Errors:** `404` — Activity not found

---

### `DELETE /api/admin/activities/{activity_id}`

Permanently delete an activity.

| Field      | Details              |
| ---------- | -------------------- |
| **Auth**   | Admin token required |
| **Status** | `204 No Content`     |

**Path Params:** `activity_id` (int)

**Errors:** `404` — Activity not found

---

## Data Models Reference

### UserSchema

| Field        | Type     | Description            |
| ------------ | -------- | ---------------------- |
| `id`         | int      | Unique identifier      |
| `username`   | string   | Display name           |
| `email`      | string   | Email address          |
| `role`       | string   | `"User"` or `"Admin"`  |
| `balance`    | int      | Current credit balance |
| `is_active`  | bool     | Account active status  |
| `created_at` | datetime | Registration timestamp |

### ActivitySchema

| Field         | Type      | Description                        |
| ------------- | --------- | ---------------------------------- |
| `id`          | int       | Unique identifier                  |
| `title`       | string    | Activity title                     |
| `description` | string    | Detailed description               |
| `duration`    | int       | Duration in hours (= credits cost) |
| `start_date`  | datetime  | Scheduled start date               |
| `created_at`  | datetime  | Creation timestamp                 |
| `updated_at`  | datetime? | Last update timestamp              |
| `owner_id`    | int       | Creator's user ID                  |
| `is_visible`  | bool      | Visibility flag                    |

### ServiceRequestSchema

| Field          | Type     | Description                                                     |
| -------------- | -------- | --------------------------------------------------------------- |
| `id`           | int      | Unique identifier                                               |
| `activity_id`  | int      | Requested activity ID                                           |
| `requester_id` | int      | User who made the request                                       |
| `status`       | string   | `Pending` / `Accepted` / `Rejected` / `Cancelled` / `Completed` |
| `created_at`   | datetime | Request timestamp                                               |

### TransactionSchema

| Field                | Type     | Description                 |
| -------------------- | -------- | --------------------------- |
| `id`                 | int      | Unique identifier           |
| `sender_id`          | int      | Payer user ID               |
| `receiver_id`        | int      | Receiver user ID            |
| `amount`             | int      | Credits transferred         |
| `description`        | string   | Transaction description     |
| `service_request_id` | int?     | Associated request (if any) |
| `created_at`         | datetime | Transaction timestamp       |

### PaymentSchema

| Field               | Type     | Description                |
| ------------------- | -------- | -------------------------- |
| `id`                | int      | Unique identifier          |
| `user_id`           | int      | Buyer user ID              |
| `stripe_session_id` | string   | Stripe checkout session ID |
| `credits`           | int      | Credits purchased          |
| `amount_eur`        | int      | Amount in EUR cents        |
| `status`            | string   | Payment status             |
| `created_at`        | datetime | Payment timestamp          |

### RatingSchema

| Field                | Type     | Description                   |
| -------------------- | -------- | ----------------------------- |
| `id`                 | int      | Unique identifier             |
| `service_request_id` | int      | Rated request ID              |
| `reviewer_id`        | int      | User who submitted the rating |
| `reviewee_id`        | int      | User being rated              |
| `stars`              | int      | Rating (1–5)                  |
| `review`             | string?  | Optional text review          |
| `created_at`         | datetime | Rating timestamp              |

---

## Error Response Format

All error responses follow this structure:

```json
{
  "detail": "Human-readable error message"
}
```

## Authentication Header

```
Authorization: Bearer <jwt_token>
```

Token expires after **30 minutes** (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`). Algorithm: HS256.
