# WINGA OFFICIAL

Multi-seller phone and electronics stock system. The frontend is React/Vite/Tailwind; the backend is pure PHP with MySQL and JWT authentication.

## Run locally

1. Import `database/winga_official.sql` into MySQL.
2. Set your MySQL credentials and a production JWT secret in `backend/config/database.php` and `backend/config/jwt.php`.
3. For local development, run `php -S localhost:8000 -t backend` from the project root (or serve `backend/` through Apache; ensure `backend/uploads/` is writable).
4. Copy `frontend/.env.example` to `frontend/.env.local`. Update `VITE_API_URL` only if you use a different PHP address.
5. In `frontend/`, run `npm install`, then `npm run dev`.

Keep both terminal windows running while using the application. If the browser shows `net::ERR_CONNECTION_REFUSED` for `localhost:8000`, the PHP API server has stopped or was never started; start it again with `php -S localhost:8000 -t backend` from the project root.

The initial registration flow makes seller accounts. Promote an account to admin directly in MySQL: `UPDATE users SET role='admin' WHERE phone='...'`.

## Subscriptions and administration

Run `database/subscription_migration.sql` once for an existing database. New sellers receive a two-day trial. When trial/subscription time ends, login and protected API access are blocked until an administrator activates a new subscription.

Initial administrator login: phone `ADMIN001`, password `WingaAdmin2026!`. Change the password or create another administrator immediately. Set your actual WhatsApp number in `backend/config/app.php`; sellers use it to send payment receipts.

## JWT secret

You do not obtain a JWT token or secret from another website. On login, the API creates the JWT token automatically and the frontend saves it. Set `JWT_SECRET` in `backend/config/jwt.php` to a unique random string before deployment. Generate one with `php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"` and keep it private; do not place it in the frontend.
