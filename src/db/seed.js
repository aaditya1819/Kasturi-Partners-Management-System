import { sql, initDB } from './index.js';

export async function seedDB() {
  console.log('Starting database seeding...');
  await initDB();

  try {
    // 1. Seed Partners
    let partnerMap = {};

    console.log('Seeding partners...');
    const samplePartners = [
      {
        name: 'Mrs. Archna Sandip khalane',
        phone: '94059 36252',
        location: 'Dhule',
        address: 'Dhankrushna, gulmohar colony, dhule',
        joined_date: '2026-07-14'
      },
      {
        name: 'Charu Shila Kadam',
        phone: '72180 21011',
        location: 'Nashik',
        address: 'Flat number 7 Abhijeet apartment 1, Gurudwara singhada Tala, Mumbai Naka Nashik',
        joined_date: '2026-07-14'
      },
      {
        name: 'Mrs. Jyoti Vishal Marathe',
        phone: '84120 19221',
        location: 'Dhule',
        address: 'Dhule',
        joined_date: '2026-07-14'
      },
      {
        name: 'Jayshri Rahul Gaikwad',
        phone: '75886 16245',
        location: 'Nashik',
        address: 'Nashik',
        joined_date: '2026-07-14'
      },
      {
        name: 'Komal Dorge',
        phone: '98604 63374',
        location: 'Tathvade, Pune',
        address: 'Salunkhe viharFlat sudhakar fitness mage juna tollnaka wadgaon bk pune 411041',
        joined_date: '2026-07-14'
      },
      {
        name: 'Manasi mahesh pawar',
        phone: '70200 51784',
        location: 'Chiplun',
        address: 'post-sawarde,tal-chiplun, dist-ratnagiri 415606',
        joined_date: '2026-07-14'
      },
      {
        name: 'Anuradha chavan',
        phone: '72187 53764',
        location: 'Sangvi pune',
        address: 'Mulanagar juni Sangvi pune',
        joined_date: '2026-07-14'
      },
      {
        name: 'Manisha karvekar',
        phone: '80807 02250',
        location: 'Dhyari, Pune',
        address: 'Dhyari phata near Ganpati jewellers pune',
        joined_date: '2026-07-14'
      },
      {
        name: 'Archana vadodkar',
        phone: '93732 32303',
        location: 'Dhyari, Pune',
        address: 'Dsk vishwa dhayri pune',
        joined_date: '2026-07-14'
      },
      {
        name: 'Apurva Shobhane',
        phone: '70204 45312',
        location: 'Indira Nagar, nashik',
        address: 'Indira Nagar, nashik',
        joined_date: '2026-07-14'
      },
      {
        name: 'Pratiksha Prashant Gawali',
        phone: '77579 93222',
        location: 'dist- Palghar',
        address: 'at. Chinchoti gawali pada, Po. Kaman, tal- vasai, dist- Palghar',
        joined_date: '2026-07-14'
      },
      {
        name: 'Sonali Sunil Pathak',
        phone: '8208166144',
        location: 'Bhusawal',
        address: 'Shri Ganesh Apartment Flat no. 01, Gajanan Maharaj Nagar, Near Gopal Nagar Police Station, Near New Nagar Palika Bhusawal 425201',
        joined_date: '2026-07-14'
      },
      {
        name: 'Snehal Bhosale',
        phone: '93708 60964',
        location: 'lohegaon pune',
        address: 'Swami samrath nagar lohegaon pune -47',
        joined_date: '2026-07-14'
      },
      {
        name: 'Suvarna Marawadkar',
        phone: '97664 88678',
        location: 'Pune',
        address: 'At post walchand nagar\nTal. Indapur\nDist. Pune\nPin 413114',
        joined_date: '2026-07-14'
      },
      {
        name: 'Diksha anil biradar',
        phone: '80101 26124',
        location: 'malwadi pune',
        address: 'Tushar recidancy shinde phool shivane near by Harishkumar store, Warje malwadi pune',
        joined_date: '2026-07-26'
      },
      {
        name: 'Anila chouhan',
        phone: '88885 74739',
        location: 'pashan pune',
        address: 'Sutarwadi, pashan, pune-21',
        joined_date: '2026-07-27'
      },
      {
        name: 'Karishma sangale',
        phone: '82638 86866',
        location: 'baramati pune',
        address: 'At post malad\nTal baramati\nDist pune',
        joined_date: '2026-07-28'
      }
    ];

    for (const partner of samplePartners) {
      const existing = await sql`SELECT id FROM partners WHERE phone = ${partner.phone}`;
      if (existing.length === 0) {
        const result = await sql`
          INSERT INTO partners (name, phone, location, address, joined_date)
          VALUES (${partner.name}, ${partner.phone}, ${partner.location}, ${partner.address}, ${partner.joined_date})
          RETURNING id, name
        `;
        partnerMap[result[0].name] = result[0].id;
        console.log(`Successfully seeded partner: ${partner.name}`);
      } else {
        partnerMap[partner.name] = existing[0].id;
        console.log(`Partner already exists: ${partner.name}`);
      }
    }
    console.log('Seeded partners successfully.');

    // 2. Seed Sarees
    let sareeMap = {};
    const sampleSarees = [
      {
        name: 'Green Tea Batic',
        buying_price: 480,
        shipping_cost: 120,
        retail_price: 780,
        admin_profit: 90,
        partner_profit: 90,
        added_date: '2026-07-14'
      },
      {
        name: 'Nandani Batic',
        buying_price: 230,
        shipping_cost: 130,
        retail_price: 470,
        admin_profit: 55,
        partner_profit: 55,
        added_date: '2026-07-14'
      }
    ];

    for (const saree of sampleSarees) {
      const existing = await sql`SELECT id FROM sarees WHERE name = ${saree.name}`;
      if (existing.length === 0) {
        const result = await sql`
          INSERT INTO sarees (name, buying_price, shipping_cost, retail_price, admin_profit, partner_profit, added_date)
          VALUES (${saree.name}, ${saree.buying_price}, ${saree.shipping_cost}, ${saree.retail_price}, ${saree.admin_profit}, ${saree.partner_profit}, ${saree.added_date})
          RETURNING id, name
        `;
        sareeMap[result[0].name] = result[0].id;
        console.log(`Successfully seeded saree: ${saree.name}`);
      } else {
        sareeMap[saree.name] = existing[0].id;
        console.log(`Saree already exists: ${saree.name}`);
      }
    }
    console.log('Seeded sarees successfully.');

    // 3. Seed Orders
    const orderCountResult = await sql`SELECT COUNT(*) FROM orders`;
    const orderCount = parseInt(orderCountResult[0].count, 10);

    if (orderCount === 0) {
      console.log('Seeding orders...');
      const manasiId = partnerMap['Manasi mahesh pawar'];
      const greenTeaId = sareeMap['Green Tea Batic'];
      const nandaniId = sareeMap['Nandani Batic'];

      if (manasiId && greenTeaId) {
        await sql`
          INSERT INTO orders (saree_id, partner_id, delivery_address, amount_credited, despatched_status, tracking_number, delivered_status, ordered_date)
          VALUES (
            ${greenTeaId}, 
            ${manasiId}, 
            'Supriya Sanjay shinde. At-post dapoli, (kokambali), Pin-415712', 
            'YES', 
            'YES', 
            '26212200253428', 
            'NO', 
            '2026-07-14'
          )
        `;
      }

      if (manasiId && nandaniId) {
        await sql`
          INSERT INTO orders (saree_id, partner_id, delivery_address, amount_credited, despatched_status, tracking_number, delivered_status, ordered_date)
          VALUES (
            ${nandaniId}, 
            ${manasiId}, 
            'post-sawarde, tal-chiplun, dist-ratnagiri 415606', 
            'YES', 
            'YES', 
            '26212200253429', 
            'NO', 
            '2026-07-14'
          )
        `;
      }
      console.log('Seeded orders successfully.');
    } else {
      console.log('Orders table already has data. Skipping seeding.');
    }

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
