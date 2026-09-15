import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Layout from './app/Layout'
import Home from './routes/Home'
import BookDetail from './routes/BookDetail'
import Cart from './routes/Cart'
import OrderConfirmation from './routes/OrderConfirmation'
import Checkout from './routes/Checkout'
import Profile from './routes/Profile'
import Wishlist from './routes/Wishlist'
import MyOrders from './routes/MyOrders'
import NotFound from './routes/NotFound'
import AdminLayout from './routes/admin/AdminLayout'
import AdminLogin from './routes/admin/AdminLogin'
import AdminProducts from './routes/admin/AdminProducts'
import AdminProductForm from './routes/admin/AdminProductForm'
import AdminCreateAdmin from './routes/admin/AdminCreateAdmin'
import { withAuth } from './lib/withAuth'
import { withAdminAuth } from './lib/withAdminAuth'

const GuardedCart = withAuth(Cart)
const GaurdedWishlist = withAuth(Wishlist)
const GaurdedCheckout = withAuth(Checkout)
const GaurdedOrderConfirmation = withAuth(OrderConfirmation)
const GaurdedProfile = withAuth(Profile)
const GaurdedMyOrders = withAuth(MyOrders)

const GuardedAdminLayout = withAdminAuth(AdminLayout)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books/:bookId" element={<BookDetail />} />
          <Route path="/cart" element={<GuardedCart />} />
          <Route path="/checkout" element={<GaurdedCheckout />} />
          <Route path="/checkout/confirmation" element={<GaurdedOrderConfirmation />} />
          <Route path="/profile" element={<GaurdedProfile />} />
          <Route path="/orders" element={<GaurdedMyOrders />} />
          <Route path="/wishlist" element={<GaurdedWishlist />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<GuardedAdminLayout />}>
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:productId/edit" element={<AdminProductForm />} />
          <Route path="admins/new" element={<AdminCreateAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
