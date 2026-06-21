import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Hakee kaikki tuotteet
export const getAllProducts = async () => {
  try {
    const productsQuery = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Hakee tuotteet tietyllä kategorialla
export const getProductsByCategory = async (category) => {
  try {
    const productsQuery = query(
      collection(db, 'products'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error getting ${category} products:`, error);
    throw error;
  }
};

// Hakee yksittäisen tuotteen ID:n perusteella
export const getProductById = async (productId) => {
  try {
    const productDoc = await getDoc(doc(db, 'products', productId));

    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data(),
      };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Hakee tuotteita sivutettuna (pagination)
export const getProductsPaginated = async (
  lastDoc = null,
  itemsPerPage = 8
) => {
  try {
    let productsQuery;

    if (lastDoc) {
      productsQuery = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(itemsPerPage)
      );
    } else {
      productsQuery = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        limit(itemsPerPage)
      );
    }

    const querySnapshot = await getDocs(productsQuery);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { products, lastVisible };
  } catch (error) {
    console.error('Error getting paginated products:', error);
    throw error;
  }
};

// Hakee tuotteita hakusanalla
export const searchProducts = async (searchTerm) => {
  try {
    // Firestore ei suoraan tue full-text searchia, joten haemme kaikki tuotteet
    // ja filtteröimme ne clientilla
    const productsQuery = query(collection(db, 'products'));

    const querySnapshot = await getDocs(productsQuery);
    const allProducts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filtteröidään tuotteet hakusanan perusteella
    const searchTermLower = searchTerm.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTermLower) ||
        product.description.toLowerCase().includes(searchTermLower) ||
        product.category.toLowerCase().includes(searchTermLower)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Hakee suositellut tuotteet (featured)
export const getFeaturedProducts = async (limit = 4) => {
  try {
    const productsQuery = query(
      collection(db, 'products'),
      where('featured', '==', true),
      limit(limit)
    );

    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
};

// Hakee parhaiten arvostellut tuotteet
export const getTopRatedProducts = async (limitCount = 8) => {
  try {
    const productsQuery = query(
      collection(db, 'products'),
      where('averageRating', '>=', 4),
      orderBy('averageRating', 'desc'),
      orderBy('totalRatings', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting top rated products:', error);
    // Jos query epäonnistuu (esim. indeksi puuttuu), palauta tyhjä lista
    return [];
  }
};

// Hakee eniten tykätyt tuotteet
export const getMostLikedProducts = async (limitCount = 8) => {
  try {
    const productsQuery = query(
      collection(db, 'products'),
      where('totalLikes', '>=', 1),
      orderBy('totalLikes', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting most liked products:', error);
    return [];
  }
};

// Formatoi rating-näyttöä varten
export const formatRating = (averageRating, totalRatings) => {
  if (!totalRatings || totalRatings === 0) {
    return 'Ei arvosteluja';
  }

  return `${averageRating.toFixed(1)}/5 (${totalRatings} arvostelua)`;
};

// Generoi tähtisymbolit ratingista
export const generateStars = (rating, maxStars = 5) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Täydet tähdet
  for (let i = 0; i < fullStars; i++) {
    stars.push({ type: 'full', value: '★' });
  }

  // Puoli tähti
  if (hasHalfStar && fullStars < maxStars) {
    stars.push({ type: 'half', value: '☆' }); // Voit käyttää eri symbolia puolitähdelle
  }

  // Tyhjät tähdet
  const remainingStars = maxStars - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push({ type: 'empty', value: '☆' });
  }

  return stars;
};

// Kategorialista
export const CATEGORIES = {
  GIFT_CARDS: 'Lahjakortit',
  SUPPLEMENTS: 'Lisäravinteet',
};
