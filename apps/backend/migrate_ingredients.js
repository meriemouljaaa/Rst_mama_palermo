
import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'palermo_db',
    password: 'password',
    port: 5003,
});

async function migrate() {
    try {
        console.log('Starting migration...');
        
        // 1. Add removable_ingredients to products
        await pool.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS removable_ingredients JSONB DEFAULT '[]'
        `);
        console.log('Added removable_ingredients column to products');

        // 2. Add excluded_ingredients to order_items
        await pool.query(`
            ALTER TABLE order_items 
            ADD COLUMN IF NOT EXISTS excluded_ingredients JSONB DEFAULT '[]'
        `);
        console.log('Added excluded_ingredients column to order_items');

        // 3. Update SALADE MIXTE
        const ingredients = ["Eisberg", "Tomates", "Oignons", "Concombres", "Carottes", "Poivrons"];
        await pool.query(`
            UPDATE products 
            SET removable_ingredients = $1 
            WHERE id = 28
        `, [JSON.stringify(ingredients)]);
        console.log('Updated SALADE MIXTE (id: 28) with removable ingredients');

        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
