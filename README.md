# Job Tracker

A role-based user management system with email verification, built with **Django REST Framework** (backend) and **React + Vite** (frontend).

## Features

- **Authentication** — Register, login with JWT tokens and automatic token refresh
- **Email Verification** — Verification link sent via Gmail SMTP; accounts activate after confirmation
- **Role-Based Access Control** — Three roles with different permission levels:
  - **Admin** — Full access: view, create, update, delete users and assign roles
  - **Manager** — View users and manage assigned records (cannot create/delete users or change roles)
  - **User** — Register, login and manage own profile only
- **Dashboard** — Role-count stats, user management table with inline editing
- **Protected Routes** — Frontend and API endpoints restricted by role

## Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Backend  | Python, Django 6, Django REST Framework       |
| Auth     | JWT (Simple JWT), Email Verification Tokens   |
| Frontend | React 19, Vite, React Router, Axios           |
| Database | SQLite (default)                              |
| Email    | Gmail SMTP                                    |
| Icons    | Lucide React                                  |

## Project Structure

```
job_tracker/
├── backend/
│   ├── core/              # Django project settings and root URLs
│   │   ├── settings.py
│   │   └── urls.py
│   ├── jobs/              # Main app
│   │   ├── models.py      # Custom User model
│   │   ├── serializers.py # User, Register, Login serializers
│   │   ├── views.py       # Auth views and UserViewSet
│   │   ├── permissions.py # Role-based permission classes
│   │   ├── tokens.py      # Email verification token generator
│   │   ├── urls.py        # API URL routing
│   │   └── admin.py       # Django admin configuration
│   ├── venv/              # Python virtual environment
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, ProtectedRoute
│   │   ├── context/       # AuthContext (global auth state)
│   │   ├── pages/         # Home, Login, Register, Dashboard, VerifyEmail
│   │   ├── services/      # Axios API client with interceptors
│   │   ├── App.jsx        # Root component with routing
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Design system
│   ├── package.json
│   └── vite.config.js
└── API.md                  # API documentation
```

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- Gmail account with App Password (for email verification)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:3000` with API calls proxied to `http://localhost:8000`.

### Email Configuration

Update `backend/core/settings.py` with your Gmail credentials:

```python
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'your-email@gmail.com'
```

> **Note:** Use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular password.

## Usage

1. Register at `/register` — choose a role (Admin, Manager, or User)
2. Check your email for the verification link
3. Click the link to verify your account
4. Login at `/login`
5. Access the Dashboard to manage users (permissions depend on your role)

## API Documentation

See [docs/API.md](docs/API.md) for the full API reference.

## License

This project is for educational purposes.
