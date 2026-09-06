import { BrowserRouter, Routes, Route } from 'react-router'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books/:bookId" element={<BookDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/confirmation" element={<OrderConfirmation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
