# EMS — Electronic Management System

EMS is a PHP and React application for managing an electronics shop: inventory, sales, customer purchases, returns, warranties and business reports. The database schema is kept in `database.sql` and has not been changed.

## Configure the database

Open `backend/config/database.php` and set `DB_NAME`, `DB_USER` and `DB_PASS` for the target hosting account. `DB_HOST` normally remains `localhost`. Alternatively, configure `EMS_DB_HOST`, `EMS_DB_NAME`, `EMS_DB_USER` and `EMS_DB_PASS` as server environment variables. Import the supplied `database.sql` and apply only the migration files needed by the features you use.

## Build and host

1. Install Node.js and PHP with the MySQL PDO driver on the build and hosting machines.
2. Run `npm install --prefix frontend` and `npm run build` from this project directory.
3. Copy the contents of `dist/` and the `backend/` folder to your web root or a subdirectory. Keep the generated `assets/` folder beside `index.html` and keep `backend/` beside it.
4. Point the domain or subdirectory to `index.html`. The included `.htaccess` routes API requests to PHP and refreshes React routes. Apache must have `mod_rewrite` enabled and allow `.htaccess` overrides.
5. Import the existing database schema, then set the connection values above.

The build uses relative asset and API paths by default, so it works in the domain root and in a subfolder without changing the frontend code. If the PHP API is hosted on a separate domain, set `VITE_API_URL` in `frontend/.env.production` to its absolute API URL before building.

## Local development

Run the Vite frontend with `npm run dev --prefix frontend`. Configure `VITE_API_URL` in `frontend/.env.local` if PHP runs on a separate port. For a same-origin setup under Apache, use the project root `index.html` and `.htaccess`.

Product photos are stored under `backend/uploads/`; ensure PHP can write to that directory. Do not upload `frontend/node_modules` or the frontend source when deploying the built site.
