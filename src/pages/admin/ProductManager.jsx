import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../../firebase/firebase';
import { CATEGORIES } from '../../services/productService';
import AdminMobileHeader from '../../common/AdminMobileHeader';
import Header from '../../common/Header';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tag: 'new',
    stock: '100',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  // Haetaan tuotteet Firestoresta
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'products'), orderBy('title'));
      const querySnapshot = await getDocs(q);

      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Tuotteiden hakeminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  // Lomakkeen kenttien muuttaminen
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === 'price' || name === 'stock' ? parseFloat(value) || '' : value,
    });
  };

  // Kuvan lisääminen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Luodaan esikatselu
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Modaalin avaaminen uuden tuotteen lisäämistä varten
  const openAddModal = () => {
    setCurrentProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      tag: 'new',
      stock: '100',
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  // Modaalin avaaminen tuotteen muokkausta varten
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      tag: product.tag || 'new',
      stock: product.stock || '100',
    });
    setImagePreview(product.img || '');
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Modaalin sulkeminen
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Tuotteen tallentaminen (lisäys tai päivitys)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Valmistellaan tuotetiedot
      let productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        // Lisätään tyhjä arviointi-array
        rating: Array(5).fill({ icon: '⭐' }),
      };

      // Jos kuva on muuttunut, ladataan se
      let imgUrl = currentProduct?.img || '';

      if (imageFile) {
        // Jos päivitetään, poistetaan vanha kuva
        if (currentProduct?.img) {
          try {
            const oldImageRef = ref(storage, currentProduct.img);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.log('Error deleting old image (might not exist):', error);
          }
        }

        // Ladataan uusi kuva
        const storageRef = ref(
          storage,
          `products/${Date.now()}_${imageFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        imgUrl = await getDownloadURL(snapshot.ref);
      }

      // Lisätään kuvan URL tuotetietoihin
      productData.img = imgUrl;
      productData.updatedAt = new Date();

      if (currentProduct) {
        // Päivitetään olemassa oleva tuote
        await updateDoc(doc(db, 'products', currentProduct.id), productData);
      } else {
        // Lisätään uusi tuote
        productData.createdAt = new Date();
        await addDoc(collection(db, 'products'), productData);
      }

      // Päivitetään tuotteiden lista
      await fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Tuotteen tallentaminen epäonnistui');
    } finally {
      setSaving(false);
    }
  };

  // Tuotteen poistaminen
  const handleDelete = async (product) => {
    if (
      window.confirm(`Haluatko varmasti poistaa tuotteen: ${product.title}?`)
    ) {
      try {
        // Poistetaan tuote Firestoresta
        await deleteDoc(doc(db, 'products', product.id));

        // Poistetaan tuotteen kuva, jos sellainen on
        if (product.img) {
          try {
            const imageRef = ref(storage, product.img);
            await deleteObject(imageRef);
          } catch (error) {
            console.log('Error deleting image (might not exist):', error);
          }
        }
        // Päivitetään tuotteiden lista
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Tuotteen poistaminen epäonnistui');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Ladataan...</div>;
  }

  return (
    <div>
      {/* ✅ Admin Mobile Header - Näkyy vain mobiilinäkymässä*/}
      <AdminMobileHeader pageTitle="Tuotteiden hallinta" />
      {/* ✅ Normaali Header - Näkyy vain desktop-näkymässä */}
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="container mx-auto px-4 pt-2 pb-8 bg-[#eceef1] font-oswaldVariable">
        <div className="flex flex-col justify-center items-center mt-2 mb-8">
          <button
            onClick={openAddModal}
            className="w-full bg-[#e31837] hover:bg-[#333f48] text-white font-bold py-2 px-4 rounded"
          >
            Lisää tuote
          </button>
        </div>

        {/* Tuotteiden taulukko */}
        <div className="bg-[#eceef1] rounded-lg border border-gray-300 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b bg-gray-100 text-left">
                    Kuva
                  </th>
                  <th className="py-3 px-4 border-b bg-gray-100 text-left">
                    Nimi
                  </th>
                  <th className="py-3 px-4 border-b bg-gray-100 text-left">
                    Hinta
                  </th>
                  <th className="py-3 px-4 border-b bg-gray-100 text-left">
                    Kategoria
                  </th>
                  <th className="py-3 px-4 border-b bg-gray-100 text-left">
                    Varastossa
                  </th>
                  <th className="py-3 px-4 border-b bg-gray-100 text-left">
                    Toiminnot
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      Ei tuotteita
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">
                        {product.img ? (
                          <img
                            src={product.img}
                            alt={product.title}
                            className="w-16 h-16 object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Ei kuvaa</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 border-b">{product.title}</td>
                      <td className="py-3 px-4 border-b">{product.price}€</td>
                      <td className="py-3 px-4 border-b">{product.category}</td>
                      <td className="py-3 px-4 border-b">{product.stock}</td>
                      <td className="py-3 px-4 border-b">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Muokkaa
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Poista
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modaali tuotteen lisäämistä/muokkausta varten */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-[#eceef1] rounded-lg shadow-lg p-6 w-full max-w-2xl z-10 overflow-y-auto max-h-screen">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-racingSansOne text-2xl font-medium">
                  {currentProduct ? 'Muokkaa tuotetta' : 'Lisää uusi tuote'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-700 hover:text-gray-700 text-3xl font-bold leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tuotteen nimi *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Kuvaus *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Hinta (€) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Kategoria *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="">Valitse kategoria</option>
                      {Object.values(CATEGORIES).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Merkki
                    </label>
                    <select
                      name="tag"
                      value={formData.tag}
                      onChange={handleChange}
                      className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="new">Uusi</option>
                      <option value="sale">Ale</option>
                      <option value="hot">Suosittu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Varastosaldo *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tuotekuva {!currentProduct && '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-gray-700 file:underline hover:file:bg-gray-300 cursor-pointer"
                    required={!currentProduct}
                  />

                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Tuotekuvan esikatselu"
                        className="w-32 h-32 object-cover border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-end mt-6 gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full md:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    disabled={saving}
                  >
                    Peruuta
                  </button>
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-[#e31837] hover:bg-[#333f48] text-white font-bold py-2 px-4 rounded"
                    disabled={saving}
                  >
                    {saving ? 'Tallennetaan...' : 'Tallenna'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="md:hidden mt-4 mb-12 flex flex-col justify-center items-center">
        <Link
          to="/admin"
          className="bg-[#e31837] hover:bg-[#333f48] font-oswaldVariable text-white px-4 pt-2 pb-2 rounded"
        >
          Takaisin hallintapaneeliin
        </Link>
      </div>
      <br></br>
      <br></br> <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default ProductManager;
