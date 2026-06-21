import { createSlice } from '@reduxjs/toolkit';

const storeInLocalStorage = (data) => {
  localStorage.setItem('cart', JSON.stringify(data));
};

// Haetaan ostoskori localStoragesta, jos sellainen on
const loadFromLocalStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// Apufunktio serialisoitavien objektien luomiseen
const sanitizeProduct = (product) => {
  // Poistetaan tai muunnetaan ei-serialisoitavat kentät
  const sanitized = { ...product };

  // Muunnetaan Timestamp-objektit Date-objekteiksi ja sitten stringiksi
  if (sanitized.createdAt && typeof sanitized.createdAt.toDate === 'function') {
    sanitized.createdAt = sanitized.createdAt.toDate().toISOString();
  }
  if (sanitized.updatedAt && typeof sanitized.updatedAt.toDate === 'function') {
    sanitized.updatedAt = sanitized.updatedAt.toDate().toISOString();
  }

  // Varmistetaan että rating on serialisoitavassa muodossa
  if (sanitized.rating && Array.isArray(sanitized.rating)) {
    sanitized.rating = sanitized.rating.map((star) => ({
      icon: typeof star.icon === 'string' ? star.icon : '★',
    }));
  }

  // Poistetaan muut mahdolliset ei-serialisoitavat kentät
  const nonSerializableFields = ['_delegate', '_firestore', '_converter'];
  nonSerializableFields.forEach((field) => {
    if (sanitized[field]) {
      delete sanitized[field];
    }
  });

  return sanitized;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    data: loadFromLocalStorage(),
    totalAmount: 0,
    totalItems: 0,
  },
  reducers: {
    addToCart(state, action) {
      // Sanitoidaan tuote ennen lisäämistä
      const sanitizedProduct = sanitizeProduct(action.payload);

      const existingProduct = state.data.find(
        (product) => product.id === sanitizedProduct.id
      );

      if (existingProduct) {
        const tempCart = state.data.map((product) => {
          if (product.id === sanitizedProduct.id) {
            let newQty = product.quantity + sanitizedProduct.quantity;
            let newTotalPrice = newQty * product.price;

            return {
              ...product,
              quantity: newQty,
              totalPrice: newTotalPrice,
            };
          } else {
            return product;
          }
        });

        state.data = tempCart;
        storeInLocalStorage(state.data);
      } else {
        state.data.push(sanitizedProduct);
        storeInLocalStorage(state.data);
      }
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const productIndex = state.data.findIndex((product) => product.id === id);

      if (productIndex !== -1) {
        const updatedProduct = {
          ...state.data[productIndex],
          quantity: Math.max(quantity || 1, 1),
        };

        updatedProduct.totalPrice =
          updatedProduct.price * updatedProduct.quantity;

        state.data[productIndex] = updatedProduct;
        storeInLocalStorage(state.data);
      }
    },

    removeItem(state, action) {
      const tempCart = state.data.filter(
        (product) => product.id !== action.payload.id
      );
      state.data = tempCart;
      storeInLocalStorage(state.data);
    },

    clearCart(state) {
      state.data = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      storeInLocalStorage(state.data);
    },

    getCartTotal(state) {
      console.log('=== CALCULATING CART TOTAL ===');
      console.log('Cart data:', state.data);

      const { totalAmount, totalItems } = state.data.reduce(
        (cartTotal, cartItem) => {
          const price = parseFloat(cartItem.price);
          const quantity = parseInt(cartItem.quantity);

          // Varmista että molemmat ovat valideja numeroita
          if (isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
            console.warn('Invalid cart item:', cartItem);
            return cartTotal; // Ohita virheellinen tuote
          }

          const itemTotal = price * quantity;

          console.log(
            `Item: ${cartItem.title}, Price: ${price}, Qty: ${quantity}, Total: ${itemTotal}`
          );

          cartTotal.totalAmount += itemTotal;
          cartTotal.totalItems += quantity;

          return cartTotal;
        },
        {
          totalAmount: 0,
          totalItems: 0,
        }
      );

      // Varmista että tulos on validi numero
      const finalTotal = parseFloat(totalAmount.toFixed(2));
      const finalItems = totalItems;

      console.log('=== CART TOTAL RESULT ===');
      console.log('Total amount:', finalTotal);
      console.log('Total items:', finalItems);

      state.totalAmount = finalTotal;
      state.totalItems = finalItems;

      // Tallenna myös localStorage päivitettynä
      storeInLocalStorage(state.data);
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  getCartTotal,
} = cartSlice.actions;

export default cartSlice.reducer;
