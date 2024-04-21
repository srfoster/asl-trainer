-- Drop the feed_item_tags junction table first to avoid foreign key constraint issues
DROP TABLE IF EXISTS feed_item_tags;

-- Drop the attempts table
DROP TABLE IF EXISTS attempts;

-- Drop the user_ratings table
DROP TABLE IF EXISTS user_ratings;

-- Drop the feed_items table
DROP TABLE IF EXISTS feed_items;

-- Drop the tags table
DROP TABLE IF EXISTS tags;

-- Drop the categories table
DROP TABLE IF EXISTS categories;

-- Drop the users table last since it has foreign keys referenced by other tables
DROP TABLE IF EXISTS users;
