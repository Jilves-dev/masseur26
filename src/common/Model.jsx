import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart, getCartTotal, updateQuantity } from '../redux/cartSlice';
import { PiMinus, PiPlus } from 'react-icons/pi';

export const Model = ({ isModalOpen, data, handleClose }) => {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      setQty(1);
      document.body.classList.remove('modal-open');
    }
  }, [isModalOpen]);

  const dispatch = useDispatch();

  const addItemToCart = (item) => {
    if (!item) return;

    let totalPrice = qty * parseFloat(item.price);

    // Luodaan serialisoitava tuote-objekti
    const itemForCart = {
      id: item.id,
      title: item.title,
      price: parseFloat(item.price),
      img: item.img,
      category: item.category,
      description: item.description,
      short_description: item.short_description,
      tag: item.tag,
      quantity: qty,
      totalPrice,
      // Varmistetaan, että rating on serialisoitavassa muodossa
      rating: item.rating
        ? item.rating.map((star) => ({
            icon: typeof star.icon === 'string' ? star.icon : '★',
          }))
        : Array(5).fill({ icon: '★' }),
    };

    // Poistetaan Firestore-spesifiset kentät jotka eivät ole serialisoitavia
    delete itemForCart.createdAt;
    delete itemForCart.updatedAt;
    delete itemForCart._delegate;
    delete itemForCart._firestore;
    delete itemForCart._converter;

    dispatch(addToCart(itemForCart));
    dispatch(getCartTotal());

    // Suljetaan modaali lisäyksen jälkeen
    handleClose();
  };

  const increaseQuantity = (itemId, currentQuantity) => {
    const newQty = currentQuantity + 1;
    setQty(newQty);
    dispatch(updateQuantity({ id: itemId, quantity: newQty }));
  };

  const decreaseQuantity = (itemId, currentQuantity) => {
    const newQty = Math.max(currentQuantity - 1, 1);
    setQty(newQty);
    dispatch(updateQuantity({ id: itemId, quantity: newQty }));
  };

  // Jos ei ole dataa, näytetään tyhjä div
  if (!data) return <div></div>;

  return (
    <>
      <div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content w-2/3 relative">
              <button
                onClick={handleClose}
                className="absolute top-6 left-4 md:top-4 md:right-4 z-50 
                        w-10 h-10 md:w-12 md:h-12
                        bg-white rounded-full shadow-lg 
                        flex items-center justify-center
                        text-gray-700 hover:bg-gray-100 hover:text-[#e31837]
                        transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl md:text-2xl" />
              </button>
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-72 h-64 md:h-80 shrink-0 rounded-lg overflow-hidden bg-[#333f48] flex items-center justify-center">
                  {data.img ? (
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl text-[#b9975b]">
                      {data.icon || '🎁'}
                    </span>
                  )}

                  {data.tag && (
                    <div className="absolute top-3 left-3 z-10 bg-[#b9975b] font-racingSansOne text-[#eceef1] text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shadow">
                      {data.tag}
                    </div>
                  )}
                </div>
                <div className="modal-info ml-0 mt-4 md:ml-6 md:mt-0">
                  <h2 className="font-racingSansOne font-medium text-4xl text-[#333f48]">
                    {data.title}
                  </h2>
                  <p className="font-oswaldVariable mt-4 text-2xl text-[#333f48]">
                    {data.short_description}
                  </p>
                  <div className="flex mb-4 mt-4 text-yellow-700">
                    {/* Näytetään tähdet tekstinä */}
                    {data.rating &&
                      data.rating.map((star, index) => (
                        <span key={index} className="text-yellow-500">
                          {typeof star.icon === 'string' ? star.icon : '★'}
                        </span>
                      ))}
                  </div>
                  <p className="font-oswaldVariable text-[#e31837] text-2xl font-bold">
                    {data.price}€
                  </p>

                  <p className="font-oswaldVariable text-xl mt-2 text-[#333f48]">
                    {data.description}
                  </p>
                  {/* Näytetään koot vain Carpets-kategorialle 
                  {data.category === 'Carpets' && (
                    <div className="flex flex-col items-start mt-4">
                      <p className="font-semibold mb-2">Size: </p>
                      <div className="flex flex-wrap gap-2">
                        <button className="btn pt-1 pb-1 px-2 flex flex-col items-center">
                          <span>Small</span>
                          <span className="text-xs mt-1">160 x 230 cm</span>
                        </button>
                        <button className="btn pt-1 pb-1 px-2 flex flex-col items-center">
                          <span>Medium</span>
                          <span className="text-xs mt-1">200 x 300 cm</span>
                        </button>
                        <button className="btn pt-1 pb-1 px-2 flex flex-col items-center">
                          <span>Large</span>
                          <span className="text-xs mt-1">240 x 340 cm</span>
                        </button>
                      </div>
                    </div>
                  )}*/}
                  <p className="font-oswaldVariable text-green-700 mt-2">
                    In Stock 300 Items
                  </p>
                  <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
                    {/* Määrän valitsin */}
                    <div className="flex">
                      <button
                        className="border p-3 hover:bg-gray-100 transition-colors"
                        onClick={() => decreaseQuantity(data.id, qty)}
                      >
                        <PiMinus />
                      </button>
                      <span className="border-t border-b w-16 text-center p-3 font-semibold">
                        {qty || 1}
                      </span>
                      <button
                        className="border p-3 hover:bg-gray-100 transition-colors"
                        onClick={() => increaseQuantity(data.id, qty)}
                      >
                        <PiPlus />
                      </button>
                    </div>
                    {/* Lisää koriin -nappi */}
                    <div className="addtocart flex-grow">
                      <button
                        className="btn w-full py-3 md:w-auto md:px-6"
                        onClick={() => addItemToCart(data)}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/*import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart, getCartTotal, updateQuantity } from "../redux/cartSlice";
import { PiMinus, PiPlus } from "react-icons/pi";

export const Model = ({ isModalOpen, data, handleClose }) => {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      setQty(1);
      document.body.classList.remove("modal-open");
    }
  }, [isModalOpen]);

  const dispatch = useDispatch();
  const addItemToCart = (item) => {
    if (!item) return;
    
    let totalPrice = qty * parseFloat(item.price);

    // Tässä korjataan rating-kenttä serialisoitavaksi
    // Kopioidaan tuotedata ja käsitellään rating-kenttä
    const itemForCart = {
      ...item,
      quantity: qty,
      totalPrice,
      // Varmistetaan, että rating on serialisoitavassa muodossa
      rating: item.rating ? 
        item.rating.map(star => ({ 
          icon: typeof star.icon === 'string' ? star.icon : "★" 
        })) : 
        Array(5).fill({ icon: "★" })
    };

    dispatch(addToCart(itemForCart));
    dispatch(getCartTotal());
  };

  const increaseQuantity = (itemId, currentQuantity) => {
    const newQty = currentQuantity + 1;
    setQty(newQty);
    dispatch(updateQuantity({ id: itemId, quantity: newQty }));
  };

  const decreaseQuantity = (itemId, currentQuantity) => {
    const newQty = Math.max(currentQuantity - 1, 1);
    setQty(newQty);
    dispatch(updateQuantity({ id: itemId, quantity: newQty }));
  };

  // Jos ei ole dataa, näytetään tyhjä div
  if (!data) return <div></div>;

  return (
    <>
      <div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content w-2/3 relative">
              <span
                onClick={() => handleClose()}
                className="absolute top-0 right-0 p-4 cursor-pointer"
              >
                <FaTimes />
              </span>
              <div className="flex flex-col md:flex-row">
                <div className="relative">
                  <div className="modal-poster">
                    <img
                      src={data.img}
                      alt={data.title}
                      className="max-w-none"
                    />
                  </div>

                  <div className="tag absolute top-0 right-0 z-10">
                    <p className="bg-green-600 m-2 rounded-full w-12 h-12 grid place-items-center text-white">
                      {data.tag}
                    </p>
                  </div>
                </div>
                <div className="modal-info ml-6">
                  <h2 className="text-4xl">{data.title}</h2>
                  <p className="mt-4 text-2xl">{data.short_description}</p>
                  <div className="flex mb-4 mt-4 text-yellow-700">
                     Näytetään tähdet tekstinä 
                    {data.rating &&
                      data.rating.map((star, index) => (
                        <span key={index} className="text-yellow-500">
                          {typeof star.icon === 'string' ? star.icon : "★"}
                        </span>
                      ))}
                  </div>
                  <p className="text-red-600 text-2xl">${data.price}</p>

                  <p className="mt-2">{data.description}</p>

                  <div className="flex items-center">
                    <p className="font-semibold">Size: </p>
                    <div className="size-btn mt-4 mb-4">
                      <button className="ml-2 btn pt-1 pb-1 pr-3 pl-3">
                        Small
                      </button>
                      <button className="ml-2 btn pt-1 pb-1 pr-3 pl-3">
                        Medium
                      </button>
                      <button className="ml-2 btn pt-1 pb-1 pr-3 pl-3">
                        Large
                      </button>
                      <button className="ml-2 btn pt-1 pb-1 pr-3 pl-3">
                        Extra Large
                      </button>
                    </div>
                  </div>
                  <p className="text-green-700">In Stock 300 Items</p>
                  <div className="flex items-center">
                    <div className="flex mr-3">
                      <button
                        className="border mt-4 pt-3 pb-3 pr-6 pl-6"
                        onClick={() => increaseQuantity(data.id, qty)}
                      >
                        <PiPlus />
                      </button>
                      <span className="border mt-4 pt-3 pb-3 pr-6 pl-6 count">
                        {qty || 1}
                      </span>
                      <button
                        className="border mt-4 pt-3 pb-3 pr-6 pl-6"
                        onClick={() => decreaseQuantity(data.id, qty)}
                      >
                        <PiMinus />
                      </button>
                    </div>
                    <div className="addtocart mr-3">
                      <button
                        className="mt-4 btn pt-3 pb-3 pr-6 pl-6"
                        onClick={() => addItemToCart(data)}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};*/
