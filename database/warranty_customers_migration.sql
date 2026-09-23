USE winga_official;
ALTER TABLE sales ADD COLUMN warranty_months INT NOT NULL DEFAULT 0 AFTER notes, ADD COLUMN warranty_ends_at DATE NULL AFTER warranty_months;
