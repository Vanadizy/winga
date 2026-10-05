-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 06, 2026 at 12:08 AM
-- Server version: 10.11.19-MariaDB-cll-lve
-- PHP Version: 8.4.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pangaleo_uza`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_settings`
--

CREATE TABLE `app_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_settings`
--

INSERT INTO `app_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('trial_days', '2', '2026-10-03 14:15:08');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `target_type` varchar(50) NOT NULL,
  `target_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `category` enum('phone','laptop','computer','accessory','other') DEFAULT 'phone',
  `unique_identifier` varchar(100) NOT NULL,
  `identifier_type` enum('imei','serial') NOT NULL,
  `cost_price` decimal(12,2) NOT NULL,
  `selling_price` decimal(12,2) NOT NULL,
  `condition_status` enum('new','used','refurbished') DEFAULT 'used',
  `description` text DEFAULT NULL,
  `status` enum('available','sold','returned','transferred') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `user_id`, `name`, `brand`, `category`, `unique_identifier`, `identifier_type`, `cost_price`, `selling_price`, `condition_status`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 5, 'google pixel 6', 'google pixel', 'phone', '357403132381349', 'imei', 350000.00, 400000.00, 'new', 'simu imenyooka ila ilikua na kidot kidogo', 'available', '2026-09-23 21:39:09', '2026-09-24 11:05:33'),
(2, 5, 'S8', 'Samsung', 'phone', '1274747271728383817263', 'imei', 10000.00, 150000.00, 'used', '', 'available', '2026-09-24 10:58:48', '2026-09-24 10:58:48'),
(6, 2, 'Sony Experier', 'SONY', 'phone', '357403132381357', 'imei', 350000.00, 400000.00, 'new', 'SIMU HAINA MESSAGE SIMU NI MPYA KABISA', 'sold', '2026-09-28 13:36:25', '2026-09-28 14:08:24'),
(7, 8, 'iphone 11', 'apple', 'phone', '2363748876436409', 'imei', 360000.00, 420000.00, 'used', 'dm only', 'sold', '2026-10-03 10:38:44', '2026-10-03 10:49:36'),
(8, 8, 'iphone 11', 'apple', 'phone', '5463836987469', 'imei', 350000.00, 395000.00, 'used', 'bm', 'sold', '2026-10-03 10:39:21', '2026-10-03 10:48:47'),
(9, 8, 'oneplus', 'oneplus', 'phone', '536587649874', 'imei', 1300000.00, 1400000.00, 'used', 'brand new', 'sold', '2026-10-03 10:40:42', '2026-10-03 10:47:29'),
(12, 9, 'Iphone 11', 'apple', 'phone', '354956463675739', 'imei', 360000.00, 395000.00, 'refurbished', 'dm only', 'sold', '2026-10-03 20:30:07', '2026-10-03 21:10:00'),
(13, 9, 'iphone 11', 'apple', 'phone', '354956463675738', 'imei', 352000.00, 385000.00, 'used', 'bm only', 'sold', '2026-10-03 20:32:26', '2026-10-03 21:08:52'),
(14, 9, 'iphone', 'apple', 'phone', '354956463675734', 'imei', 268000.00, 345000.00, 'used', 'bm only', 'available', '2026-10-03 20:33:16', '2026-10-04 12:16:06'),
(15, 9, 'iphone 11', 'Apple', 'phone', '354956463675730', 'imei', 268000.00, 350000.00, 'refurbished', 'dm only', 'sold', '2026-10-03 20:41:13', '2026-10-03 21:00:13'),
(16, 9, 'OnePlus 13s', 'Android ', 'phone', '6921815622055', 'imei', 1300000.00, 1400000.00, 'new', 'Full box \nNon active ', 'sold', '2026-10-03 20:47:45', '2026-10-03 20:51:12'),
(17, 9, 'iphone 11', 'apple', 'phone', '3549564636757301', 'imei', 268000.00, 345000.00, 'refurbished', 'dm only', 'sold', '2026-10-04 12:20:40', '2026-10-04 12:22:55');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_path`, `is_primary`, `created_at`) VALUES
(1, 1, 'uploads/product_6ab446fd729ee4.28366667.jpeg', 1, '2026-09-23 21:39:09'),
(2, 2, 'uploads/product_6ab502692cf457.32726164.JPG', 1, '2026-09-24 10:58:49'),
(3, 6, 'uploads/product_6aba6d5b35b637.90102675.png', 1, '2026-09-28 13:36:27'),
(5, 16, 'uploads/product_6ac169f2bf21b3.67141356.jpeg', 1, '2026-10-03 20:47:46');

-- --------------------------------------------------------

--
-- Table structure for table `product_requests`
--

CREATE TABLE `product_requests` (
  `id` int(11) NOT NULL,
  `requester_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `preferred_brand` varchar(100) DEFAULT NULL,
  `preferred_model` varchar(150) DEFAULT NULL,
  `max_budget` decimal(12,2) DEFAULT NULL,
  `status` enum('open','accepted','rejected','cancelled','completed') DEFAULT 'open',
  `accepted_by` int(11) DEFAULT NULL,
  `accepted_product_id` int(11) DEFAULT NULL,
  `agreed_price` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_requests`
--

INSERT INTO `product_requests` (`id`, `requester_id`, `title`, `description`, `preferred_brand`, `preferred_model`, `max_budget`, `status`, `accepted_by`, `accepted_product_id`, `agreed_price`, `created_at`, `updated_at`) VALUES
(1, 4, 'Pixel 6 plain', '256 GB, ', NULL, NULL, 390000.00, 'completed', 2, 1, 400000.00, '2026-09-24 03:05:42', '2026-09-24 03:09:52'),
(2, 2, 'Pixel 6', '256 GB', NULL, NULL, 390000.00, 'completed', 4, 1, 400000.00, '2026-09-24 03:12:19', '2026-09-24 03:13:00'),
(3, 5, 'Nahitaji samsung S8', 'Bongo kitonga', NULL, NULL, 100000.00, 'completed', 2, 1, 400000.00, '2026-09-24 11:04:04', '2026-09-24 11:05:33');

-- --------------------------------------------------------

--
-- Table structure for table `product_transfers`
--

CREATE TABLE `product_transfers` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `request_id` int(11) DEFAULT NULL,
  `transfer_price` decimal(12,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `transferred_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_transfers`
--

INSERT INTO `product_transfers` (`id`, `product_id`, `from_user_id`, `to_user_id`, `request_id`, `transfer_price`, `notes`, `transferred_at`) VALUES
(1, 1, 2, 4, 1, 400000.00, NULL, '2026-09-24 03:09:52'),
(2, 1, 4, 2, 2, 400000.00, NULL, '2026-09-24 03:13:00'),
(3, 1, 2, 5, 3, 400000.00, NULL, '2026-09-24 11:05:33');

-- --------------------------------------------------------

--
-- Table structure for table `returns`
--

CREATE TABLE `returns` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `reason` text DEFAULT NULL,
  `refund_amount` decimal(12,2) DEFAULT NULL,
  `returned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `returns`
--

INSERT INTO `returns` (`id`, `sale_id`, `product_id`, `seller_id`, `reason`, `refund_amount`, `returned_at`) VALUES
(6, 12, 14, 9, '', 0.00, '2026-10-04 12:16:06');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `customer_name` varchar(150) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `selling_price` decimal(12,2) NOT NULL,
  `cost_price` decimal(12,2) NOT NULL,
  `profit` decimal(12,2) NOT NULL,
  `payment_method` enum('cash','mobile_money','bank','other') DEFAULT 'cash',
  `notes` text DEFAULT NULL,
  `warranty_months` int(11) NOT NULL DEFAULT 0,
  `warranty_ends_at` date DEFAULT NULL,
  `sold_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `product_id`, `seller_id`, `customer_name`, `customer_phone`, `selling_price`, `cost_price`, `profit`, `payment_method`, `notes`, `warranty_months`, `warranty_ends_at`, `sold_at`) VALUES
(2, 1, 2, 'ALEXANDER ', '0763115132', 370000.00, 350000.00, 20000.00, 'cash', NULL, 1, '2026-10-24', '2026-09-24 03:17:24'),
(3, 6, 2, 'VANADIZY', '06584554', 400000.00, 350000.00, 50000.00, 'cash', NULL, 1, '2026-10-28', '2026-09-28 13:39:58'),
(4, 6, 2, 'juma', '34343434', 400000.00, 350000.00, 50000.00, 'cash', NULL, 0, '2026-09-28', '2026-09-28 13:55:36'),
(5, 6, 2, 'emmanuel', '438493', 400000.00, 350000.00, 50000.00, 'cash', NULL, 0, '2026-09-28', '2026-09-28 14:08:24'),
(6, 9, 8, 'james', '0623239572', 1398000.00, 1300000.00, 98000.00, 'cash', NULL, 12, '2027-10-03', '2026-10-03 10:42:57'),
(7, 9, 8, 'james', '0623239572', 1398000.00, 1300000.00, 98000.00, 'cash', NULL, 12, '2027-10-03', '2026-10-03 10:47:29'),
(8, 8, 8, 'alex', '075346478', 395000.00, 350000.00, 45000.00, 'cash', NULL, 2, '2026-12-03', '2026-10-03 10:48:47'),
(9, 7, 8, 'paul', '072348636', 420000.00, 360000.00, 60000.00, 'cash', NULL, 3, '2027-01-03', '2026-10-03 10:49:36'),
(10, 16, 9, 'Victor ngaiza', '0620660656', 1400000.00, 1300000.00, 100000.00, 'bank', NULL, 12, '2027-10-03', '2026-10-03 20:51:12'),
(11, 15, 9, 'mau', '0786754367', 350000.00, 268000.00, 82000.00, 'cash', NULL, 3, '2027-01-03', '2026-10-03 21:00:13'),
(12, 14, 9, 'mawe', '0614046429', 345000.00, 268000.00, 77000.00, 'cash', NULL, 3, '2027-01-03', '2026-10-03 21:02:34'),
(13, 13, 9, 'tembaz', '0', 385000.00, 352000.00, 33000.00, 'cash', NULL, 3, '2027-01-03', '2026-10-03 21:08:52'),
(14, 12, 9, 'pasino', '0', 395000.00, 360000.00, 35000.00, 'cash', NULL, 3, '2027-01-03', '2026-10-03 21:10:00'),
(15, 17, 9, 'mawe istore', '0614046329', 345000.00, 268000.00, 77000.00, 'cash', NULL, 3, '2027-01-04', '2026-10-04 12:22:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `shop_name` varchar(150) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `role` enum('seller','admin') DEFAULT 'seller',
  `status` enum('active','suspended') DEFAULT 'active',
  `trial_ends_at` datetime DEFAULT NULL,
  `subscription_start_at` datetime DEFAULT NULL,
  `subscription_end_at` datetime DEFAULT NULL,
  `subscription_status` enum('trial','active','expired') NOT NULL DEFAULT 'trial',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `shop_name`, `phone`, `email`, `password`, `profile_image`, `role`, `status`, `trial_ends_at`, `subscription_start_at`, `subscription_end_at`, `subscription_status`, `created_at`, `updated_at`) VALUES
(2, 'EMMANUEL CHARLES', 'KACHEHUB', '0628115130', 'vanadizyemachazy@gmail.com', '$2y$10$i1Hmt1SHyNE8ofoyoTUtoeAI6VWcM3MwhtLdVoZdbZwDi8MQeJ7lS', NULL, 'seller', 'active', '2026-09-26 04:09:02', '2026-09-28 14:05:34', '2026-10-28 14:05:34', 'active', '2026-09-20 21:58:10', '2026-09-28 13:05:34'),
(3, 'WINGA Administrator', 'WINGA OFFICIAL', 'ADMIN001', NULL, '$2y$10$hA.hMX4QWeuupcIEz/f.yugeFy/M8gIndqYsnfi7hvNLAy0aBjJaC', NULL, 'admin', 'active', NULL, NULL, NULL, 'active', '2026-09-23 21:05:21', '2026-09-24 10:56:06'),
(4, 'EMMANUEL', 'ELECTRIC SUPPLY', '0763115132', 'emakolimba@gmail.com', '$2y$10$aR/czXqYo1EECFTyR/GIeOIsHaKG3e4snIiUCWZf5.atBxKH.C4n.', NULL, 'seller', 'active', '2026-09-25 03:19:12', NULL, NULL, 'trial', '2026-09-24 02:19:12', '2026-09-24 02:19:12'),
(5, 'Alexander Jackson', 'Gigabytes Stores', '0716483277', 'alexxanderjackson8@gmail.com', '$2y$10$fPVh.hxTpR3/pJ3HY1.DaefOm.KrngqsZVAhLBy1enVCPcLjn2P.u', NULL, 'seller', 'active', '2026-09-28 14:25:05', '2026-09-28 14:26:01', '2027-09-28 14:26:01', 'active', '2026-09-24 10:48:37', '2026-09-28 13:26:01'),
(9, 'Glam', 'Glam_Tz03', '0623239572', 'johnsamuel1298@gmal.com', '$2y$10$BNzRoPeoBQSM.3Xc1yvKv.sBUEkAiWNIwHlp8D7zYAWiaxnsZZKnO', NULL, 'seller', 'active', '2026-10-05 15:20:28', '2026-10-05 22:04:40', '2026-11-05 22:04:40', 'active', '2026-10-03 14:20:28', '2026-10-05 21:04:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audit_created` (`created_at`),
  ADD KEY `actor_id` (`actor_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_identifier` (`unique_identifier`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_requests`
--
ALTER TABLE `product_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requester_id` (`requester_id`),
  ADD KEY `accepted_by` (`accepted_by`),
  ADD KEY `accepted_product_id` (`accepted_product_id`);

--
-- Indexes for table `product_transfers`
--
ALTER TABLE `product_transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `from_user_id` (`from_user_id`),
  ADD KEY `to_user_id` (`to_user_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `returns`
--
ALTER TABLE `returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_requests`
--
ALTER TABLE `product_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_transfers`
--
ALTER TABLE `product_transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `returns`
--
ALTER TABLE `returns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_requests`
--
ALTER TABLE `product_requests`
  ADD CONSTRAINT `product_requests_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `product_requests_ibfk_2` FOREIGN KEY (`accepted_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `product_requests_ibfk_3` FOREIGN KEY (`accepted_product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `product_transfers`
--
ALTER TABLE `product_transfers`
  ADD CONSTRAINT `product_transfers_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `product_transfers_ibfk_2` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `product_transfers_ibfk_3` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `product_transfers_ibfk_4` FOREIGN KEY (`request_id`) REFERENCES `product_requests` (`id`);

--
-- Constraints for table `returns`
--
ALTER TABLE `returns`
  ADD CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
  ADD CONSTRAINT `returns_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `returns_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
