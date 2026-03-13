import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import OwnerLayout from './components/layout/OwnerLayout';
import BuyerLayout from './components/layout/BuyerLayout';
import Home from './pages/Marketplace/Marketplace';
import Inventory from './pages/Marketplace/Inventory';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import OwnerDashboard from './pages/Admin/Dashboard';
import VehicleDetail from './pages/Marketplace/VehicleDetail';
import Checkout from './pages/Marketplace/Checkout';
import OrderSuccess from './pages/Marketplace/OrderSuccess';
import About from './pages/Marketplace/About';
import Contact from './pages/Marketplace/Contact';
import OwnerInventory from './pages/Seller/Inventory';
import OwnerOrders from './pages/Seller/Orders';
import Orders from './pages/Buyer/Orders';
import BuyerProfile from './pages/Buyer/Profile';
import BuyerOverview from './pages/Buyer/Overview';
import BuyerBookings from './pages/Buyer/Bookings';
import BuyerWishlist from './pages/Buyer/Wishlist';
import Booking from './pages/Marketplace/Booking';
import SellerBookings from './pages/Seller/Bookings';
import SellerCustomers from './pages/Seller/Customers';
import SellerReports from './pages/Seller/Reports';
import SellerLeads from './pages/Seller/Leads';


// Protection Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, loading } = useAuth() as any;

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Validating Session...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles) {
    const role = user.role?.toLowerCase();
    const isOwner = role === 'owner' || role === 'seller';
    const hasAccess = allowedRoles.some(r => {
      const lowerR = r.toLowerCase();
      if (lowerR === 'owner') return isOwner;
      return lowerR === role;
    });

    if (!hasAccess) return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public & Action Group (MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/car/:id" element={<VehicleDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Buyer Action Routes */}
            <Route path="/checkout/:id" element={<ProtectedRoute allowedRoles={['Buyer']}><Checkout /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute allowedRoles={['Buyer']}><OrderSuccess /></ProtectedRoute>} />
            <Route path="/booking/:id" element={<ProtectedRoute allowedRoles={['Buyer']}><Booking /></ProtectedRoute>} />
          </Route>

          {/* Buyer Dashboard (BuyerLayout) */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Buyer']}><BuyerLayout /></ProtectedRoute>}>
            <Route index element={<BuyerOverview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="test-drives" element={<BuyerBookings />} />
            <Route path="wishlist" element={<BuyerWishlist />} />
            <Route path="profile" element={<BuyerProfile />} />
          </Route>

          {/* Owner Portal (OwnerLayout) */}
          <Route path="/owner" element={<ProtectedRoute allowedRoles={['Owner']}><OwnerLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="inventory" element={<OwnerInventory />} />
            <Route path="orders" element={<OwnerOrders />} />
            <Route path="bookings" element={<SellerBookings />} />
            <Route path="customers" element={<SellerCustomers />} />
            <Route path="leads" element={<SellerLeads />} />
            <Route path="reports" element={<SellerReports />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
