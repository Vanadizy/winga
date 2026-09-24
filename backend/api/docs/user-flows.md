# User flows

- Register, then log in. The JWT is saved in local storage and validated with `/auth/me.php` after refresh.
- Add a product with a globally unique IMEI/serial, optionally scan it by camera, then upload one or more images.
- In Sales, scan/type an owned available identifier, add optional customer information, and record the sale. Profit is calculated on the API.
- In Returns, enter the sold identifier. The latest unreturned sale is returned and the item becomes available.
- In Requests, create a wanted-product request. Another seller chooses their available product and confirms its agreed price; ownership and a transfer-history record are saved atomically.
- Dashboard and Requests poll their APIs every nine seconds.
