import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import { Heading } from '../common/Heading';
import { BiCart, BiGitCompare, BiHeart, BiSearch } from 'react-icons/bi';
import { Model } from '../common/Model';
import { useDispatch } from 'react-redux';
import { addToCart, getCartTotal } from '../redux/cartSlice';
import { useAuth } from '../context/AuthContext';
import {
  toggleLike,
  getUserLikes,
  rateProduct,
  getUserRatings,
} from '../services/userInteractionService';
import { getTopRatedProducts } from '../services/productService';

export const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [userRatings, setUserRatings] = useState({});
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  /*var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
  };*/

  // Haetaan parhaiten arvostellut tuotteet Firestoresta
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Haetaan parhaiten arvostellut tuotteet
        const topRatedProducts = await getTopRatedProducts(8);

        // Jos ei löydy tarpeeksi parhaiten arvosteltuja, täydennetään kaikista tuotteista
        if (topRatedProducts.length < 8) {
          const { getAllProducts } = await import('../services/productService');
          const allProducts = await getAllProducts();
          const remainingProducts = allProducts
            .filter(
              (product) => !topRatedProducts.find((tp) => tp.id === product.id)
            )
            .slice(0, 8 - topRatedProducts.length);

          setProducts([...topRatedProducts, ...remainingProducts]);
        } else {
          setProducts(topRatedProducts);
        }
      } catch (error) {
        console.error('Error fetching best seller products:', error);
        // Fallback: hae kaikki tuotteet jos parhaiten arvosteltujen haku epäonnistuu
        try {
          const { getAllProducts } = await import('../services/productService');
          const allProducts = await getAllProducts();
          setProducts(allProducts.slice(0, 8));
        } catch (fallbackError) {
          console.error('Error fetching fallback products:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Haetaan käyttäjän tykkäykset ja arvostelut
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userLikes = await getUserLikes(currentUser.uid);
          setLikedProducts(new Set(userLikes));

          const ratings = await getUserRatings(currentUser.uid);
          setUserRatings(ratings);
        } catch (error) {
          console.error('Error fetching user data:', error);
          const savedLikes = localStorage.getItem('likedProducts');
          const savedRatings = localStorage.getItem('userRatings');

          if (savedLikes) {
            setLikedProducts(new Set(JSON.parse(savedLikes)));
          }
          if (savedRatings) {
            setUserRatings(JSON.parse(savedRatings));
          }
        }
      } else {
        const savedLikes = localStorage.getItem('likedProducts');
        const savedRatings = localStorage.getItem('userRatings');

        if (savedLikes) {
          setLikedProducts(new Set(JSON.parse(savedLikes)));
        }
        if (savedRatings) {
          setUserRatings(JSON.parse(savedRatings));
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleOpen = (productid) => {
    setIsModalOpen(productid);
  };

  const handleClose = () => {
    setIsModalOpen(null);
  };

  // Like-toiminto
  const handleLike = async (productId) => {
    if (currentUser) {
      try {
        const newLikeState = await toggleLike(currentUser.uid, productId);
        const newLikedProducts = new Set(likedProducts);
        if (newLikeState) {
          newLikedProducts.add(productId);
        } else {
          newLikedProducts.delete(productId);
        }
        setLikedProducts(newLikedProducts);
        localStorage.setItem(
          'likedProducts',
          JSON.stringify([...newLikedProducts])
        );
      } catch (error) {
        console.error('Error toggling like:', error);
        handleLocalStorageLike(productId);
      }
    } else {
      handleLocalStorageLike(productId);
    }
  };

  const handleLocalStorageLike = (productId) => {
    const newLikedProducts = new Set(likedProducts);
    if (newLikedProducts.has(productId)) {
      newLikedProducts.delete(productId);
    } else {
      newLikedProducts.add(productId);
    }
    setLikedProducts(newLikedProducts);
    localStorage.setItem(
      'likedProducts',
      JSON.stringify([...newLikedProducts])
    );
  };

  // Rating-toiminto
  const handleRating = async (productId, rating) => {
    if (currentUser) {
      try {
        await rateProduct(currentUser.uid, productId, rating);
        const newRatings = { ...userRatings };
        newRatings[productId] = rating;
        setUserRatings(newRatings);
        localStorage.setItem('userRatings', JSON.stringify(newRatings));

        // Päivitä tuotteiden lista paikallisesti
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product.id === productId) {
              const currentTotal = product.totalRatings || 0;
              const currentAverage = product.averageRating || 0;
              const userPreviousRating = userRatings[productId] || 0;

              let newTotal, newAverage;

              if (userPreviousRating > 0) {
                // Päivitä olemassa oleva arvostelu
                const sum = currentAverage * currentTotal;
                const newSum = sum - userPreviousRating + rating;
                newAverage = newSum / currentTotal;
                newTotal = currentTotal;
              } else {
                // Uusi arvostelu
                const sum = currentAverage * currentTotal;
                const newSum = sum + rating;
                newTotal = currentTotal + 1;
                newAverage = newSum / newTotal;
              }

              return {
                ...product,
                averageRating: Number(newAverage.toFixed(1)),
                totalRatings: newTotal,
              };
            }
            return product;
          })
        );
      } catch (error) {
        console.error('Error rating product:', error);
        handleLocalStorageRating(productId, rating);
      }
    } else {
      handleLocalStorageRating(productId, rating);
    }
  };

  const handleLocalStorageRating = (productId, rating) => {
    const newRatings = { ...userRatings };
    newRatings[productId] = rating;
    setUserRatings(newRatings);
    localStorage.setItem('userRatings', JSON.stringify(newRatings));
  };

  // Pika-lisäys koriin
  const quickAddToCart = (product) => {
    const itemForCart = {
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      img: product.img,
      category: product.category,
      description: product.description,
      short_description: product.short_description,
      tag: product.tag,
      quantity: 1,
      totalPrice: parseFloat(product.price),
      rating: Array(5).fill({ icon: '★' }),
    };
    dispatch(addToCart(itemForCart));
    dispatch(getCartTotal());
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    arrows: true,
    swipeToSlide: true, // Parempi mobiilikäyttöliittymä
    touchThreshold: 10, // Herkempi kosketukselle
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          //dots: true, // Dots mobile-näkymässä
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Piilota nuolet pienimmässä näkymässä
          //dots: true,
          centerMode: true,
          centerPadding: '20px',
          swipeToSlide: true,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div>
        <Heading
          useLogoHeading={true}
          // hideHeadingOnMobile={true}
          subheading={'Our BestSeller'}
          description={"Summer 2026 collection's best sellers"}
        />
        <div className="text-center py-10">Loading best sellers...</div>
      </div>
    );
  }

  return (
    <div className="w-full pt-4 pb-4 bg-[#FFFFFF]">
      <div>
        <Heading
          useLogoHeading={true}
          hideHeadingOnMobile={true}
          subheading={"Our BestSeller's"}
          description={"Summer 2026 collection's best sellers"}
        />
      </div>
      <div className="w-full pt-4 px-2 md:px-0">
        <div className="w-full md:w-10/12 mx-auto">
          <Slider ref={sliderRef} {...settings}>





            {/*{products.map((val, key) => (
              <div className="px-1 md:px-2" key={key}>
                <div className="bg-white border border-[#0B7AA3] rounded-lg shadow-md overflow-hidden mx-1">
                  <div className="image-container relative aspect-square group">
                    <img
                      src={val.img}
                      alt={val.title}
                      className="w-full h-full object-cover"
                    />

                    * Mobile & Desktop Action Buttons - Responsiivinen sijoittelu *
                    <div className="absolute top-2 right-2 flex flex-col space-y-1 md:space-y-2">
                      <button
                        className={`w-7 h-7 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
                          likedProducts.has(val.id)
                            ? 'text-[#A30B2E]'
                            : 'text-[#7AA30B] hover:text-[#A30B2E]'
                        }`}
                        onClick={() => handleLike(val.id)}
                      >
                        <BiHeart size={14} className="md:w-4 md:h-4" />
                      </button>
                    </div>

                    * Tag *
                    {val.tag && (
                      <div className="absolute top-4 left-2">
                        <span className="bg-[#7AA30B] text-white text-xs px-2 py-3 rounded-full">
                          {val.tag}
                        </span>
                      </div>
                    )}

                    * Quick Add Button
                    <button
                      onClick={() => quickAddToCart(val)}
                      className="absolute bottom-4 right-2 w-7 h-7 md:w-10 md:h-10 rounded-full bg-[#A30B2E] text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                    >
                      <BiCart size={14} className="md:w-6 md:h-6" />
                    </button>*

                    * Hover Overlay - pienillä aina näkyvissä, md+ vain hoverilla *
                    <div className="block opacity-100 translate-y-0 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 absolute bottom-0 bg-[#A30B2E] w-full text-center text-white pt-4 pb-4 transition-all duration-300 ease-out">
                      <div className="flex justify-center align-middle">
                        <button
                          className="hidden md:block text-2xl mr-2"
                          onClick={() => quickAddToCart(val)}
                        >
                          <BiCart />
                        </button>
                        <button
                          type="button"
                          className="whitespace-nowrap uppercase"
                          onClick={() => handleOpen(val.id)}
                        >
                          Select Options
                        </button>
                      </div>
                    </div>
                  </div>

                  * Product Info - Responsiivinen padding ja tekstikoot *
                  <div className="p-2 md:p-3">
                    *<p className="text-xs text-[#0B7AA3] mb-1">{val.short_description}</p>*
                    <p className="font-zaslia font-medium text-black text-2xl md:text-xl mb-2 line-clamp-2 text-center">
                      {val.title}
                    </p>

                    * Stars - Keskitetty *
                    <div className="flex justify-center mb-2 text-yellow-500">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => {
                          const starNumber = i + 1;
                          const userRating = userRatings[val.id] || 0;
                          const productAverage = val.averageRating || 0;
                          const displayRating =
                            userRating > 0 ? userRating : productAverage;
                          const isFilled =
                            starNumber <= Math.round(displayRating);

                          return (
                            <span
                              key={i}
                              className={`cursor-pointer hover:scale-110 transition-transform select-none ${
                                isFilled
                                  ? 'text-yellow-500'
                                  : 'text-gray-300 hover:text-yellow-400'
                              }`}
                              onClick={() => handleRating(val.id, starNumber)}
                              onMouseEnter={(e) => {
                                const stars = e.target.parentElement.children;
                                for (let j = 0; j < stars.length; j++) {
                                  if (j < starNumber) {
                                    stars[j].classList.add('text-yellow-400');
                                    stars[j].classList.remove(
                                      'text-gray-300',
                                      'text-yellow-500'
                                    );
                                  } else {
                                    stars[j].classList.add('text-gray-300');
                                    stars[j].classList.remove(
                                      'text-yellow-400',
                                      'text-yellow-500'
                                    );
                                  }
                                }
                              }}
                              onMouseLeave={(e) => {
                                const stars = e.target.parentElement.children;
                                for (let j = 0; j < stars.length; j++) {
                                  const shouldBeFilled =
                                    j + 1 <= Math.round(displayRating);
                                  if (shouldBeFilled) {
                                    stars[j].classList.add('text-yellow-500');
                                    stars[j].classList.remove(
                                      'text-gray-300',
                                      'text-yellow-400'
                                    );
                                  } else {
                                    stars[j].classList.add('text-gray-300');
                                    stars[j].classList.remove(
                                      'text-yellow-500',
                                      'text-yellow-400'
                                    );
                                  }
                                }
                              }}
                              title={`Anna ${starNumber} tähteä`}
                            >
                              ★
                            </span>
                          );
                        })}
                    </div>

                    <div className="text-center">
                      <span className="font-librecaslon text-[#333333] font-medium text-lg md:text-base">
                        €{val.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}*/}


{products.map((val, key) => (
  <div className="px-1 md:px-2" key={key}>
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-md group mx-1
                    hover:shadow-xl transition-shadow duration-300">

      {/* Kuva-alue — aspect-[3/4] pakottaa pystysuuntaisen kehyksen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={val.img}
          alt={val.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {val.tag && (
          <div className="absolute top-3 left-3 z-20 bg-[#E73725] font-zaslia text-white
                          text-xs font-semibold uppercase tracking-wide px-2 py-0.5 shadow">
            {val.tag}
          </div>
        )}

        <button
          onClick={() => handleLike(val.id)}
          aria-label="Like"
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center
                      shadow transition-colors duration-200 ${
            likedProducts.has(val.id)
              ? 'bg-[#E73725] text-white'
              : 'bg-white text-[#E73725]'
          }`}
        >
          <BiHeart size={16} />
        </button>
      </div>

      {/* Info-paneeli */}
      <div className="px-3 py-3 bg-white">
        <h3 className="font-zaslia text-[#010000] text-base leading-snug line-clamp-2 mb-1.5">
          {val.title}
        </h3>

        <div className="flex mb-2.5">
          {Array(5).fill(0).map((_, i) => {
            const starNumber = i + 1;
            const userRating = userRatings[val.id] || 0;
            const productAverage = val.averageRating || 0;
            const displayRating = userRating > 0 ? userRating : productAverage;
            const isFilled = starNumber <= Math.round(displayRating);
            return (
              <span
                key={i}
                onClick={() => handleRating(val.id, starNumber)}
                className={`cursor-pointer text-sm select-none transition-transform hover:scale-110 ${
                  isFilled ? 'text-yellow-400' : 'text-gray-300'
                }`}
                title={`Anna ${starNumber} tähteä`}
              >
                ★
              </span>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-librecaslon text-[#010000] font-bold text-xl">
            €{val.price}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => quickAddToCart(val)}
              aria-label="Add to cart"
              className="w-8 h-8 flex items-center justify-center bg-[#010000] text-white
                         rounded hover:bg-[#E73725] transition-colors duration-200"
            >
              <BiCart size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleOpen(val.id)}
              className="px-3 h-8 font-librecaslon text-xs font-semibold uppercase tracking-wide
                         border border-[#010000] text-[#010000] rounded
                         hover:bg-[#010000] hover:text-white transition-colors duration-200"
            >
              Options
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
))}

          </Slider>
        </div>
      </div>

      <Model
        isModalOpen={isModalOpen !== null}
        data={products.find((feature) => feature.id === isModalOpen)}
        handleClose={handleClose}
      />
    </div>
  );
};
