import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Tykkäysten hallinta
export const toggleLike = async (userId, productId) => {
  try {
    if (!userId) {
      throw new Error('User must be logged in to like products');
    }

    const userInteractionRef = doc(db, 'userInteractions', userId);
    const userInteractionDoc = await getDoc(userInteractionRef);
    const productRef = doc(db, 'products', productId);

    let isLiked = false;

    if (userInteractionDoc.exists()) {
      const data = userInteractionDoc.data();
      const likedProducts = data.likedProducts || [];
      isLiked = likedProducts.includes(productId);

      if (isLiked) {
        // Poista tykkäys
        await updateDoc(userInteractionRef, {
          likedProducts: arrayRemove(productId),
        });

        // Vähennä tuotteen tykkäysten määrää
        await updateDoc(productRef, {
          totalLikes: increment(-1),
        });
      } else {
        // Lisää tykkäys
        await updateDoc(userInteractionRef, {
          likedProducts: arrayUnion(productId),
        });

        // Lisää tuotteen tykkäysten määrää
        await updateDoc(productRef, {
          totalLikes: increment(1),
        });
      }
    } else {
      // Luo uusi käyttäjän vuorovaikutusdokumentti
      await setDoc(userInteractionRef, {
        likedProducts: [productId],
        ratings: {},
        reviews: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Lisää tuotteen tykkäysten määrää
      await updateDoc(productRef, {
        totalLikes: increment(1),
      });
    }

    return !isLiked; // Palauta uusi tila
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Haetaan käyttäjän tykkäykset
export const getUserLikes = async (userId) => {
  try {
    if (!userId) return [];

    const userInteractionRef = doc(db, 'userInteractions', userId);
    const userInteractionDoc = await getDoc(userInteractionRef);

    if (userInteractionDoc.exists()) {
      return userInteractionDoc.data().likedProducts || [];
    }

    return [];
  } catch (error) {
    console.error('Error getting user likes:', error);
    return [];
  }
};

// Arvostelun antaminen
export const rateProduct = async (userId, productId, rating) => {
  try {
    if (!userId) {
      throw new Error('User must be logged in to rate products');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const userInteractionRef = doc(db, 'userInteractions', userId);
    const userInteractionDoc = await getDoc(userInteractionRef);
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);

    let oldRating = 0;
    let hasRatedBefore = false;

    // Tarkista onko käyttäjä arvostellut aiemmin
    if (userInteractionDoc.exists()) {
      const data = userInteractionDoc.data();
      const ratings = data.ratings || {};
      if (ratings[productId]) {
        oldRating = ratings[productId];
        hasRatedBefore = true;
      }
    }

    // Päivitä käyttäjän arvostelu
    if (userInteractionDoc.exists()) {
      await updateDoc(userInteractionRef, {
        [`ratings.${productId}`]: rating,
        updatedAt: new Date(),
      });
    } else {
      await setDoc(userInteractionRef, {
        likedProducts: [],
        ratings: { [productId]: rating },
        reviews: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Päivitä tuotteen arvostelutiedot
    if (productDoc.exists()) {
      const productData = productDoc.data();
      const currentAverage = productData.averageRating || 0;
      const currentTotal = productData.totalRatings || 0;

      let newAverage, newTotal;

      if (hasRatedBefore) {
        // Päivitä olemassa oleva arvostelu
        const sum = currentAverage * currentTotal;
        const newSum = sum - oldRating + rating;
        newAverage = newSum / currentTotal;
        newTotal = currentTotal;
      } else {
        // Uusi arvostelu
        const sum = currentAverage * currentTotal;
        const newSum = sum + rating;
        newTotal = currentTotal + 1;
        newAverage = newSum / newTotal;
      }

      await updateDoc(productRef, {
        averageRating: Number(newAverage.toFixed(1)),
        totalRatings: newTotal,
        updatedAt: new Date(),
      });
    } else {
      // Jos tuotedokumenttia ei ole (ei pitäisi tapahtua)
      console.error('Product document not found:', productId);
    }

    return rating;
  } catch (error) {
    console.error('Error rating product:', error);
    throw error;
  }
};

// Haetaan käyttäjän arvostelut
export const getUserRatings = async (userId) => {
  try {
    if (!userId) return {};

    const userInteractionRef = doc(db, 'userInteractions', userId);
    const userInteractionDoc = await getDoc(userInteractionRef);

    if (userInteractionDoc.exists()) {
      return userInteractionDoc.data().ratings || {};
    }

    return {};
  } catch (error) {
    console.error('Error getting user ratings:', error);
    return {};
  }
};

// Haetaan käyttäjän rating tietylle tuotteelle
export const getUserRatingForProduct = async (userId, productId) => {
  try {
    if (!userId) return 0;

    const userRatings = await getUserRatings(userId);
    return userRatings[productId] || 0;
  } catch (error) {
    console.error('Error getting user rating for product:', error);
    return 0;
  }
};

// Kommentit/arvostelut (tekstimuotoinen)
export const addReview = async (userId, productId, reviewText, userName) => {
  try {
    if (!userId) {
      throw new Error('User must be logged in to add reviews');
    }

    const userInteractionRef = doc(db, 'userInteractions', userId);
    const productRef = doc(db, 'products', productId);

    const review = {
      userId,
      userName: userName || 'Anonymous',
      reviewText,
      createdAt: new Date(),
      likes: 0,
    };

    // Lisää käyttäjän omiin arvosteluihin
    await updateDoc(userInteractionRef, {
      [`reviews.${productId}`]: reviewText,
      updatedAt: new Date(),
    });

    // Lisää tuotteen arvosteluihin
    await updateDoc(productRef, {
      reviews: arrayUnion(review),
      updatedAt: new Date(),
    });

    return review;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Haetaan tuotteen arvostelut
export const getProductReviews = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      return productDoc.data().reviews || [];
    }

    return [];
  } catch (error) {
    console.error('Error getting product reviews:', error);
    return [];
  }
};
