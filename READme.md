turn this into text (normal)

# Notelit

Developed by:
``
523k0002-Ly Hung Quoc Chau
``
``
523k0021-Nguyen Thi Tuyet Nhung
``
``
523k0004-Dam Trung Hieu
``

## 1. Clone the Repository

```bash
git clone https://github.com/qchau0202/WEB-FinalProject.git
```

## 2. Database Setup

### 2.1. Create the Database

First, create the database using MySQL:

```sql
CREATE DATABASE notelit;
USE notelit;
```

### 2.2. Migrate Tables

Run the following command in the `backend` directory to migrate all tables:

```bash
cd backend
php artisan migrate:fresh
```

## 3. Install Dependencies

### 3.1. Backend

From the `backend` directory:

```bash
cd backend
composer install
```

### 3.2. Frontend

From the `frontend` directory:

```bash
cd frontend
npm install
```

## 4. Environment Configuration

### 4.1. Backend

- Copy `.env.example` to `.env` and update your database credentials:

```bash
cp .env.example .env
```

- Set your database info and other credentials in `.env`:

```
DB_DATABASE=notelit
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password
```

- Generate Laravel app key:

```bash
php artisan key:generate
```

### 4.2. Frontend

- If needed, copy `.env.example` to `.env` and set the API URL (e.g., `VITE_API_URL=http://localhost:8000`).

## 5. Running the App

### 5.1. Backend

From the `backend` directory:

```bash
php artisan serve
```

### 5.2. Frontend

From the `frontend` directory:

```bash
npm run dev
```

## 6. SQL Queries

```sql
SELECT * FROM labels;
SELECT * FROM note_attachments;
SELECT * FROM note_collaborators;
SELECT * FROM note_labels;
SELECT * FROM notes;
SELECT * FROM notifications;
SELECT * FROM password_resets;
SELECT * FROM sessions;
SELECT * FROM users;
```

## 7. Troubleshooting

- Make sure your MySQL server is running and credentials are correct.
- If you change the database, re-run migrations with `php artisan migrate:fresh`.
- For CORS/API issues, check your backend `.env` and CORS middleware.
