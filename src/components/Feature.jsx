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
import { getAllProducts } from '../services/productService';

export const Feature = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [userRatings, setUserRatings] = useState({});
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  // Haetaan tuotteet Firestoresta
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        setProducts(allProducts.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
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

        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product.id === productId) {
              const currentTotal = product.totalRatings || 0;
              const currentAverage = product.averageRating || 0;
              const userPreviousRating = userRatings[productId] || 0;

              let newTotal, newAverage;

              if (userPreviousRating > 0) {
                const sum = currentAverage * currentTotal;
                const newSum = sum - userPreviousRating + rating;
                newAverage = newSum / currentTotal;
                newTotal = currentTotal;
              } else {
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

  // Optimoidut slider-asetukset kaikille näyttökokoille
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
      <div className="w-full px-2 md:px-0">
        <Heading
          useLogoHeading={true}
          subheading={'Featured products'}
          description={
            'Get full summer 2026 collection with\nall the goodies you need'
          }
        />
        <div className="font-librecaslon font-medium text-[#333333] text-center py-10">
          Loading featured products...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-4 bg-[#FFFFFF]">
      <div>
        <Heading
          useLogoHeading={true}
          //hideHeadingOnMobile={true}
          subheading={'Featured products'}
          description={'Full summer 2026 collection´s'}
        />
      </div>

      {/* Yhtenäinen Slider-layout kaikille näyttökokoille */}
      <div className="w-full px-2 md:px-0 pt-4">
        <div className="w-full md:w-10/12 mx-auto">
          <Slider ref={sliderRef} {...settings}>

{products.map((val, key) => (
  <div className="px-1 md:px-2" key={key}>
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-md group mx-1
                    hover:shadow-xl transition-shadow duration-300">

      {/* Kuva-alue — aspect-[3/4] pakottaa pystysuuntaisen kehyksen, object-cover rajaa landscape-kuvat keskeltä */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={val.img}
          alt={val.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Tag-badge */}
        {val.tag && (
          <div className="absolute top-3 left-3 z-20 bg-[#A30B2E] font-zaslia text-white
                          text-xs font-semibold uppercase tracking-wide px-2 py-0.5 shadow">
            {val.tag}
          </div>
        )}

        {/* Sydän-nappi */}
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

        {/* Otsikko */}
        <h3 className="font-zaslia text-[#010000] text-base leading-snug line-clamp-2 mb-1.5">
          {val.title}
        </h3>

        {/* Tähdet */}
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

        {/* Hinta + toimintanapit */}
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
