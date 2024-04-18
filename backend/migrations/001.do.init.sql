CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    profile_pic_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prompts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prompt_text VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE user_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    prompt_id INT NOT NULL,
    rating INT DEFAULT 1000, 
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (prompt_id) REFERENCES prompts(id)
);

CREATE TABLE feed_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clip VARCHAR(255) NOT NULL,
    prompt_id INT NOT NULL,
		answer_options TEXT NOT NULL,  
		correct_answer VARCHAR(255) NOT NULL,
    arrangement ENUM('grid', 'line') NOT NULL,
		randomize_options BOOLEAN DEFAULT True,

    producer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    rating INT DEFAULT 1000,

    FOREIGN KEY (producer_id) REFERENCES users(id),
    FOREIGN KEY (prompt_id)   REFERENCES prompts(id)
);

CREATE TABLE attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    feed_item_id INT NOT NULL,
    success BOOLEAN NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (feed_item_id) REFERENCES feed_items(id)
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE feed_item_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feed_item_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (feed_item_id) REFERENCES feed_items(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
