import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { GiShoppingCart } from 'react-icons/gi';
import { BiHeart, BiGitCompare } from 'react-icons/bi';
import {
  removeItem,
  updateQuantity,
  getCartTotal,
  clearCart,
} from '../redux/cartSlice';
import { useAuth } from '../context/AuthContext';
import PageHeading from '../common/PageHeading';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const {
    data: cartProducts,
    totalAmount,
    totalItems,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartTotal());
  }, [cartProducts, dispatch]);

  // Tuotteen poistaminen korista
  const removeItemFromCart = (itemId) => {
    dispatch(removeItem({ id: itemId }));
    dispatch(getCartTotal());
  };

  // Määrän lisääminen
  const increaseQuantity = (itemId, currentQuantity) => {
    const newQty = currentQuantity + 1;
    dispatch(updateQuantity({ id: itemId, quantity: newQty }));
    dispatch(getCartTotal());
  };

  // Määrän vähentäminen
  const decreaseQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      const newQty = currentQuantity - 1;
      dispatch(updateQuantity({ id: itemId, quantity: newQty }));
      dispatch(getCartTotal());
    }
  };

  // Korin tyhjentäminen
  const handleClearCart = () => {
    if (window.confirm('Haluatko varmasti tyhjentää ostoskorin?')) {
      dispatch(clearCart());
    }
  };

  // Kassalle siirtyminen
  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  // Toimituskulujen laskenta (esimerkki)
  const calculateShipping = () => {
    if (totalAmount >= 150) return 0; // Ilmainen toimitus yli 150€
    return 5.95;
  };

  const shippingCost = calculateShipping();
  const finalTotal = totalAmount + shippingCost;

  if (cartProducts.length === 0) {
    return (
      <div className="bg-[#FFFFFF] w-full min-h-screen">
        <PageHeading home={'HOME'} pagename={'CART'} />
        <div className="w-full px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <GiShoppingCart className="mx-auto text-5xl md:text-6xl text-gray-600 mb-4" />
            <h2 className="font-librecaslon text-xl md:text-2xl font-bold mb-4">
              Your shopping cart is empty
            </h2>
            <p className="font-librecaslon text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
              It looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/shop"
              className="bg-[#E73725] hover:bg-red-700 font-librecaslon text-white font-bold py-3 px-6 rounded-lg inline-flex items-center text-sm md:text-base"
            >
              <GiShoppingCart className="mr-2" />
              Start shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] w-full min-h-screen overflow-x-hidden">
      <PageHeading home={'HOME'} pagename={'CART'} />

      <div className="font-librecaslon bg-[#FFFFFF] w-full px-4 pb-8 md:py-8 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Tuotelistaus */}
            <div className="w-full lg:w-2/3">
              <div className="bg-[#FFFFFF] rounded-lg border border-gray-200 shadow-xl overflow-hidden">
                {/* Otsikko ja toiminnot */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 md:p-6 border-b space-y-2 sm:space-y-0">
                  <h2 className="text-lg md:text-3xl font-medium">
                    Your shopping cart ({totalItems}{' '}
                    {totalItems === 1 ? 'product' : 'products'})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-[#E73725] hover:text-red-800 text-sm md:text-base font-medium self-start sm:self-auto"
                  >
                    Empty cart
                  </button>
                </div>

                {/* Tuotteet */}
                <div className="divide-y divide-gray-200">
                  {cartProducts.map((item) => (
                    <div key={item.id} className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Tuotekuva */}
                        <div className="w-full sm:w-32 md:w-40 flex-shrink-0">
                          <div className="aspect-square sm:aspect-auto sm:h-32 md:h-40">
                            <img
                              src={item.img}
                              alt={item.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>

                        {/* Tuotetiedot */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 break-words">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 text-xs sm:text-sm mb-2">
                                {item.category}
                              </p>
                              <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 hidden sm:block">
                                {item.description}
                              </p>

                              {/* Arvostelut - piilotettu erittäin pienillä näytöillä */}
                              <div className="hidden sm:flex items-center mt-2">
                                <div className="flex text-yellow-500 text-sm">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <span key={i}>★</span>
                                    ))}
                                </div>
                              </div>
                            </div>

                            {/* Poistopainike */}
                            <button
                              onClick={() => removeItemFromCart(item.id)}
                              className="text-gray-400 hover:text-[#E73725] p-1 flex-shrink-0"
                              title="Poista tuote"
                            >
                              <FaTimes className="text-base sm:text-lg" />
                            </button>
                          </div>

                          {/* Hinta ja määräkontrollit */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-gray-600 text-sm">
                                Quantity:
                              </span>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() =>
                                    decreaseQuantity(item.id, item.quantity)
                                  }
                                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity <= 1}
                                >
                                  <FaMinus className="text-xs" />
                                </button>
                                <span className="px-3 py-2 min-w-[2.5rem] text-center text-sm border-l border-r border-gray-300">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    increaseQuantity(item.id, item.quantity)
                                  }
                                  className="p-2 hover:bg-gray-100"
                                >
                                  <FaPlus className="text-xs" />
                                </button>
                              </div>
                            </div>

                            <div className="text-left sm:text-right">
                              <div className="text-lg sm:text-xl font-bold text-[#E73725]">
                                {(
                                  parseFloat(item.price) * item.quantity
                                ).toFixed(2)}
                                €
                              </div>
                              <div className="text-sm text-[#E73725]">
                                {item.price}€ / pcs
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lisätoiminnot - piilotettu pienillä näytöillä */}
                      <div className="hidden md:flex gap-4 mt-4 pt-4 border-t border-gray-200">
                        <button className="flex items-center text-gray-600 hover:text-red-600 text-sm transition-colors">
                          <BiHeart className="mr-1" />
                          Add to wishlist
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-red-600 text-sm transition-colors">
                          <BiGitCompare className="mr-1" />
                          Add to compare
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jatka ostoksia */}
              <div className="mt-4 md:mt-6">
                <Link
                  to="/shop"
                  className="inline-flex items-center text-[#E73725] hover:text-red-800 font-medium text-lg md:text-lg transition-colors"
                >
                  ← Shop
                </Link>
              </div>
            </div>

            {/* Tilausyhteenveto */}
            <div className="w-full lg:w-1/3">
              <div className="bg-[#FFFFFF] rounded-lg border border-gray-200 shadow-xl p-4 md:p-6 lg:sticky lg:top-4">
                <h3 className="text-lg md:text-xl font-medium mb-4 md:mb-6">
                  Order summary
                </h3>

                {/* Hintatiedot */}
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex justify-between text-base md:text-base">
                    <span>Products ({totalItems} kpl)</span>
                    <span className="font-medium">
                      {totalAmount.toFixed(2)}€
                    </span>
                  </div>

                  <div className="flex justify-between text-base md:text-base">
                    <span> Delivery </span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `${shippingCost.toFixed(2)}€`
                      )}
                    </span>
                  </div>

                  {totalAmount < 150 && (
                    <div className="text-base md:text-base text-gray-600 bg-blue-50 p-2 md:p-3 rounded-lg">
                      💡 Order now {(150 - totalAmount).toFixed(2)}€ to get free
                      shipping!
                    </div>
                  )}

                  <hr className="border-gray-200" />

                  <div className="flex justify-between text-base md:text-lg font-medium">
                    <span>In total</span>
                    <span className="text-[#E73725]">
                      {finalTotal.toFixed(2)}€
                    </span>
                  </div>
                </div>

                {/* Alennuskoodi */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Discount code
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    <input
                      type="text"
                      placeholder="Syötä koodi"
                      className="flex-1 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button className="px-3 md:px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 text-base transition-colors">
                      Use it
                    </button>
                  </div>
                </div>

                {/* Checkout-painike */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#E73725] hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg mb-4 transition-colors text-base md:text-base"
                >
                  Go to checkout
                </button>

                {!currentUser && (
                  <p className="text-base md:text-sm text-gray-600 text-center">
                    You must{' '}
                    <Link
                      to="/login"
                      className="text-[#E73725] hover:text-red-800 underline"
                    >
                      to log in
                    </Link>{' '}
                    to continue
                  </p>
                )}

                {/* Turvallinen maksu */}
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="text-center text-base md:text-sm text-gray-600">
                    <p className="mb-2">🔒 Secure payment</p>
                    <div className="flex justify-center space-x-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-base">
                        VismaPay
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-base">
                        PayTrail
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-base">
                        Visa
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-base">
                        Mastercard
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
