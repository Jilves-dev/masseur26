import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BiCart,
  BiGitCompare,
  BiHeart,
  BiUser,
  BiSearch,
  BiLogOut,
  BiShoppingBag,
  BiMenu,
} from 'react-icons/bi';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaSignInAlt } from 'react-icons/fa';
import { Model } from '../common/Model';
import PageHeading from '../common/PageHeading';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, getCartTotal } from '../redux/cartSlice';
import { useAuth } from '../context/AuthContext';
import {
  getAllProducts,
  getProductsByCategory,
  CATEGORIES,
} from '../services/productService';
import { GIFT_CARDS } from '../data/Data';
import {
  toggleLike,
  getUserLikes,
  rateProduct,
  getUserRatings,
} from '../services/userInteractionService';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [userRatings, setUserRatings] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, isAdmin, logout } = useAuth();
  const { totalItems } = useSelector((state) => state.cart);

  // Haetaan tuotteet
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');

        if (
          categoryParam &&
          Object.values(CATEGORIES).includes(categoryParam)
        ) {
          setSelectedCategory(categoryParam);
          if (categoryParam === CATEGORIES.GIFT_CARDS) {
            setProducts(GIFT_CARDS);
            setFilteredProducts(GIFT_CARDS);
          } else {
            const categoryProducts = await getProductsByCategory(categoryParam);
            setProducts(categoryProducts);
            setFilteredProducts(categoryProducts);
          }
        } else {
          setSelectedCategory('');
          const allProducts = await getAllProducts();
          const combined = [...GIFT_CARDS, ...allProducts];
          setProducts(combined);
          setFilteredProducts(combined);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(
          'Tuotteiden hakeminen epäonnistui. Yritä ladata sivu uudelleen.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

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

  // Kategoria-suodatin
  const filterByCategory = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category || '');

      navigate(category ? `?category=${category}` : '/shop');

      if (category === CATEGORIES.GIFT_CARDS) {
        setFilteredProducts(GIFT_CARDS);
      } else if (category) {
        const categoryProducts = await getProductsByCategory(category);
        setFilteredProducts(categoryProducts);
      } else {
        const allProducts = await getAllProducts();
        const combined = [...GIFT_CARDS, ...allProducts];
        setProducts(combined);
        setFilteredProducts(combined);
      }
    } catch (error) {
      console.error('Error filtering products:', error);
      setError('Tuotteiden suodattaminen epäonnistui.');
    } finally {
      setLoading(false);
    }
  };

  // Haku
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = products.filter(
      (product) =>
        product.title?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
    );

    setFilteredProducts(results);
  };

  // Lisää tämä muiden funktioiden yhteyteen (esim. handleSearch:n jälkeen)
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Tuotemodaalin hallinta
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

  // Lokaalinen like-toiminto
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
        const result = await rateProduct(currentUser.uid, productId, rating);

        const newRatings = { ...userRatings };
        newRatings[productId] = rating;
        setUserRatings(newRatings);

        localStorage.setItem('userRatings', JSON.stringify(newRatings));
      } catch (error) {
        console.error('Error rating product:', error);
        handleLocalStorageRating(productId, rating);
      }
    } else {
      handleLocalStorageRating(productId, rating);
    }
  };

  // Lokaalinen rating-toiminto
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

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      // Suljetaan - käynnistä animaatio
      setIsClosing(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }, 200); // 200ms = fadeOut animaation kesto
    } else {
      // Avataan
      setIsMobileMenuOpen(true);
    }
  };

  // ✅ UUSI: Sulje menu sujuvasti ja navigoi
  const closeMenuAndNavigate = (path) => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
      navigate(path);
    }, 200); // Odota animaation loppuminen
  };

  if (loading && products.length === 0) {
    return (
      <div className="font-racingSansOne font-medium text-xl text-center py-20">
        Latautuu...
      </div>
    );
  }

  return (
    <div className="bg-[#eceef1] md:bg-[#eceef1]">
      {/* Lisätila topbarin ja shop-headerin väliin - vain mobiili */}
      <div className="block md:hidden h-4" />

      {/* ====================================
          MOBILE-ONLY HEADER - Shop-sivulle
          Näkyy VAIN mobiililla (< md)
          Korvataan Header.jsx:n logo Shop-sivulla
          ==================================== */}
      <div className="md:hidden block">
        <div className="shop-mobile-header">
          {/* VASEN: Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="shop-mobile-hamburger"
            aria-label="Open menu"
          >
            <BiMenu />
          </button>

          {/* KESKI: Kategoria-otsikko Header-tyylillä */}
          <div className="shop-mobile-category font-racingSansOne">
            <span className="font-medium text-4xl md:text-3xl text-[#333f48]">
              {selectedCategory
                ? selectedCategory.charAt(0).toUpperCase()
                : 'K'}
            </span>
            <span className="font-medium text-4xl md:text-3xl text-[#333f48]">
              {selectedCategory
                ? selectedCategory.slice(1).toUpperCase()
                : 'AUPPA'}
            </span>
            <img
              src="/images/lantern32.png"
              alt=""
              className="shop-mobile-lantern"
            />
          </div>

          {/* OIKEA: Ostoskori */}
          <div className="shop-mobile-cart">
            <Link
              to="/cart"
              className="shop-mobile-cart-button"
              aria-label="Shopping cart"
            >
              <BiShoppingBag />
              {totalItems > 0 && (
                <span className="shop-mobile-cart-badge">{totalItems}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Rivivaihtoa mobiililla headerin jälkeen */}
      <div className="block md:hidden h-2" />

      {/* ====================================
          DESKTOP PAGE HEADING
          Näkyy VAIN (>= md)
          ==================================== */}
      <div className="hidden md:block bg-[#eceef1]">
        <PageHeading
          home={'ETUSIVU'}
          pagename={selectedCategory ? selectedCategory.toUpperCase() : 'KAUPPA'}
        />
      </div>

      {/* ====================================
          MOBILE MENU OVERLAY - vain Shop-sivulla
          Kategoriavalikko ja navigaatio
          ==================================== */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 z-50 bg-[#eceef1] flex flex-col md:hidden ${isClosing ? 'mobile-menu-closing' : 'mobile-menu-overlay'}`}
        >
          {/* Menu Header */}
          <div className="flex-shrink-0 flex p-4 bg-[#eceef1]">
            {/*Takaisin-nuoliborder-b border-[#b9975b] */}

            <button
              onClick={() => closeMenuAndNavigate('/')}
              className="text-lg text-[#333f48] hover:text-[#b9975b] p-2 -ml-2"
              aria-label="Back to home"
            >
              <IoMdArrowRoundBack />
            </button>

            {/* Logo menussa - Vie etusivulle */}
            <Link
              className="bg-[#eceef1] modal-logotext-xl font-racingSansOne font-medium flex items-center pl-2"
              to="/"
              onClick={() => closeMenuAndNavigate('/')}
            >
              <span className="text-[#b9975b] text-3xl">URHEILU</span>
              <span className="text-[#333f48] text-3xl">HIEROJA</span>
            </Link>
          </div>

          {/* Skrollaava sisältö */}
          <div className="flex-1 overflow-y-auto bg-[#eceef1]">
            <div className="flex-shrink-0 flex items-center justify-center p-4 bg-[#eceef1]">
              <div className="flex items-center justify-center w-full max-w-xs gap-2">
                <Link
                  to="/shop"
                  className="text-xl text-[#333f48] hover:text-[#b9975b]"
                  onClick={() => closeMenuAndNavigate('/shop')}
                  aria-label="Search"
                >
                  <BiSearch />
                </Link>

                {/* Käyttäjä / Kirjautuminen */}
                {currentUser ? (
                  <Link
                    to={isAdmin() ? '/admin' : '/profile'}
                    className="text-xl text-[#333f48] hover:text-[#b9975b]"
                    onClick={() =>
                      closeMenuAndNavigate(isAdmin() ? '/admin' : '/profile')
                    }
                    aria-label={isAdmin() ? 'Admin' : 'Profile'}
                  >
                    <BiUser />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="text-xl text-[#333f48] hover:text-[#b9975b]"
                    onClick={() => closeMenuAndNavigate('/login')}
                    aria-label="Login"
                  >
                    <FaSignInAlt />
                  </Link>
                )}

                {/* Ostoskori */}
                <div className="relative">
                  <button
                    onClick={() => {
                      toggleSidebar();
                      toggleMobileMenu(); // ✅ Sulkee menun
                    }}
                    className="text-xl text-[#333f48] hover:text-[#b9975b]"
                    aria-label="Shopping cart"
                  >
                    <BiShoppingBag />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#e31837] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>

                {/* Uloskirjautuminen (jos kirjautunut) */}
                {currentUser && (
                  <>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="text-xl text-[#333f48] hover:text-[#b9975b]"
                      aria-label="Logout"
                    >
                      <BiLogOut strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* VIIVA - erillinen elementti paddingilla */}
            <div className="px-4">
              <div className="border-b border-[#b9975b]"></div>
            </div>

            <div className="p-6 pb-24">
              {/* ✅ UUSI: Admin Dashboard -linkit (näkyy vain admineille) */}
              {isAdmin() && (
                <div className="mb-8 font-racingSansOne border-b border-[#b9975b] pb-6">
                  <h3 className="font-oswaldVariable text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Hallintapaneeli
                  </h3>
                  <nav className="space-y-3">
                    <Link
                      to="/admin"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin')}
                    >
                      Hallintapaneeli
                    </Link>

                    <Link
                      to="/admin/orders"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin/orders')}
                    >
                      Tilaustenhallinta
                    </Link>

                    <Link
                      to="/admin/products"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin/products')}
                    >
                      Tuotehallinta
                    </Link>

                    <Link
                      to="/admin/users"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin/users')}
                    >
                      Käyttäjähallinta
                    </Link>
                  </nav>
                </div>
              )}

              {/* ✅ UUSI: USER DASHBOARD - Näkyy vain kirjautuneille EI-ADMIN käyttäjille */}
              {currentUser && !isAdmin() && (
                <div className="mb-8 font-racingSansOne font-medium border-b border-[#b9975b] pb-6">
                  <h3 className="font-oswaldVariable text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    OMAT TIEDOT
                  </h3>
                  <nav className="space-y-3">
                    <Link
                      to="/profile"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/profile')}
                    >
                      PROFIILI
                    </Link>

                    <Link
                      to="/profile?tab=orders"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2 transition-colors"
                      onClick={() =>
                        closeMenuAndNavigate('/profile?tab=orders')
                      }
                    >
                      OMAT TILAUKSET
                    </Link>

                    <Link
                      to="/profile?tab=password"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2 transition-colors"
                      onClick={() =>
                        closeMenuAndNavigate('/profile?tab=password')
                      }
                    >
                      VAIHDA SALASANA
                    </Link>
                  </nav>
                </div>
              )}

              {/* Muut linkit */}
              <div className="mb-8 font-racingSansOne border-b border-[#b9975b] pb-6">
                <h3 className="font-oswaldVariable text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Sivut
                </h3>
                <nav className="space-y-3">
                  <Link
                    to="/"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2"
                    onClick={() => closeMenuAndNavigate('/')}
                  >
                    ETUSIVU
                  </Link>

                  <Link
                    to="/repairs"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2"
                    onClick={() => closeMenuAndNavigate('/repairs')}
                  >
                    PALVELUT
                  </Link>

                  <Link
                    to="/contact"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2"
                    onClick={() => closeMenuAndNavigate('/contact')}
                  >
                    YHTEYSTIEDOT
                  </Link>

                  <Link
                    to="/about"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-2"
                    onClick={() => closeMenuAndNavigate('/about')}
                  >
                    MEISTÄ
                  </Link>
                </nav>
              </div>

              {/* Kategoriat */}
              <div className="mb-8 font-racingSansOne">
                <h3 className="font-oswaldVariable text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Kauppa
                </h3>
                <nav className="space-y-3">
                  <Link
                    to="/shop"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-3 transition-colors border-b border-gray-100"
                    onClick={() => closeMenuAndNavigate('/shop')}
                  >
                    KAIKKI TUOTTEET
                  </Link>

                  <Link
                    to={`/shop?category=${CATEGORIES.GIFT_CARDS}`}
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-3 transition-colors border-b border-gray-100"
                    onClick={() =>
                      closeMenuAndNavigate(
                        `/shop?category=${CATEGORIES.GIFT_CARDS}`
                      )
                    }
                  >
                    LAHJAKORTIT
                  </Link>

                  <Link
                    to={`/shop?category=${CATEGORIES.SUPPLEMENTS}`}
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#b9975b] py-3 transition-colors border-b border-gray-100"
                    onClick={() =>
                      closeMenuAndNavigate(
                        `/shop?category=${CATEGORIES.SUPPLEMENTS}`
                      )
                    }
                  >
                    LISÄRAVINTEET
                  </Link>
                </nav>
              </div>

              {/* Social Media - NYT NÄKYY! */}
              <div className="border-t border-[#b9975b] pt-6 pb-8">
                <h4 className="text-lg font-racingSansOne text-[#333f48] text-center mb-4 uppercase tracking-wider">
                  Seuraa meitä
                </h4>
                <div className="flex gap-6 justify-center">
                  <a
                    href="#"
                    className="text-3xl text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="#"
                    className="text-3xl text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="#"
                    className="text-3xl text-red-600 hover:text-red-700 transition-colors"
                  >
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================
          HAKUPALKKI
          ==================================== */}
      <div className="w-full pt-2 bg-[#eceef1] md:bg-[#eceef1]">
        <div className="w-10/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Otsikko vain desktopilla */}
          <div className="hidden md:flex items-center">
            {/* <h2 className="font-racingSansOne text-xl font-medium ml-6">
              {selectedCategory ? selectedCategory : "All Products"}
            </h2>*/}
          </div>

          {/* Hakukenttä */}
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <input
              type="text"
              className="bg-[#eceef1] border border-[#b9975b]/30 font-racingSansOne rounded-l rounded-r-none px-4 py-2 w-full md:w-60"
              placeholder="Hae tuotteita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#b9975b] text-white px-4 py-2 rounded-r"
            >
              <BiSearch />
            </button>
          </form>
        </div>
      </div>

      {/* ====================================
          TUOTELISTAUS
          ==================================== */}
      <div className="w-10/12 mx-auto pt-6 pb-8 bg-[#eceef1]">
        <div className="flex flex-col md:flex-row gap-8">
          {/* ====================================
              KATEGORIA-SIVUPALKKI - VAIN DESKTOP
              ==================================== */}
          <div className="hidden md:block md:w-1/4">
            <div className="bg-[#eceef1] p-4 rounded-lg border border-[#b9975b]/30 shadow-xl">
              <h3 className="font-racingSansOne text-lg sm:text-2xl font-medium mb-4">
                Kategoriat
              </h3>
              <ul className="space-y-2 text-base sm:text-xl">
                <li>
                  <button
                    onClick={() => filterByCategory('')}
                    className={`w-full font-racingSansOne text-left px-2 py-1 rounded ${selectedCategory === '' ? 'text-[#b9975b]' : ''}`}
                  >
                    Kaikki tuotteet
                  </button>
                </li>
                {Object.entries(CATEGORIES).map(([key, value]) => (
                  <li key={key}>
                    <button
                      onClick={() => filterByCategory(value)}
                      className={`w-full font-racingSansOne text-left px-2 py-1 rounded ${selectedCategory === value ? 'text-[#b9975b]' : ''}`}
                    >
                      {value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ====================================
              TUOTTEET
              ==================================== */}
          <div className="w-full md:w-3/4">
            {error && (
              <div className="bg-[#eceef1] border border-[#b9975b] text-[#333f48] px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-oswaldVariable font-medium text-xl mb-4">
                  Tuotteita ei löytynyt
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredProducts(products);
                  }}
                  className="font-oswaldVariable font-medium text-xl text-[#eceef1] bg-[#b9975b] hover:bg-[#333f48] px-4 py-2 rounded mx-auto block"
                >
                  Näytä kaikki tuotteet
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">


                {/*{filteredProducts.map((product) => (
                  <div key={product.id}>
                    <div className="bg-white border border-gray-400 rounded-lg shadow-md overflow-hidden mx-1">
                      <div className="image-container relative aspect-square group">
                        <img
                          src={product.img}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Mobile & Desktop Action Buttons - Responsiivinen sijoittelu *
                        <div className="hidden sm:flex absolute top-2 right-2 flex flex-col space-y-1 md:space-y-2">
                          <button
                            className={`w-7 h-7 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
                              likedProducts.has(product.id)
                                ? 'text-[#b9975b]'
                                : 'text-[#7AA30B] hover:text-[#b9975b]'
                            }`}
                            onClick={() => handleLike(product.id)}
                          >
                            <BiHeart size={14} className="md:w-4 md:h-4" />
                          </button>
                        </div>

                        {/* Tag *
                        {product.tag && (
                          <div className="hidden sm:flex absolute top-2 left-2">
                            <span className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center bg-[#333f48] text-white text-xs px-2 py-3 rounded-full">
                              {product.tag}
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay - pienillä aina näkyvissä, md+ vain hoverilla *
                        <div className="block opacity-100 translate-y-0 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 absolute bottom-0 bg-[#b9975b] w-full text-center text-white pt-4 pb-4 transition-all duration-300 ease-out">
                          <div className="flex justify-center align-middle">
                            <button
                              className="hidden md:block text-2xl mr-2"
                              onClick={() => quickAddToCart(product)}
                            >
                              <BiCart />
                            </button>
                            <button
                              type="button"
                              className="whitespace-nowrap uppercase"
                              onClick={() => handleOpen(product.id)}
                            >
                              Select Options
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Product Info - Responsiivinen padding ja tekstikoot *
                      <div className="p-2 md:p-3">
                        {/*<p className="text-xs text-gray-600 mb-1">{val.short_description}</p>*
                        <h3 className="font-racingSansOne font-medium text-xl text-[#333f48] md:text-xl mb-2 line-clamp-2 text-center">
                          {product.title}
                        </h3>

                        {/* Stars - Keskitetty *
                        <div className="flex justify-center mb-2">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => {
                              const starNumber = i + 1;
                              const userRating = userRatings[product.id] || 0;
                              const productAverage = product.averageRating || 0;
                              const displayRating =
                                userRating > 0 ? userRating : productAverage;
                              const isFilled =
                                starNumber <= Math.round(displayRating);

                              return (
                                <span
                                  key={i}
                                  className={`cursor-pointer text-sm md:text-base select-none transition-colors hover:scale-110 ${
                                    isFilled
                                      ? 'text-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                  onClick={() =>
                                    handleRating(product.id, starNumber)
                                  }
                                  onMouseEnter={(e) => {
                                    const stars =
                                      e.target.parentElement.children;
                                    for (let j = 0; j < stars.length; j++) {
                                      if (j < starNumber) {
                                        stars[j].classList.add(
                                          'text-yellow-400'
                                        );
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
                                    const stars =
                                      e.target.parentElement.children;
                                    for (let j = 0; j < stars.length; j++) {
                                      const shouldBeFilled =
                                        j + 1 <= Math.round(productRating);
                                      if (shouldBeFilled) {
                                        stars[j].classList.add(
                                          'text-yellow-500'
                                        );
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
                          <span className="font-oswaldVariable text-[#333333] font-medium text-lg md:text-base">
                            €{product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}*/}


                {filteredProducts.map((product) => (
                  <div key={product.id}>
                    <div className="bg-[#eceef1] border border-gray-100 rounded-lg overflow-hidden shadow-md group
                                    hover:shadow-xl transition-shadow duration-300">

                      {/* Kuva-alue — aspect-[3/4] pakottaa pystysuuntaisen kehyksen */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                        {product.img ? (
                          <img
                            src={product.img}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#333f48] text-[#eceef1]">
                            <span className="text-4xl text-[#b9975b]">{product.icon}</span>
                            <span className="font-racingSansOne text-2xl font-bold">€{product.price}</span>
                          </div>
                        )}

                        {product.tag && (
                          <div className="absolute top-3 left-3 z-20 bg-[#b9975b] font-racingSansOne text-[#eceef1]
                                          text-xs font-semibold uppercase tracking-wide px-2 py-0.5 shadow">
                            {product.tag}
                          </div>
                        )}

                        <button
                          onClick={() => handleLike(product.id)}
                          aria-label="Like"
                          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center
                                      shadow transition-colors duration-200 ${
                            likedProducts.has(product.id)
                              ? 'bg-[#b9975b] text-[#eceef1]'
                              : 'bg-[#eceef1] text-[#b9975b]'
                          }`}
                        >
                          <BiHeart size={16} />
                        </button>
                      </div>

                      {/* Info-paneeli */}
                      <div className="px-3 py-3 bg-[#eceef1]">
                        <h3 className="font-racingSansOne text-[#333f48] text-base leading-snug line-clamp-2 mb-1.5">
                          {product.title}
                        </h3>

                        <div className="flex mb-2.5">
                          {Array(5).fill(0).map((_, i) => {
                            const starNumber = i + 1;
                            const userRating = userRatings[product.id] || 0;
                            const productAverage = product.averageRating || 0;
                            const displayRating = userRating > 0 ? userRating : productAverage;
                            const isFilled = starNumber <= Math.round(displayRating);
                            return (
                              <span
                                key={i}
                                onClick={() => handleRating(product.id, starNumber)}
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
                          <span className="font-oswaldVariable text-[#333f48] font-bold text-xl">
                            €{product.price}
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => quickAddToCart(product)}
                              aria-label="Add to cart"
                              className="w-8 h-8 flex items-center justify-center bg-[#b9975b] text-[#eceef1]
                                         rounded hover:bg-[#e31837] transition-colors duration-200"
                            >
                              <BiCart size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpen(product.id)}
                              className="px-3 h-8 font-oswaldVariable text-xs font-semibold uppercase tracking-wide
                                         border border-[#333f48] text-[#333f48] rounded
                                         hover:bg-[#333f48] hover:text-[#eceef1] transition-colors duration-200"
                            >
                              Valinnat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tuotemodaali */}
      <Model
        isModalOpen={isModalOpen !== null}
        data={products.find((product) => product.id === isModalOpen)}
        handleClose={handleClose}
      />
    </div>
  );
};

export default Shop;
