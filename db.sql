CREATE DATABASE restaurant;
use restaurant;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    passResetToken VARCHAR(255),
    passResetExpire DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE items(
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
    categoryID INTEGER,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryID) REFERENCES categories(id) 
);

CREATE TABLE orders(
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
    userID INTEGER,
    total DECIMAL(10,2),
	status ENUM('pending', 'completed','cancelled' ,'expired') DEFAULT 'pending',
	number INTEGER,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (userID) REFERENCES users(id) 
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    orderID INTEGER NOT NULL,
    itemID INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderID) REFERENCES orders(id),
    FOREIGN KEY (itemID) REFERENCES items(id)
);


INSERT INTO categories (name)
VALUES ('Burgers'), ('Pizza'), ('Sandwiches'),
('Salads'), ('Coffee'), ('Fresh Juices'), ('Sodas'), ('Pasta');

INSERT INTO items (name, description, price, categoryID, createdAt, updatedAt)
VALUES
('Classic Burger', 'Delicious beef burger with cheese', 8.99, 1, '2024-01-01 12:00:00', '2024-01-01 12:00:00'),
('Hot Burger', 'Delicious beef burger with Hot souce', 9.99, 1, '2024-01-01 12:00:00', '2024-01-01 12:00:00'),
('Chicken Burger', 'Grilled chicken burger with lettuce', 7.49, 1, '2024-01-02 13:00:00', '2024-01-02 13:00:00'),
('Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 12.99, 2, '2024-01-03 14:00:00', '2024-01-03 14:00:00'),
('Veggie Pizza', 'Pizza with fresh vegetables', 10.99, 2, '2024-01-04 15:00:00', '2024-01-04 15:00:00'),
('Turkey Sandwich', 'Fresh turkey sandwich with mayo', 6.99, 3, '2024-01-05 16:00:00', '2024-01-05 16:00:00'),
('Grilled Cheese', 'Classic grilled cheese sandwich', 5.49, 3, '2024-01-06 17:00:00', '2024-01-06 17:00:00'),
('Caesar Salad', 'Caesar salad with croutons and dressing', 9.49, 4, '2024-01-07 18:00:00', '2024-01-07 18:00:00'),
('Greek Salad', 'Greek salad with olives and feta cheese', 8.49, 4, '2024-01-08 19:00:00', '2024-01-08 19:00:00'),
('Americano', 'Hot Americano coffee', 3.99, 5, '2024-01-09 10:00:00', '2024-01-09 10:00:00'),
('Latte', 'Creamy latte coffee', 4.49, 5, '2024-01-10 11:00:00', '2024-01-10 11:00:00'),
('Orange Juice', 'Freshly squeezed orange juice', 4.99, 6, '2024-01-11 12:00:00', '2024-01-11 12:00:00'),
('Apple Juice', 'Fresh apple juice', 4.49, 6, '2024-01-12 13:00:00', '2024-01-12 13:00:00'),
('Cola', 'Classic cola soft drink', 2.49, 7, '2024-01-13 14:00:00', '2024-01-13 14:00:00'),
('Lemon Soda', 'Refreshing lemon soda', 2.99, 7, '2024-01-14 15:00:00', '2024-01-14 15:00:00'),
('BBQ Burger', 'Burger with smoky BBQ sauce', 9.49, 1, '2024-01-15 16:00:00', '2024-01-15 16:00:00'),
('Cheese Pizza', 'Pizza with double mozzarella cheese', 11.99, 2, '2024-01-16 17:00:00', '2024-01-16 17:00:00'),
('Chicken Caesar Salad', 'Caesar salad topped with grilled chicken', 10.99, 4, '2024-01-17 18:00:00', '2024-01-17 18:00:00'),
('Espresso', 'Strong and rich espresso', 2.99, 5, '2024-01-18 19:00:00', '2024-01-18 19:00:00'),
('Pineapple Juice', 'Fresh pineapple juice', 5.49, 6, '2024-01-19 20:00:00', '2024-01-19 20:00:00'),
('Diet Cola', 'Low-calorie cola soft drink', 2.49, 7, '2024-01-20 21:00:00', '2024-01-20 21:00:00');

INSERT INTO users(username, email, password, role, passResetToken, passResetExpire, createdAt, updatedAt)
VALUE('admin1', 'admin1@gmail.com', '$2b$10$7AKeB75HA66LMe7r9G0lNuHuOuPlm2c6o/.l/IoOXu0l2gKsBYSWW', 'admin', NULL, NULL, '2024-12-14 13:55:42', '2024-12-14 13:55:42');
