import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import HeroSlider from '@/components/HeroSlider.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useCart } from '@/store/CartContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/products.js';

function FeaturedCard({ product }) {
  // const { addItem } = useCart();
  const defaultImage =
    product.media && typeof product.media === "object"
      ? Object.values(product.media)[0]?.find(m => m.type === "image")?.src
      : "";


  if (!product.media) {
    console.warn("Product missing media:", product);
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-3 shadow-lg hover:shadow-fuchsia-500/10 transition-shadow flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="block rounded-xl overflow-hidden aspect-[4/3] border border-white/10">
        <img src={defaultImage} alt={product.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="font-semibold">{product.name}</p>
          <p className="text-sm text-white/70">
            ₹{Number.isInteger(product.price)
              ? product.price.toLocaleString("en-IN")
              : product.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <Button
          action="add-to-cart"
          product={product}
          className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold"
        >
          Add to cart
        </Button>

      </div>
    </motion.article>
  );
}

export default function Home() {
  const featuredProducts = products.slice(0, 26);

  // 🔥 Rotating Quotes
  const quotes = ["Step into Style", "Walk the Trend", "Elevate Your Look"];
  const [index, setIndex] = React.useState(0);

  const longestQuote = React.useMemo(
    () => quotes.reduce((a, b) => (a.length > b.length ? a : b), ""),
    []
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000); // change every 4s
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>SHOES CABIN | Home</title>
        <meta
          name="description"
          content="Discover stylish sneakers and comfy kicks at SHOES CABIN. Fresh drops, premium quality, and head-turning looks."
        />
        <meta property="og:title" content="SHOES CABIN | Home" />
        <meta
          property="og:description"
          content="Discover stylish sneakers and comfy kicks at SHOES CABIN. Fresh drops, premium quality, and head-turning looks."
        />
      </Helmet>

      <section className="container mx-auto pt-10 pb-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center flex flex-wrap justify-center gap-2 leading-tight">
          {/* Rotating part (fixed width, single line) */}
          <span className="relative inline-block whitespace-nowrap overflow-hidden text-center align-baseline">
            {/* Invisible spacer sets the width to the longest quote */}
            <span className="invisible">{longestQuote}</span>

            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={quotes[index]}
                className="absolute inset-0 whitespace-nowrap"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {quotes[index]}
              </motion.span>
            </AnimatePresence>
          </span>

          {/* Static part */}
          <span className="whitespace-nowrap">
            with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">
              SHOES CABIN
            </span>
          </span>
        </h1>


        <p className="text-center text-white/70 mt-3 max-w-2xl mx-auto">
          Curated sneakers for everyday comfort and standout moments.
        </p>

        <div className="mt-3">
          <HeroSlider />
        </div>
      </section>

      <section className="container mx-auto mt-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Featured Products</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <FeaturedCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
