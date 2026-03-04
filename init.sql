-- Drop existing tables to re-create clean structure
DROP TABLE IF EXISTS order_items;

DROP TABLE IF EXISTS orders;

DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS customers;

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories (id),
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers (id),
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Preparing, Out for Delivery, Delivered, Cancelled
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders (id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products (id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Mock Data
INSERT INTO
    categories (name, description)
VALUES (
        'Pizza',
        'Authentic Neapolitan style pizzas'
    ),
    (
        'Pasta',
        'Fresh handmade pasta'
    ),
    (
        'Dessert',
        'Sweet treats and classic Italian desserts'
    );

INSERT INTO
    products (
        name,
        description,
        price,
        category_id,
        is_available
    )
VALUES (
        'Pizza Margherita',
        'Classic tomato sauce, fresh mozzarella, and aromatic basil.',
        14.99,
        1,
        true
    ),
    (
        'Pasta Carbonara',
        'Creamy sauce with pancetta, egg yolk, and pecorino cheese.',
        16.50,
        2,
        true
    ),
    (
        'Tiramisu',
        'Traditional Italian dessert with coffee and mascarpone.',
        7.00,
        3,
        true
    );

INSERT INTO
    customers (
        first_name,
        last_name,
        email,
        phone,
        address
    )
VALUES (
        'John',
        'Doe',
        'john@example.com',
        '555-1234',
        '123 Main St'
    ),
    (
        'Jane',
        'Smith',
        'jane@example.com',
        '555-5678',
        '456 Oak Ave'
    );

INSERT INTO
    orders (
        customer_id,
        status,
        total_amount,
        notes
    )
VALUES (
        1,
        'Pending',
        21.99,
        'Extra cheese on pizza please'
    ),
    (2, 'Preparing', 33.00, NULL);

INSERT INTO
    order_items (
        order_id,
        product_id,
        quantity,
        unit_price
    )
VALUES (1, 1, 1, 14.99),
    (1, 3, 1, 7.00),
    (2, 2, 2, 16.50);