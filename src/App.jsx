import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import Home from "@/pages/Home.jsx";
import Shop from "@/pages/Shop.jsx";
import Cart from "@/pages/Cart.jsx";
import Contact from "@/pages/Contact.jsx";
import ProductPage from "@/pages/ProductPage.jsx";
import Checkout from "@/pages/Checkout.jsx"; // ✅ import Checkout
import { Toaster } from "@/components/ui/toaster.jsx";
import ReloadSplash from "@/components/ReloadSplash.jsx";

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-[60vh]"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl bg-fuchsia-600/30" />
        <div className="absolute top-20 -right-40 w-96 h-96 rounded-full blur-3xl bg-cyan-500/20" />
      </div>

      {showSplash && <ReloadSplash />}

      <Navbar />
      <main className="flex-1 pt-11">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/shop"
              element={
                <PageWrapper>
                  <Shop />
                </PageWrapper>
              }
            />
            <Route
              path="/product/:productId"
              element={
                <PageWrapper>
                  <ProductPage />
                </PageWrapper>
              }
            />
            <Route
              path="/cart"
              element={
                <PageWrapper>
                  <Cart />
                </PageWrapper>
              }
            />
            {/* ✅ NEW CHECKOUT ROUTES */}
            <Route
              path="/checkout"
              element={
                <PageWrapper>
                  <Checkout />
                </PageWrapper>
              }
            />
            <Route
              path="/checkout/:id"
              element={
                <PageWrapper>
                  <Checkout />
                </PageWrapper>
              }
            />
            <Route
              path="/contact"
              element={
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
