import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createClient } from 'redis';
import pg from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve the uploads directory statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Multer Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Create unique filenames avoiding collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Helper function to delete local images safely
const deleteLocalImage = (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('/uploads/')) return;

    try {
        const filename = imageUrl.split('/uploads/')[1];
        const filePath = path.join(process.cwd(), 'uploads', filename);

        // Don't delete "system" images (seeds) if you want to keep them, 
        // but for a clean app we delete everything that's in /uploads/
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted local image: ${filename}`);
        }
    } catch (err) {
        console.error('Failed to delete local image:', err);
    }
};

// PostgreSQL Pool
const pool = new pg.Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'palermo_db',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

// Redis Client
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Basic Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Upload API
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Return the path that the frontend can use to load the image
        const publicUrl = `http://localhost:3001/uploads/${req.file.filename}`;
        res.json({ url: publicUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Products API
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, 
                   COALESCE((
                       SELECT json_agg(json_build_object('id', v.id, 'name', v.name, 'price', v.price)) 
                       FROM product_variants v 
                       WHERE v.product_id = p.id
                   ), '[]') as variants
            FROM products p 
            ORDER BY p.id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/products', async (req, res) => {
    const { name, description, price, category, image_url, is_available, variants } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            'INSERT INTO products (name, description, price, category_id, image_url, is_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, category, image_url, is_available]
        );
        const productId = result.rows[0].id;

        if (variants && Array.isArray(variants)) {
            for (const variant of variants) {
                await client.query(
                    'INSERT INTO product_variants (product_id, name, price) VALUES ($1, $2, $3)',
                    [productId, variant.name, variant.price]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ ...result.rows[0], variants: variants || [] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url, is_available, variants } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Fetch current product to find the old image
        const oldProductRes = await client.query('SELECT image_url FROM products WHERE id = $1', [id]);
        const oldImageUrl = oldProductRes.rows[0]?.image_url;

        const result = await client.query(
            'UPDATE products SET name = $1, description = $2, price = $3, category_id = $4, image_url = $5, is_available = $6 WHERE id = $7 RETURNING *',
            [name, description, price, category, image_url, is_available, id]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update variants: delete and recreate for simplicity (can be optimized)
        await client.query('DELETE FROM product_variants WHERE product_id = $1', [id]);
        if (variants && Array.isArray(variants)) {
            for (const variant of variants) {
                await client.query(
                    'INSERT INTO product_variants (product_id, name, price) VALUES ($1, $2, $3)',
                    [id, variant.name, variant.price]
                );
            }
        }

        // If image has changed and old one was local, delete it
        if (oldImageUrl && oldImageUrl !== image_url) {
            deleteLocalImage(oldImageUrl);
        }

        await client.query('COMMIT');
        res.json({ ...result.rows[0], variants: variants || [] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch product to get image URL before deleting
        const productRes = await pool.query('SELECT image_url FROM products WHERE id = $1', [id]);
        const imageUrl = productRes.rows[0]?.image_url;

        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

        // Delete the associated image file if it exists
        if (imageUrl) {
            deleteLocalImage(imageUrl);
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Categories API
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/categories', async (req, res) => {
    const { name, description, parent_id, image_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO categories (name, description, parent_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, parent_id || null, image_url || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, parent_id, image_url } = req.body;
    try {
        // Fetch current category to find the old image
        const oldCatRes = await pool.query('SELECT image_url FROM categories WHERE id = $1', [id]);
        const oldImageUrl = oldCatRes.rows[0]?.image_url;

        const result = await pool.query(
            'UPDATE categories SET name = $1, description = $2, parent_id = $3, image_url = $4 WHERE id = $5 RETURNING *',
            [name, description, parent_id || null, image_url || null, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });

        // If image has changed and old one was local, delete it
        if (oldImageUrl && oldImageUrl !== image_url) {
            deleteLocalImage(oldImageUrl);
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch category to get image URL before deleting
        const catRes = await pool.query('SELECT image_url FROM categories WHERE id = $1', [id]);
        const imageUrl = catRes.rows[0]?.image_url;

        const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });

        // Delete the associated image file if it exists
        if (imageUrl) {
            deleteLocalImage(imageUrl);
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Customers API
app.get('/api/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/customers', async (req, res) => {
    let { first_name, last_name, email, phone, address } = req.body;
    try {
        if (!email || email.trim() === '') {
            email = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}@guest.local`;
        }

        const result = await pool.query(
            `INSERT INTO customers (first_name, last_name, email, phone, address) 
             VALUES ($1, $2, $3, $4, $5) 
             ON CONFLICT (email) 
             DO UPDATE SET 
               first_name = EXCLUDED.first_name, 
               last_name = EXCLUDED.last_name, 
               phone = EXCLUDED.phone, 
               address = EXCLUDED.address
             RETURNING *`,
            [first_name, last_name, email, phone, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Customer Creation Error:", err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Orders API
app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                o.*, 
                c.first_name, 
                c.last_name, 
                c.email,
                c.phone,
                c.address,
                COALESCE((
                    SELECT json_agg(json_build_object(
                        'id', oi.id,
                        'product_name', COALESCE(oi.product_name, p.name, 'Article Web'),
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price
                    ))
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = o.id
                ), '[]') as items
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch Orders Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/orders', async (req, res) => {
    const { customer_id, total_amount, notes, items } = req.body;
    console.log("New Order Items:", JSON.stringify(items, null, 2));
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const orderResult = await client.query(
            'INSERT INTO orders (customer_id, total_amount, notes) VALUES ($1, $2, $3) RETURNING *',
            [customer_id, total_amount, notes]
        );
        const orderId = orderResult.rows[0].id;

        if (items && items.length > 0) {
            const itemQueries = items.map(item =>
                client.query(
                    'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, variant_name) VALUES ($1, $2, $3, $4, $5, $6)',
                    [orderId, item.product_id, item.product_name, item.quantity, item.unit_price, item.variant_name || null]
                )
            );
            await Promise.all(itemQueries);
        }
        await client.query('COMMIT');

        // Fetch full order data for the websocket broadcast
        const fullOrderRes = await client.query(`
            SELECT 
                o.*, c.first_name, c.last_name, c.email, c.phone, c.address,
                COALESCE((
                    SELECT json_agg(json_build_object(
                        'id', oi.id,
                        'product_name', COALESCE(oi.product_name, p.name, 'Article Web'),
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'variant_name', oi.variant_name
                    ))
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = o.id
                ), '[]') as items
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.id = $1
        `, [orderId]);

        const fullOrder = fullOrderRes.rows[0];

        // Notify via websocket with ALL details
        io.emit('newOrder', fullOrder);

        res.status(201).json(fullOrder);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Order Creation Error:", err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    } finally {
        client.release();
    }
});

app.put('/api/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

        // Broadcast the update
        io.emit('orderStatusChanged', { orderId: id, status });

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Dashboard Analytics API
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];

        const totalRevenueResult = await pool.query("SELECT COALESCE(SUM(total_amount), 0) AS value FROM orders WHERE status != 'Cancelled'");
        const todayRevenueResult = await pool.query(`SELECT COALESCE(SUM(total_amount), 0) AS value FROM orders WHERE status != 'Cancelled' AND created_at >= '${todayStr}'`);
        const todayOrdersResult = await pool.query(`SELECT COUNT(*) AS value FROM orders WHERE created_at >= '${todayStr}'`);
        const totalCustomersResult = await pool.query('SELECT COUNT(*) AS value FROM customers');

        res.json({
            totalRevenue: parseFloat(totalRevenueResult.rows[0].value),
            todayRevenue: parseFloat(todayRevenueResult.rows[0].value),
            todayOrders: parseInt(todayOrdersResult.rows[0].value, 10),
            totalCustomers: parseInt(totalCustomersResult.rows[0].value, 10),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// WebSockets for Orders
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Example: Admin sends order status update
    socket.on('updateOrderStatus', (data) => {
        // data: { orderId: 123, status: 'Out for Delivery' }
        console.log(`Order ${data.orderId} status changed to ${data.status}`);

        // Broadcast to all connected clients (e.g., kitchen & customer)
        io.emit('orderStatusChanged', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        // Await minimal setups
        // await redisClient.connect();
        // console.log('Connected to Redis');

        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

startServer();
