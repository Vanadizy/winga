USE winga_official;
CREATE TABLE IF NOT EXISTS audit_logs (id INT PRIMARY KEY AUTO_INCREMENT,actor_id INT NULL,action VARCHAR(100) NOT NULL,target_type VARCHAR(50) NOT NULL,target_id INT NULL,details TEXT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX idx_audit_created(created_at),FOREIGN KEY(actor_id) REFERENCES users(id) ON DELETE SET NULL);
