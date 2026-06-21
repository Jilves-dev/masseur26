import cartReducer from './cartSlice';
import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
  cart: cartReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ohitetaan serialisointi-tarkistus näille action typeille
        ignoredActions: [
          'cart/addToCart',
          'cart/updateQuantity',
          'cart/getCartTotal',
        ],
        // Ohitetaan tietyt polut state-objektissa
        ignoredPaths: ['cart.data.createdAt', 'cart.data.updatedAt'],
      },
    }),
});

export default store;
