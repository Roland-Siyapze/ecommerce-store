import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AddvertBarTop } from './components/AddvertBarTop';
import { AllAbouJumiaFooter } from './components/Footers/AllAbouJumiaFooter';
import { FooterPrime } from './components/Footers/FooterPrime';
import { SellBuyFoodNavBar } from './components/HomePageNavBar/SellBuyFoodNavBar';
import { PrimeNavbar } from './components/NavBar/PrimeNavbar';
import { CategoryBanner } from './components/NavigationMenu/CategoryBanner';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BoutiquePage } from './pages/BoutiquePage';
import { PromotionsPage } from './pages/PromotionsPage';
import { SearchPage } from './pages/SearchPage';

function App() {
  return (
    <div className="App bg-primary-bg-page">
      <Router>
        <>
          <AddvertBarTop />
          <SellBuyFoodNavBar />
          <PrimeNavbar />
          <CategoryBanner />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route
              path="/category/:parentSlug/:slug"
              element={<CategoryPage />}
            />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/boutique/:slug" element={<BoutiquePage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
          <FooterPrime />
          <AllAbouJumiaFooter />
        </>
      </Router>
    </div>
  );
}

export default App;
