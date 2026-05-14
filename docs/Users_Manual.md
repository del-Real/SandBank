# SandBank - User's Manual

## What SandBank Does

SandBank is a time-banking application. Users offer services, request services from other users, and exchange platform credits based on the duration or price of each activity.

In the current implementation:

- activities are listed publicly
- authenticated users can create activities and request other users' activities
- credits are bought through Stripe or earned through accepted service exchanges
- administrators can moderate users, activities, transactions, and ratings

## Getting Started

New accounts start with **20 credits**, which is enough to request a few activities immediately.

### Create an account

1. Open the app in your browser
2. Click **Sign up**
3. Enter your email, username, and password
4. Submit the form
5. On success, the app logs you in and returns you to the home page

### Log in

1. Click **Log in**
2. Enter email and password
3. Submit the form

### Log out

Click **Log out** in the top-right area of the header.

## Navigation Overview

### Always visible

| Item       | Purpose                    |
| ---------- | -------------------------- |
| Logo       | Returns to the home page   |
| Activities | Opens the activity catalog |

### Visible when logged out

| Item    | Purpose                     |
| ------- | --------------------------- |
| Log in  | Opens the login form        |
| Sign up | Opens the registration form |

### Visible when logged in

| Item     | Purpose                               |
| -------- | ------------------------------------- |
| Requests | Opens your outgoing requests          |
| History  | Opens transaction history and balance |
| Username | Displays the current account name     |
| Log out  | Ends the current session              |

### Visible to admins only

| Item        | Purpose                              |
| ----------- | ------------------------------------ |
| Admin Panel | Opens moderation and reporting tools |

## Activities

Activities are the services offered in the platform.

### Browse activities

1. Click **Activities**
2. Review the cards in the activity grid
3. Use the filters to search by title or by maximum token cost

Each activity card shows:

- title
- description
- price in tokens
- available actions based on who you are

### Create an activity

1. Go to **Activities**
2. Click **+ New Activity**
3. Fill in the form:
   - **Title** — what you are offering
   - **Description** — details for potential requesters
   - **Price** — cost in tokens (equals the duration in hours)
   - **Start date** — when the activity is available
4. Click **Create Activity**

### Edit your activity

1. Go to **Activities**
2. Find an activity you own
3. Click **Edit**
4. Update the form
5. Click **Save Changes**

### Delete your activity

1. Go to **Activities**
2. Find an activity you own
3. Click **Delete**
4. Confirm the action

Only the owner sees the edit and delete buttons in the normal activity list.

## Requests

Requests represent a user's intent to consume an activity.

### Create a request

1. Open **Activities**
2. Find an activity offered by another user
3. Click **Request**

You cannot request your own activity. You also need enough balance to cover the activity price.

### Request statuses

The backend stores the following lowercase status values:

| Status      | Meaning                                                |
| ----------- | ------------------------------------------------------ |
| `pending`   | Waiting for provider action                            |
| `accepted`  | Provider accepted and credit transfer already happened |
| `rejected`  | Provider declined the request                          |
| `cancelled` | Requester cancelled before acceptance                  |
| `completed` | The service was marked finished                        |

### View your requests

1. Click **Requests** in the header
2. Review the cards in **My Requests**

From this screen you can also:

- cancel a pending request
- leave a rating for a completed request
- jump to **Incoming Requests**

### Handle incoming requests

1. Open **Requests**
2. Click **Incoming Requests**
3. For each pending request, choose **Accept** or **Reject**
4. For each accepted request, choose **Mark Complete** when the service has finished

Important implementation detail:

- credits move when the provider accepts the request
- marking a request complete changes status only

## Credits and Payments

Credits are the in-app currency.

### How credits change

- when your request is accepted, the activity price is deducted from your balance
- when you accept a request for your own activity, the same amount is added to your balance
- when a Stripe payment is completed, a top-up transaction is recorded

### Check your balance

1. Open **History**
2. Read the balance shown in the page header

### Buy credits

1. Open **History**
2. Click **Buy Time Tokens**
3. Choose one of the packs on the credits page
4. Complete the Stripe checkout flow
5. Return to the credits page with a success or cancelled status

Current pack sizes:

| Pack     | Credits | Price  |
| -------- | ------- | ------ |
| Starter  | 10      | EUR 5  |
| Standard | 25      | EUR 10 |
| Pro      | 60      | EUR 20 |

## Ratings

### Leave a rating

1. Open **My Requests**
2. Find a request with status `completed`
3. Choose a star rating from 1 to 5
4. Optionally add a written review
5. Submit the rating

### What ratings are used for

Ratings are stored by the backend and are available through the API for user- and activity-based views.

## Transaction History

Open **History** to review your personal transaction feed.

Each card shows:

- transaction amount
- description
- date

The current UI treats Stripe top-ups as incoming credit entries and regular service-exchange payments as outgoing entries in that history list.

## Account Management

The backend supports updating your profile, changing your password, and retrieving your balance.

Current UI note:

- there is no dedicated profile settings page in the visible route set yet
- profile update and password update exist at the API level, not as a main navigable screen in the current frontend

## Admin Panel

The admin panel is available only to users with the `Admin` role.

### Available tabs

| Tab          | Purpose                                                                                 |
| ------------ | --------------------------------------------------------------------------------------- |
| Stats        | High-level counts for users, activities, transactions, payments, and credit circulation |
| Users        | Activate or deactivate users and change roles                                           |
| Activities   | Show, hide, or delete activities                                                        |
| Transactions | Review the full transaction ledger                                                      |
| Ratings      | Review and delete ratings                                                               |

### Typical admin tasks

1. Open **Admin Panel**
2. Select the relevant tab
3. Apply the moderation action directly in the table or card view

## Frequently Asked Questions

### How do I get credits?

You can buy them through the credit packs or earn them when someone requests your activity and you accept that request.

### When are credits transferred for a service request?

They are transferred when the provider accepts the request, not when the request is marked completed.

### Can I request my own activity?

No.

### Can I cancel any request?

No. In the current backend rules, only `pending` requests can be cancelled by the requester.

### Do I need to be logged in to use the platform?

You can browse public pages without logging in, but creating activities, sending requests, viewing history, buying credits, and using admin tools require an authenticated session.

## Quick Reference

| Goal                           | Where to go                   |
| ------------------------------ | ----------------------------- |
| Register                       | Header -> Sign up             |
| Log in                         | Header -> Log in              |
| Browse activities              | Header -> Activities          |
| Create an activity             | Activities -> + New Activity  |
| Request a service              | Activities -> Request         |
| Review my requests             | Header -> Requests            |
| Review incoming requests       | Requests -> Incoming Requests |
| Check balance and transactions | Header -> History             |
| Buy credits                    | History -> Buy Time Tokens    |
| Moderate the platform          | Header -> Admin Panel         |
