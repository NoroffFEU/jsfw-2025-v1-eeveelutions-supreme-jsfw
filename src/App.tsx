import { BrowserRouter, Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { Header } from './components/layout/Header.tsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
