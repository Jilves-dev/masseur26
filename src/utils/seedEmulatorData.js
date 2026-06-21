// seedEmulatorData.js - Freewheel Bikes
// Uses the Firebase Emulator REST API with 'Bearer owner' to bypass security rules.
// getDocs (read) still uses the client SDK since products allow read: if true.
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const testProducts = [
  {
    id: 'bike-1',
    title: 'Mountain Bike Pro 29"',
    price: 899.99,
    category: 'Bikes',
    img: '/images/banner1.jpg',
    description: 'High-performance mountain bike with 29" wheels and hydraulic disc brakes',
    short_description: 'Pro mountain bike',
    tag: 'NEW',
    stock: 8,
    averageRating: 4.8,
    totalRatings: 14,
    totalLikes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'bike-2',
    title: 'City Commuter 7-speed',
    price: 499.99,
    category: 'Bikes',
    img: '/images/banner1.jpg',
    description: 'Comfortable city bike with 7-speed gearing and integrated front and rear lights',
    short_description: 'City commuter bike',
    tag: 'SALE',
    stock: 12,
    averageRating: 4.5,
    totalRatings: 22,
    totalLikes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'bike-3',
    title: 'Road Bike Carbon Elite',
    price: 1499.99,
    category: 'Bikes',
    img: '/images/banner3.jpg',
    description: 'Lightweight carbon frame road bike with Shimano 105 groupset',
    short_description: 'Carbon road bike',
    tag: 'HOT',
    stock: 4,
    averageRating: 4.9,
    totalRatings: 9,
    totalLikes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'bike-4',
    title: 'Kids Bike 20"',
    price: 299.99,
    category: 'Bikes',
    img: '/images/kb20.jpg',
    description: 'Durable and lightweight kids bike with hand brakes and 6-speed gearing',
    short_description: 'Kids 20" bike',
    tag: 'NEW',
    stock: 15,
    averageRating: 4.6,
    totalRatings: 11,
    totalLikes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'parts-1',
    title: 'Shimano Deore Brake Set',
    price: 89.99,
    category: 'Parts',
    img: '/images/sbset.jpg',
    description: 'Shimano Deore hydraulic disc brake set, front and rear included',
    short_description: 'Shimano brake set',
    tag: 'NEW',
    stock: 25,
    averageRating: 4.7,
    totalRatings: 18,
    totalLikes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'parts-2',
    title: 'KMC Chain 11-speed',
    price: 34.99,
    category: 'Parts',
    img: '/images/c11.jpg',
    description: 'KMC X11 chain for 11-speed drivetrains, 116 links',
    short_description: '11-speed chain',
    tag: 'SALE',
    stock: 40,
    averageRating: 4.4,
    totalRatings: 30,
    totalLikes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'repairs-1',
    title: 'Full Service Package',
    price: 79.99,
    category: 'Repairs',
    img: '/images/banner1.jpg',
    description: 'Complete bike service: cleaning, lubrication, brake and gear adjustment, safety check',
    short_description: 'Full bike service',
    tag: 'NEW',
    stock: 50,
    averageRating: 4.9,
    totalRatings: 45,
    totalLikes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'repairs-2',
    title: 'Flat Tire Repair',
    price: 14.99,
    category: 'Repairs',
    img: '/images/banner3.jpg',
    description: 'Quick professional flat tire repair, tube replacement included',
    short_description: 'Flat tire repair',
    tag: 'SALE',
    stock: 100,
    averageRating: 4.8,
    totalRatings: 60,
    totalLikes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'repairs-3',
    title: 'Brake Adjustment',
    price: 24.99,
    category: 'Repairs',
    img: '/images/banner1.jpg',
    description: 'Professional brake adjustment and cable replacement for optimal stopping power',
    short_description: 'Brake adjustment',
    tag: 'HOT',
    stock: 50,
    averageRating: 4.7,
    totalRatings: 35,
    totalLikes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Convert a JS value to Firestore REST API value format
const toFirestoreValue = (value) => {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'string') return { stringValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, toFirestoreValue(v)])
        ),
      },
    };
  }
  return { stringValue: String(value) };
};

const toFirestoreDoc = (data) => ({
  fields: Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)])
  ),
});

export const seedEmulatorData = async () => {
  try {
    console.log('🌱 Seeding emulator data...');

    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const baseUrl = `http://localhost:8080/v1/projects/${projectId}/databases/(default)/documents`;

    for (const product of testProducts) {
      const url = `${baseUrl}/products/${product.id}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer owner',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toFirestoreDoc(product)),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }
      console.log(`✅ Added product: ${product.title}`);
    }

    console.log('✅ Emulator data seeded successfully!');
    return { success: true, count: testProducts.length };
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    return { success: false, error: error.message };
  }
};

export const checkEmulatorData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    console.log('📊 Products in emulator:', querySnapshot.size);
    return querySnapshot.size > 0;
  } catch (error) {
    console.error('Error checking data:', error);
    return false;
  }
};
