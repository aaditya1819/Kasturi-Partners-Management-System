'use server';

import { 
  addPartner, updatePartner, deletePartner,
  addSaree, updateSaree, deleteSaree,
  addOrder, updateOrderDelivery, deleteOrder 
} from '@/db/queries.js';
import { seedDB } from '@/db/seed.js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Initialize and seed database
export async function setupDBAction() {
  await seedDB();
  revalidatePath('/');
  revalidatePath('/partners');
  revalidatePath('/sarees');
  revalidatePath('/orders');
}

// Admin login action
export async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (email === 'aadityadhanwate830@gmail.com' && password === 'aaditya@28') {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return { success: true };
  } else {
    return { success: false, error: 'Invalid email or password.' };
  }
}

// Admin logout action
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  revalidatePath('/');
}

// Create a new reseller partner
export async function createPartnerAction(formData) {
  const name = formData.get('name');
  const phone = formData.get('phone');
  const location = formData.get('location');
  const address = formData.get('address');

  if (!name || !phone || !location || !address) {
    throw new Error('All fields are required.');
  }

  await addPartner(name, phone, location, address);
  
  revalidatePath('/partners');
  revalidatePath('/');
}

// Update an existing reseller partner
export async function updatePartnerAction(id, formData) {
  const name = formData.get('name');
  const phone = formData.get('phone');
  const location = formData.get('location');
  const address = formData.get('address');
  const joinedDate = formData.get('joined_date');

  if (!id || !name || !phone || !location || !address || !joinedDate) {
    throw new Error('All fields are required.');
  }

  await updatePartner(id, name, phone, location, address, joinedDate);
  
  revalidatePath(`/partners/${id}`);
  revalidatePath('/partners');
  revalidatePath('/');
}

// Delete a reseller partner
export async function deletePartnerAction(id) {
  if (!id) {
    throw new Error('Partner ID is required.');
  }

  try {
    await deletePartner(id);
  } catch (error) {
    if (error.message.includes('foreign key constraint')) {
      throw new Error('Cannot delete partner because they have logged sales. Delete their orders first.');
    }
    throw error;
  }
  
  revalidatePath('/partners');
  revalidatePath('/');
  redirect('/partners');
}

// Create a new saree product
export async function createSareeAction(formData) {
  const name = formData.get('name');
  const buyingPrice = parseFloat(formData.get('buying_price'));
  const shippingCost = parseFloat(formData.get('shipping_cost'));
  const retailPrice = parseFloat(formData.get('retail_price'));
  const adminProfit = parseFloat(formData.get('admin_profit'));
  const partnerProfit = parseFloat(formData.get('partner_profit'));
  const addedDate = formData.get('added_date') || new Date().toISOString().split('T')[0];

  if (!name || isNaN(buyingPrice) || isNaN(shippingCost) || isNaN(retailPrice)) {
    throw new Error('Valid Saree Name, Buying Price, Shipping Cost, and Retail Price are required.');
  }

  await addSaree(name, buyingPrice, shippingCost, retailPrice, adminProfit, partnerProfit, addedDate);
  
  revalidatePath('/sarees');
  revalidatePath('/');
}

// Update an existing saree product
export async function updateSareeAction(id, formData) {
  const name = formData.get('name');
  const buyingPrice = parseFloat(formData.get('buying_price'));
  const shippingCost = parseFloat(formData.get('shipping_cost'));
  const retailPrice = parseFloat(formData.get('retail_price'));
  const adminProfit = parseFloat(formData.get('admin_profit'));
  const partnerProfit = parseFloat(formData.get('partner_profit'));
  const addedDate = formData.get('added_date') || new Date().toISOString().split('T')[0];

  if (!id || !name || isNaN(buyingPrice) || isNaN(shippingCost) || isNaN(retailPrice)) {
    throw new Error('Valid Saree Name, Buying Price, Shipping Cost, and Retail Price are required.');
  }

  await updateSaree(id, name, buyingPrice, shippingCost, retailPrice, adminProfit, partnerProfit, addedDate);
  
  revalidatePath('/sarees');
  revalidatePath('/');
}

// Delete a saree product
export async function deleteSareeAction(id) {
  if (!id) {
    throw new Error('Saree ID is required.');
  }

  try {
    await deleteSaree(id);
  } catch (error) {
    if (error.message.includes('foreign key constraint')) {
      throw new Error('Cannot delete saree because it has logged orders. Delete its orders first.');
    }
    throw error;
  }
  
  revalidatePath('/sarees');
  revalidatePath('/');
}

// Log a saree sale order
export async function createOrderAction(formData) {
  const sareeId = parseInt(formData.get('saree_id'), 10);
  const partnerId = parseInt(formData.get('partner_id'), 10);
  const deliveryAddress = formData.get('delivery_address');

  if (isNaN(sareeId) || isNaN(partnerId) || !deliveryAddress) {
    throw new Error('Saree, Reseller Partner, and Delivery Address are required.');
  }

  await addOrder(sareeId, partnerId, deliveryAddress);
  
  revalidatePath('/orders');
  revalidatePath('/partners');
  revalidatePath('/');
}

// Update order status (payment credit, tracking code, delivery)
export async function updateOrderAction(id, amountCredited, despatchedStatus, trackingNumber, deliveredStatus) {
  if (!id) {
    throw new Error('Order ID is required.');
  }

  await updateOrderDelivery(id, amountCredited, despatchedStatus, trackingNumber, deliveredStatus);
  
  revalidatePath('/orders');
  revalidatePath('/partners');
  revalidatePath('/');
}

// Delete an order
export async function deleteOrderAction(id) {
  if (!id) {
    throw new Error('Order ID is required.');
  }

  await deleteOrder(id);
  
  revalidatePath('/orders');
  revalidatePath('/partners');
  revalidatePath('/');
}
