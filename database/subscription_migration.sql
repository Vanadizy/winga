USE winga_official;
ALTER TABLE users
  ADD COLUMN trial_ends_at DATETIME NULL AFTER status,
  ADD COLUMN subscription_start_at DATETIME NULL AFTER trial_ends_at,
  ADD COLUMN subscription_end_at DATETIME NULL AFTER subscription_start_at,
  ADD COLUMN subscription_status ENUM('trial','active','expired') NOT NULL DEFAULT 'trial' AFTER subscription_end_at;

-- Existing accounts receive a two-day trial from migration time.
UPDATE users SET trial_ends_at=DATE_ADD(NOW(), INTERVAL 2 DAY), subscription_status='trial' WHERE role='seller' AND trial_ends_at IS NULL;

-- Create the initial administrator. Change this password immediately after first login.
INSERT INTO users(full_name,shop_name,phone,password,role,status,subscription_status)
SELECT 'WINGA Administrator','WINGA OFFICIAL','ADMIN001','$2y$10$hA.hMX4QWeuupcIEz/f.yugeFy/M8gIndqYsnfi7hvNLAy0aBjJaC','admin','active','active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE phone='ADMIN001');
