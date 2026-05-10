-- Create test room for load testing
INSERT INTO rooms (id, created_at, pin_digest, pin_hash, type) 
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', UNIX_TIMESTAMP() * 1000, '1234_digest', '$2a$10$8F0vZcWZzYX8X6EKXzC8uO8zU/8zEqXzEqXzEqXzEqXz', 'TEXTO');
