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
imageUrl text
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










