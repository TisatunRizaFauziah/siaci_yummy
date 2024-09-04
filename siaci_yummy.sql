<<<<<<< HEAD
-- Create table: User
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table: Product
CREATE TABLE Product (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name_product VARCHAR(100),
    category VARCHAR(50),
    price VARCHAR(20),
    description TEXT,
    image_1 VARCHAR(255),
    image_2 VARCHAR(255)
);

-- Create table: Size
CREATE TABLE Size (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name_size VARCHAR(20)
);

-- Create table: Stock
CREATE TABLE Stock (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_size INT REFERENCES Size(id) ON DELETE CASCADE,
    id_product INT REFERENCES Product(id) ON DELETE CASCADE,
    quantity INT
);

-- Create table: Cart
CREATE TABLE Cart (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user INT REFERENCES "User"(id) ON DELETE CASCADE,
    id_product INT REFERENCES Product(id) ON DELETE CASCADE,
    id_size INT REFERENCES Size(id) ON DELETE CASCADE,
    total_product INT
);

-- Create table: Wishlist
CREATE TABLE Wishlist (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user INT REFERENCES "User"(id) ON DELETE CASCADE,
    id_product INT REFERENCES Product(id) ON DELETE CASCADE,
    status VARCHAR(20)
);

-- Create table: Order
CREATE TABLE "Order" (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user INT REFERENCES "User"(id) ON DELETE CASCADE,
    id_product INT REFERENCES Product(id) ON DELETE CASCADE,
    id_size INT REFERENCES Size(id) ON DELETE CASCADE,
    payment_method VARCHAR(50),
    address VARCHAR(255),
    status VARCHAR(20),
    no_telp VARCHAR(20),
    total_product INT
);
=======
create table users(
id serial primary key,
username varchar(300),
password varchar(300)
)

create table products(
id serial primary key,
name varchar(225),
price int,
stok int,
imageUrl text,
)

ALTER TABLE users ADD COLUMN role VARCHAR(10) DEFAULT 'user';

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
   
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT 
    o.id AS order_id,
    o.name AS customer_name,
    o.address,
    o.phone,
    o.status,
    oi.product_id,
    p.name AS product_name,
    oi.quantity,
    oi.price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = $1;  -- Replace $1 with the user's ID parameter



CREATE TABLE order_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);



CREATE OR REPLACE FUNCTION move_order_to_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into order_history for each item in the order
    INSERT INTO order_history 
    (order_id, customer_name, address, phone, status, product_name, quantity, price, accepted_at)
    SELECT 
        o.id AS order_id, 
        o.name AS customer_name, 
        o.address, 
        o.phone, 
        oi.status, 
        p.name AS product_name, 
        oi.quantity, 
        oi.price, 
        NOW() AS accepted_at
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = OLD.id;

    -- No need to delete from orders and order_items; ON DELETE CASCADE will handle it
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_move_order_to_history
AFTER DELETE ON orders
FOR EACH ROW
EXECUTE FUNCTION move_order_to_history();










>>>>>>> f9c65f16600fb57cee316b41a5da01fd46c33af9
