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

## Deploying to Rodline

Run `npm install` from the project root, then `npm run build`. The production build is written to the root `dist/` folder and embeds the API URL from `frontend/.env.production`.

Upload the contents of `dist/` to the website document root. Also upload the complete `backend/` folder so the PHP API is available at `https://uza.pangaleo.co.tz/backend/api/`. If your domain differs, change `VITE_API_URL` in `frontend/.env.production` before building. Do not upload `frontend/src` or `node_modules`.

Configure the hosted database credentials in the hosting environment (`WINGA_DB_HOST`, `WINGA_DB_NAME`, `WINGA_DB_USER`, and `WINGA_DB_PASS`) or in `backend/config/database.php`. Import `database/winga_official.sql` and apply the migration SQL files that are missing from that database. Keep PHP and MySQL errors in the hosting logs; a PHP 500 response means the frontend reached the PHP endpoint, but the backend failed, commonly because of database credentials, missing migrations, or PHP configuration.

## Subscriptions and administration

Run `database/subscription_migration.sql` once for an existing database. New sellers receive a two-day trial. When trial/subscription time ends, login and protected API access are blocked until an administrator activates a new subscription.

Initial administrator login: phone `ADMIN001`, password `WingaAdmin2026!`. Change the password or create another administrator immediately. Set your actual WhatsApp number in `backend/config/app.php`; sellers use it to send payment receipts.

## JWT secret

You do not obtain a JWT token or secret from another website. On login, the API creates the JWT token automatically and the frontend saves it. Set `JWT_SECRET` in `backend/config/jwt.php` to a unique random string before deployment. Generate one with `php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"` and keep it private; do not place it in the frontend.
