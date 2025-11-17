import { BrowserRouter, Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
