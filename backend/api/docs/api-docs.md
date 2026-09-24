# API

All endpoints return JSON. Protected endpoints require `Authorization: Bearer <JWT>`.

| Area | Endpoints |
|---|---|
| Authentication | `POST auth/register.php`, `POST auth/login.php`, `GET auth/me.php` |
| Products | `POST products/create.php`, `GET products/list.php`, `POST products/update.php`, `POST products/delete.php`, `GET products/scan.php?identifier=` |
| Sales and returns | `POST sales/create.php`, `GET sales/list.php`, `GET sales/report.php?period=day|month`, `POST returns/create.php`, `GET returns/list.php` |
| Seller requests | `POST requests/create.php`, `GET requests/list.php`, `POST requests/accept.php`, `POST requests/reject.php`, `GET transfers/history.php` |
| Other | `POST uploads/upload-image.php` (multipart `product_id`, `images[]`), `GET dashboard/stats.php` |
