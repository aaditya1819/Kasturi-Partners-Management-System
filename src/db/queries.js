import { sql } from './index.js';

// Reusable queries helper

// --- DASHBOARD QUERY ---
export async function getDashboardStats() {
  if (!sql) {
    return { totalSales: 0, totalRevenue: 0, adminProfit: 0, pendingShipments: 0, partnerProfitDue: 0 };
  }

  try {
    const salesCountResult = await sql`SELECT COUNT(*) FROM orders`;
    const revenueResult = await sql`
      SELECT COALESCE(SUM(s.retail_price), 0) as total 
      FROM orders o 
      JOIN sarees s ON o.saree_id = s.id
    `;
    const adminProfitResult = await sql`
      SELECT COALESCE(SUM(s.admin_profit), 0) as total 
      FROM orders o 
      JOIN sarees s ON o.saree_id = s.id
    `;
    const partnerProfitDueResult = await sql`
      SELECT COALESCE(SUM(s.partner_profit), 0) as total 
      FROM orders o 
      JOIN sarees s ON o.saree_id = s.id
      WHERE o.amount_credited = 'NO' OR o.amount_credited = 'PENDING'
    `;
    const pendingShipmentsResult = await sql`
      SELECT COUNT(*) FROM orders 
      WHERE despatched_status = 'NO'
    `;

    return {
      totalSales: parseInt(salesCountResult[0].count, 10),
      totalRevenue: parseFloat(revenueResult[0].total),
      adminProfit: parseFloat(adminProfitResult[0].total),
      partnerProfitDue: parseFloat(partnerProfitDueResult[0].total),
      pendingShipments: parseInt(pendingShipmentsResult[0].count, 10),
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { totalSales: 0, totalRevenue: 0, adminProfit: 0, pendingShipments: 0, partnerProfitDue: 0 };
  }
}

// --- PARTNERS QUERIES ---
export async function getPartners(search = '') {
  if (!sql) return [];
  try {
    if (search) {
      // Using CONCAT in SQL for safe and proper wildcard search string binding
      return await sql`
        SELECT * FROM partners 
        WHERE name ILIKE CONCAT('%', ${search}::text, '%') 
           OR location ILIKE CONCAT('%', ${search}::text, '%')
        ORDER BY name ASC
      `;
    }
    return await sql`SELECT * FROM partners ORDER BY name ASC`;
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

export async function getPartnerById(id) {
  if (!sql) return null;
  try {
    const result = await sql`SELECT * FROM partners WHERE id = ${id}`;
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching partner:', error);
    return null;
  }
}

export async function getPartnerSales(partnerId) {
  if (!sql) return [];
  try {
    return await sql`
      SELECT o.*, s.name as saree_name, s.retail_price, s.admin_profit, s.partner_profit
      FROM orders o
      JOIN sarees s ON o.saree_id = s.id
      WHERE o.partner_id = ${partnerId}
      ORDER BY o.ordered_date DESC
    `;
  } catch (error) {
    console.error('Error fetching partner sales:', error);
    return [];
  }
}

export async function addPartner(name, phone, location, address) {
  if (!sql) throw new Error('Database client not connected');
  return await sql`
    INSERT INTO partners (name, phone, location, address)
    VALUES (${name}, ${phone}, ${location}, ${address})
    RETURNING *
  `;
}

export async function updatePartner(id, name, phone, location, address, joinedDate) {
  if (!sql) throw new Error('Database client not connected');
  return await sql`
    UPDATE partners
    SET name = ${name},
        phone = ${phone},
        location = ${location},
        address = ${address},
        joined_date = ${joinedDate}
    WHERE id = ${id}
    RETURNING *
  `;
}

export async function deletePartner(id) {
  if (!sql) throw new Error('Database client not connected');
  return await sql`DELETE FROM partners WHERE id = ${id}`;
}

// --- SAREES QUERIES ---
export async function getSarees() {
  if (!sql) return [];
  try {
    return await sql`SELECT * FROM sarees ORDER BY name ASC`;
  } catch (error) {
    console.error('Error fetching sarees:', error);
    return [];
  }
}

export async function addSaree(name, buyingPrice, shippingCost, retailPrice, adminProfit, partnerProfit) {
  if (!sql) throw new Error('Database client not connected');
  return await sql`
    INSERT INTO sarees (name, buying_price, shipping_cost, retail_price, admin_profit, partner_profit)
    VALUES (${name}, ${buyingPrice}, ${shippingCost}, ${retailPrice}, ${adminProfit}, ${partnerProfit})
    RETURNING *
  `;
}

export async function updateSaree(id, name, buyingPrice, shippingCost, retailPrice, adminProfit, partnerProfit) {
  if (!sql) throw new Error('Database client not connected');
  return await sql`
    UPDATE sarees
    SET name = ${name},
        buying_price = ${buyingPrice},
        shipping_cost = ${shippingCost},
        retail_price = ${retailPrice},
        admin_profit = ${adminProfit},
        partner_profit = ${partnerProfit}
    WHERE id = ${id}
    RETURNING *
  `;
}

export async function deleteSaree(id) {
  if (!sql) throw new Error('Database client not connected');
  return await sql`DELETE FROM sarees WHERE id = ${id}`;
}

// --- ORDERS QUERIES ---
export async function getOrders() {
  if (!sql) return [];
  try {
    return await sql`
      SELECT o.*, p.name as partner_name, s.name as saree_name, s.retail_price, s.partner_profit, s.admin_profit
      FROM orders o
      JOIN partners p ON o.partner_id = p.id
      JOIN sarees s ON o.saree_id = s.id
      ORDER BY o.ordered_date DESC, o.id DESC
    `;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function addOrder(sareeId, partnerId, deliveryAddress) {
  if (!sql) throw new Error('Database client not connected');
  return await sql`
    INSERT INTO orders (saree_id, partner_id, delivery_address)
    VALUES (${sareeId}, ${partnerId}, ${deliveryAddress})
    RETURNING *
  `;
}

export async function updateOrderDelivery(id, amountCredited, despatchedStatus, trackingNumber, deliveredStatus) {
  if (!sql) throw new Error('Database client not connected');
  return await sql`
    UPDATE orders
    SET amount_credited = ${amountCredited},
        despatched_status = ${despatchedStatus},
        tracking_number = ${trackingNumber},
        delivered_status = ${deliveredStatus}
    WHERE id = ${id}
    RETURNING *
  `;
}

export async function deleteOrder(id) {
  if (!sql) throw new Error('Database client not connected');
  return await sql`DELETE FROM orders WHERE id = ${id}`;
}
