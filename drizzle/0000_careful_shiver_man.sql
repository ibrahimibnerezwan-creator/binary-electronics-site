CREATE TABLE `brands` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`logo` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brands_slug_unique` ON `brands` (`slug`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`image` text,
	`icon` text,
	`description` text,
	`parent_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'NEW' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`discount_percent` integer NOT NULL,
	`max_uses` integer DEFAULT 100,
	`used_count` integer DEFAULT 0,
	`expires_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_unique` ON `coupons` (`code`);--> statement-breakpoint
CREATE TABLE `newsletter` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_email_unique` ON `newsletter` (`email`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` real NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`total` real NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`address` text NOT NULL,
	`shipping_city` text NOT NULL,
	`payment_method` text NOT NULL,
	`transaction_id` text,
	`payment_status` text DEFAULT 'PENDING' NOT NULL,
	`courier_tracking_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`product_id` text NOT NULL,
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`price` real NOT NULL,
	`compare_price` real,
	`stock` integer DEFAULT 0 NOT NULL,
	`specs` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`category_id` text,
	`brand_id` text,
	`warranty` text,
	`sku` text,
	`weight` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`reviewer_name` text DEFAULT 'Anonymous' NOT NULL,
	`product_id` text NOT NULL,
	`status` text DEFAULT 'pending',
	`admin_reply` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `store_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`password` text NOT NULL,
	`address` text,
	`city` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
