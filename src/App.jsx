import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import {
  TopBar,
  Home,
  Mani,
  Shop,
  Cart,
  Contact, 
  Header,
  Footer,
  About,
  Repairs,
  NotFoundPage,
} from './pages/index';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ResetPassword from './pages/auth/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Maintenance from './components/Maintenance';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManager from './pages/admin/ProductManager';
import UserManager from './pages/admin/UserManager';
import OrderManager from './pages/admin/OrderManager';
import OrderDetail from './pages/admin/OrderDetail';
import UserProfile from './pages/auth/UserProfile';
import Checkout from './pages/OrderCheckout';
import OrderConfirmation from './pages/OrderConfirmation';
import ScrollToTop from './components/ScrollToTop';
import DevTools from './components/DevTools';
import { MobileMenuProvider } from './context/MobileMenuContext';
import { LanguageProvider } from './context/LanguageContext';
import BookingPage from './pages/BookingPage';
import BookingsAdmin from './pages/admin/BookingsAdmin';
import AvailabilityAdmin from './pages/admin/AvailabilityAdmin';

// ✅ UUSI: Wrapper-komponentti joka tarkistaa reitin
function AppContent() {
  const location = useLocation();
  //const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname === '/profile';

  // ✅ Laajenna kattamaan sekä admin- että profile-sivut
  const isDashboardRoute =
    location.pathname.startsWith('/admin') || location.pathname === '/profile';

  return (
    <div className="bg-[#eceef1]">
      <TopBar />

      {/* ✅ Näytä Header vain jos EI ole admin-sivulla */}
      {!isDashboardRoute && <Header />}

      <Routes>
        {/* Julkiset reitit */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/mani" element={<Mani />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/repairs" element={<Repairs />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Suojatut reitit - vain kirjautuneet käyttäjät */}
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:orderId"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin-reitit - Header renderöidään AdminDashboard.jsx:ssä */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requireAdmin={true}>
              <ProductManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requireAdmin={true}>
              <OrderManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:orderId"
          element={
            <ProtectedRoute requireAdmin={true}>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin={true}>
              <UserManager />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/bookings" 
        element={<ProtectedRoute requireAdmin>
          <BookingsAdmin/>
          </ProtectedRoute>} />
        <Route path="/admin/availability" element={
          <ProtectedRoute requireAdmin>
            <AvailabilityAdmin/>
            </ProtectedRoute>} />

        {/* 404-sivu */}
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>

      <DevTools />
      {/* <Footer />*/}
    </div>
  );
}

function App() {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  return (
    <AuthProvider>
      <LanguageProvider>
        <MobileMenuProvider>
          <Router>
            <ScrollToTop />
            {/* ✅ AppContent sisällä, jotta useLocation toimii */}
            <AppContent />
          </Router>
        </MobileMenuProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
