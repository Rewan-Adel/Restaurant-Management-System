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
('Hot Burger', 'Delicious beef burger with Hot sauce', 9.99, 1, '2024-01-01 12:00:00', '2024-01-01 12:00:00'),
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

-- Password = 123456e
INSERT INTO users(username, email, password, role, passResetToken, passResetExpire, createdAt, updatedAt)
VALUE('admin1', 'admin1@gmail.com', '$2b$10$7AKeB75HA66LMe7r9G0lNuHuOuPlm2c6o/.l/IoOXu0l2gKsBYSWW', 'admin', NULL, NULL, '2024-12-14 13:55:42', '2024-12-14 13:55:42'),
('staff 1', 'staff1@gmail.com', '$2b$10$7AKeB75HA66LMe7r9G0lNuHuOuPlm2c6o/.l/IoOXu0l2gKsBYSWW', 'staff', NULL, NULL, '2024-12-14 13:55:42', '2024-12-14 13:55:42'),
('staff 2', 'staff2@gmail.com', '$2b$10$7AKeB75HA66LMe7r9G0lNuHuOuPlm2c6o/.l/IoOXu0l2gKsBYSWW', 'staff', NULL, NULL, '2024-12-14 13:55:42', '2024-12-14 13:55:42'),
('staff 3', 'staff3@gmail.com', '$2b$10$7AKeB75HA66LMe7r9G0lNuHuOuPlm2c6o/.l/IoOXu0l2gKsBYSWW', 'staff', NULL, NULL, '2024-12-14 13:55:42', '2024-12-14 13:55:42'),
('staff 4', 'staff4@gmail.com', '$2b$10$7AKeB75HA66LMe7r9G0lNuHuOuPlm2c6o/.l/IoOXu0l2gKsBYSWW', 'staff', NULL, NULL, '2024-12-14 13:55:42', '2024-12-14 13:55:42');

INSERT INTO orders (userID, total, status, number, createdAt, updatedAt)
VALUES
(1, 25.95, 'completed', 1001, '2024-12-01 09:00:00', '2024-12-01 09:00:00'),
(2, 22.47, 'completed', 1002, '2024-12-05 11:00:00', '2024-12-05 11:00:00'),
(3, 35.97, 'completed', 1003, '2024-12-07 13:00:00', '2024-12-07 13:00:00'),
(4, 23.95, 'completed', 1004, '2024-12-09 15:00:00', '2024-12-09 15:00:00'),
(5, 18.49, 'completed', 1005, '2024-12-10 17:00:00', '2024-12-10 17:00:00'),
(5, 22.47, 'completed', 1006, '2024-12-12 19:00:00', '2024-12-12 19:00:00'),
(2, 15.47, 'completed', 1007, '2024-10-13 09:00:00', '2024-10-13 09:00:00'),
(1, 19.47, 'completed', 1008, '2024-11-14 10:00:00', '2024-11-14 10:00:00'),
(3, 2.49, 'completed', 1009, '2024-11-15 12:00:00', '2024-11-15 12:00:00'),
(3, 12.48, 'completed', 1010, '2024-10-16 14:00:00', '2024-10-16 14:00:00');

INSERT INTO order_items (orderID, itemID, quantity, price)
VALUES
(1, 1, 2, 8.99), 
(1, 2, 1, 9.9), 
(2, 1, 3, 7.49),
(3, 4, 2, 12.99), 
(3, 4, 1, 10.99), 
(4, 1, 2, 6.99), 
(4, 4, 3, 5.49), 
(5, 8, 1, 9.49),
(6, 1, 2, 8.49), 
(7, 10, 3, 3.99), 
(7, 11, 1, 4.49), 
(2, 1, 2, 4.99),
(3, 4, 1, 2.49), 
(1, 14, 2, 2.99),
(4, 4, 1, 9.49),
(2, 4, 1, 9.49),
(4, 10, 1, 9.49); 

select * from order_items;
select * from orders;
-- top items at order_items
select itemID, sum(quantity) as totalSold
from order_items
group by itemID
order by totalSold DESC;

-- top 10 selling items last 30 days
-- items => name, price
-- orders => status
-- order_items => itemID with sum quantity

SELECT i.name, i.price, oi.itemID, sum(oi.quantity) AS totalSold
FROM order_items as oi
JOIN items  AS i ON i.id = oi.itemID
JOIN orders AS o ON o.id = oi.orderID
WHERE o.status = 'completed' AND o.createdAt >= NOW() - INTERVAL 30 DAY
GROUP BY i.id, i.name, i.price
ORDER BY totalSold DESC
LIMIT 10;

