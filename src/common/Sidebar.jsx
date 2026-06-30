import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getCartTotal, removeItem } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { data: cartProducts, totalAmount } = useSelector(
    (state) => state.cart
  );

  const cartSelector = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartTotal());
  }, [cartSelector, dispatch]);

  const removeItemFromCart = (itemId) => {
    dispatch(removeItem({ id: itemId }));
    dispatch(getCartTotal());
  };

  const handleCheckout = () => {
    closeSidebar();
    if (!currentUser) {
      // Jos käyttäjä ei ole kirjautunut, ohjataan kirjautumissivulle
      navigate('/login');
    } else {
      // Ohjataan kassalle
      navigate('/checkout');
    }
  };

  return (
    <div>
      {isSidebarOpen && (
        //<div className="w-4/4 fixed top-0 right-0 bg-white shadow-lg h-screen z-50 transition-all duration-300 overflow-y-auto">

        <div
          className={`
          fixed top-0 right-0 h-screen bg-[#eceef1] shadow-lg z-50 overflow-y-auto
          transition-transform duration-300 ease-in-out
          w-screen md:w-96
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          font-oswaldVariable
        `}
        >
          {/* Sidebarin yläosa ja sulkemispainike */}

          <div className="border-b border-[#b9975b]/30 mb-4 p-4 flex justify-between items-center bg-[#eceef1]">
            <h1 className="font-racingSansOne text-2xl font-medium">Your Cart</h1>
            <span
              className="cursor-pointer text-gray-600 hover:text-[#e31837] transition-colors"
              onClick={closeSidebar}
            >
              <FaTimes size={24} />
            </span>
          </div>
          <div className="p-4">
            {cartProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xl font-medium mb-6">Your cart is empty</p>
                <Link
                  to="/shop"
                  className="bg-[#e31837] text-white py-3 px-6 rounded-md hover:bg-[#333f48] transition-colors inline-block font-medium"
                  onClick={closeSidebar}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                {cartProducts.map((item, key) => (
                  <div
                    key={key}
                    className="mb-6 border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-24 flex-shrink-0">
                          <img
                            src={item.img}
                            alt="product"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <span
                            className="absolute -top-2 -left-2 bg-white rounded-full p-1 shadow-md text-gray-400 hover:text-[#e31837] cursor-pointer border border-gray-200 transition-colors"
                            onClick={() => removeItemFromCart(item.id)}
                          >
                            <FaTimes size={12} />
                          </span>
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-2 leading-tight">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.category}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end py-1">
                        <p className="font-medium text-[#e31837]">
                          {parseFloat(item.price).toFixed(2)}€
                        </p>
                        <p className="font-bold text-[#e31837]">
                          {(parseFloat(item.price) * item.quantity).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4 mt-2 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-800">Total amount:</span>
                    <span className="text-[#e31837]">
                      {totalAmount.toFixed(2)}€
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    Tax included. Shipping calculated at checkout.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    className="bg-[#e31837] hover:bg-[#333f48] text-white py-3 px-4 w-full rounded-md font-medium transition-colors text-lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>

                  <button
                    className="border border-[#e31837] text-[#e31837] hover:bg-[#e31837] hover:text-[#eceef1] py-3 px-4 w-full rounded-md font-medium transition-colors"
                    onClick={closeSidebar}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
