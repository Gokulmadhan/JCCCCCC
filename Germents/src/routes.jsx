import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Core Pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Offers from "./pages/Offers";

// Men Subcategories
import MenActiveWear from "./pages/categories/Men/ActiveWear";
import MenInnerWear from "./pages/categories/Men/InnerWear";
import MenTops from "./pages/categories/Men/Tops";
import MenBottoms from "./pages/categories/Men/Bottoms";
import MenVests from "./pages/categories/Men/Vests";

// Women Subcategories
import WomenActiveWear from "./pages/categories/Women/ActiveWear";
import WomenInnerWear from "./pages/categories/Women/InnerWear";
import WomenTops from "./pages/categories/Women/Tops";
import WomenBottoms from "./pages/categories/Women/Bottoms";
import WomenVests from "./pages/categories/Women/Vests";

// Cart & Checkout
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderCompletePage from "./components/OrderCompletePage";

// Other Pages
import CruiseSuperPack from "./pages/categories/CruiseSuperPack";
import TrendSlider from "./components/TrendSlider";

// Auth Modals
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";

// Pages with Nested Routes
import MenPage from "./pages/MenPage";
import WomenPage from "./pages/WomenPage";
import ProductDetails from "./components/ProductModal";

// Cart Context
import { CartProvider } from "./components/CartContext";
import CategoryPage from "./pages/categories/CategoryPage";
import Myorders from "./components/Myorders";

export default function AllRoutes() {
  const location = useLocation();
  const [modal, setModal] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <CartProvider> {/* ✅ Wrap all routes in CartProvider */}
      <>
        {/* Auth Modals */}
        {modal === "signin" && (
          <SignIn
            onClose={() => setModal(null)}
            switchToSignUp={() => setModal("signup")}
          />
        )}
        {modal === "signup" && (
          <SignUp
            onClose={() => setModal(null)}
            switchToSignIn={() => setModal("signin")}
          />
        )}

        {/* App Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/about" element={<AboutUs />} />

          <Route path="/menpage" element={<MenPage />} />
          <Route path="/womenpage" element={<WomenPage />} />

          {/* Cart & Checkout */}
          <Route path="/CartPage" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/complete" element={<OrderCompletePage />} />

          {/* Men Pages */}
          <Route path="/category/:gender/:type" element={<CategoryPage />} />
   
          {/* Additional Pages */}
          <Route path="/cruise-super-pack" element={<CruiseSuperPack />} />
          <Route path="/trends" element={<TrendSlider />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/my-orders" element={<Myorders />} />
        </Routes>
      </>
    </CartProvider>
  );
}
