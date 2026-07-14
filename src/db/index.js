import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('Warning: DATABASE_URL is not set. Database queries will fail.');
}

// Export the neon client
export const sql = databaseUrl ? neon(databaseUrl) : null;

// Initialize the database tables if they do not exist
export async function initDB() {
  if (!sql) {
    throw new Error('Database client not initialized. Check your DATABASE_URL.');
  }

  try {
    // 1. Create Partners Table
    await sql`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        location VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        joined_date DATE DEFAULT CURRENT_DATE
      );
    `;

    // 2. Create Sarees Table
    await sql`
      CREATE TABLE IF NOT EXISTS sarees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        buying_price NUMERIC(10, 2) NOT NULL,
        shipping_cost NUMERIC(10, 2) NOT NULL,
        retail_price NUMERIC(10, 2) NOT NULL,
        admin_profit NUMERIC(10, 2) NOT NULL,
        partner_profit NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Create Orders Table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        saree_id INT REFERENCES sarees(id) ON DELETE RESTRICT,
        partner_id INT REFERENCES partners(id) ON DELETE RESTRICT,
        delivery_address TEXT NOT NULL,
        amount_credited VARCHAR(50) DEFAULT 'NO',
        despatched_status VARCHAR(50) DEFAULT 'NO',
        tracking_number VARCHAR(100),
        delivered_status VARCHAR(50) DEFAULT 'NO',
        ordered_date DATE DEFAULT CURRENT_DATE
      );
    `;

    console.log('Database tables verified/created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
