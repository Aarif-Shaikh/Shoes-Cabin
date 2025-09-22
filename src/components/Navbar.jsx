import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Store, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useCart } from "@/store/CartContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products.js";

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1); // 👈 track highlighted suggestion
  const navigate = useNavigate();
  const inputRef = React.useRef(null);

  const filteredProducts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const getFirstImage = (p) => {
  if (!p) return "";
  
  // If p has a direct image property
  if (p.image) return p.image;
  
  // If p has media object
  if (p.media && typeof p.media === "object") {
    // Pick the first color key
    const colorKeys = Object.keys(p.media);
    if (colorKeys.length > 0) {
      const firstMediaArray = p.media[colorKeys[0]];
      if (firstMediaArray && firstMediaArray.length > 0) {
        // Return the first image in the array
        const firstItem = firstMediaArray.find(item => item.type === "image");
        if (firstItem) return firstItem.src;
      }
    }
  }

  return "";
};


  const navLinkClass = ({ isActive }) =>
    [
      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive
        ? "text-white bg-white/10"
        : "text-white/80 hover:text-white hover:bg-white/5",
    ].join(" ");

  React.useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.position = "relative"; // 👈 keeps layout stable
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.style.position = "";
    }
  }, [open]);



  React.useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      inputRef.current?.blur();
    }
  }, [searchOpen]);

  const preventMouseFocus = (e) => {
    if (e && e.preventDefault) e.preventDefault();
  };

  const handleSuggestionClick = (productId) => {
    setSearchOpen(false);
    setQuery("");
    setActiveIndex(-1);
    navigate(`/product/${productId}`);
  };

  const onInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        i < filteredProducts.length - 1 ? i + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        i > 0 ? i - 1 : filteredProducts.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredProducts.length) {
        handleSuggestionClick(filteredProducts[activeIndex].id);
      } else if (query.trim()) {
        navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
        setSearchOpen(false);
        setQuery("");
        setActiveIndex(-1);
      }
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setQuery("");
      setActiveIndex(-1);
    }
  };

  const renderSuggestions = () => {
    if (!query.trim()) return null;
    return (
      <AnimatePresence>
        <motion.ul
          key="search-suggestions"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
          className="absolute top-full left-0 right-0 bg-neutral-900 border border-white/10 rounded-lg mt-1 shadow-lg z-50 max-h-60 overflow-y-auto"
          role="listbox"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p, i) => {
              const img = getFirstImage(p);
              const isActive = i === activeIndex;
              return (
                <li
                  key={p.id}
                  className={`px-3 py-2 cursor-pointer flex items-center gap-3 ${isActive ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick(p.id)}
                  role="option"
                  aria-selected={isActive}
                >
                  <img
                    src={img}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{p.name}</div>
                    <div className="text-xs text-white/60 mt-0.5">
                      ${p.price?.toFixed?.(2) ?? ""}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="px-3 py-2 text-white/70">No products found</li>
          )}
        </motion.ul>
      </AnimatePresence>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/30 border-b border-white/10">

      <nav aria-label="Main" className="container mx-auto px-3 sm:px-4 flex items-center justify-between py-3">
        {/* Mobile layout */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Left: Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={(e) => {
              setOpen((prev) => !prev);
              requestAnimationFrame(() => e.currentTarget?.blur());
            }}
            onMouseDown={(e) => e.preventDefault()}
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5
             focus:outline-none active:outline-none
             bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <motion.span
              initial={false}
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-0.5 bg-white rounded"
            />
            <motion.span
              initial={false}
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-0.5 bg-white rounded"
            />
            <motion.span
              initial={false}
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-0.5 bg-white rounded"
            />
          </Button>

          {/* Center: Logo OR Search (animated) */}
          <div className="flex-1 flex justify-center">
            <AnimatePresence initial={false} mode="wait">
              {!searchOpen ? (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link
                    to="/"
                    className="flex items-center gap-1 sm:gap-2 group focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded-md px-1 whitespace-nowrap"
                  >
                    <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-black shadow-inner">
                      <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-base sm:text-lg font-extrabold tracking-wide text-white">
                      SHOES{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">
                        CABIN
                      </span>
                    </span>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-search"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="relative"
                >
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-transparent text-white placeholder-white/50 px-2 py-1 text-sm focus:outline-none focus:ring-0 focus-visible:ring-0"
                    aria-label="Search"
                    autoComplete="off"
                  />

                  {/* underline animation: expands from right when open, shrinks back on close */}
                  <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden pointer-events-none">
                    <motion.div
                      className="h-full bg-fuchsia-400"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: searchOpen ? (query ? 1 : 0.98) : 0 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.32, ease: "easeInOut" }}
                      style={{ transformOrigin: searchOpen ? "100% 50%" : "0% 50%" }}
                    />
                  </div>

                  {/* suggestions (mobile) */}
                  {renderSuggestions()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Search toggle (changes to X) + Cart */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={searchOpen ? "Close search" : "Open search"}
              onClick={(e) => {
                setSearchOpen((s) => {
                  const next = !s;
                  if (next) {
                    // 👇 focus immediately when opening
                    setTimeout(() => inputRef.current?.focus(), 0);
                  } else {
                    inputRef.current?.blur();
                    setQuery("");
                  }
                  return next;
                });
                e.currentTarget.blur?.();
              }}
              onPointerDown={preventMouseFocus}
              onMouseDown={preventMouseFocus}
              className="focus:outline-none focus-visible:ring-0"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>


            <Button
              variant="secondary"
              size="sm"
              className="relative focus:outline-none focus-visible:ring-0"
              onClick={(e) => {
                navigate("/cart");
                e.currentTarget.blur?.();
              }}
              onPointerDown={preventMouseFocus}
              onMouseDown={preventMouseFocus}
              aria-label="Open cart"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -top-2 -right-2 text-[10px] bg-fuchsia-500 text-black rounded-full w-5 h-5 grid place-items-center font-bold shadow">
                {count}
              </span>
            </Button>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between w-full">
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded-md px-1 whitespace-nowrap"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-black shadow-inner">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-wide text-white">
              SHOES{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">
                CABIN
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <NavLink to="/shop" className={navLinkClass} onPointerDown={preventMouseFocus} onMouseDown={preventMouseFocus} onClick={(e) => e.currentTarget.blur?.()}>
              Shop
            </NavLink>
            <NavLink to="/cart" className={navLinkClass} onPointerDown={preventMouseFocus} onMouseDown={preventMouseFocus} onClick={(e) => e.currentTarget.blur?.()}>
              Cart
            </NavLink>
            <NavLink to="/contact" className={navLinkClass} onPointerDown={preventMouseFocus} onMouseDown={preventMouseFocus} onClick={(e) => e.currentTarget.blur?.()}>
              Contact Us
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  key="desktop-search"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 220 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="relative overflow-visible"
                >
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-transparent text-white placeholder-white/50 px-2 py-1 text-sm focus:outline-none focus:ring-0 focus-visible:ring-0"
                    aria-label="Search"
                    autoComplete="off"
                  />

                  {/* underline */}
                  <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden pointer-events-none">
                    <motion.div
                      className="h-full bg-fuchsia-400"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: searchOpen ? (query ? 1 : 0.98) : 0 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.32, ease: "easeInOut" }}
                      style={{ transformOrigin: searchOpen ? "100% 50%" : "0% 50%" }}
                    />
                  </div>

                  {/* suggestions (desktop) */}
                  {renderSuggestions()}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              aria-label={searchOpen ? "Close search" : "Open search"}
              onClick={(e) => {
                setSearchOpen((s) => {
                  const next = !s;
                  if (!next) {
                    setQuery("");
                    inputRef.current?.blur();
                  }
                  return next;
                });
                e.currentTarget.blur?.();
              }}
              onPointerDown={preventMouseFocus}
              onMouseDown={preventMouseFocus}
              className="focus:outline-none focus-visible:ring-0"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="relative focus:outline-none focus-visible:ring-0"
              onClick={(e) => {
                navigate("/cart");
                e.currentTarget.blur?.();
              }}
              onPointerDown={preventMouseFocus}
              onMouseDown={preventMouseFocus}
              aria-label="Open cart"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span>Cart</span>
              <span className="absolute -top-2 -right-2 text-[10px] bg-fuchsia-500 text-black rounded-full w-5 h-5 grid place-items-center font-bold shadow">
                {count}
              </span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop (no blur now, just dim background) */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel – solid background */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 w-4/5 max-w-xs h-[calc(100%-var(--navbar-height))] 
                   bg-neutral-900 border-r border-white/10 z-50 flex flex-col"
              style={{ top: "var(--navbar-height)" }}
              role="dialog"
              aria-modal="true"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <span className="text-white font-semibold text-2xl">Menu</span>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto">

                {/* Home Link */}
                <NavLink
                  to="/"
                  className="flex items-center gap-3 px-4 py-4 text-white hover:bg-white/10 border-b border-white/10"
                  onClick={() => setOpen(false)}
                >
                  <Store className="w-5 h-5" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">Shoes Cabin Home</span>
                </NavLink>


                {/* Drawer Nav Links */}
                <div className="flex flex-col">
                  <NavLink
                    to="/shop"
                    className="px-4 py-3 text-white hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Shop
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className="px-4 py-3 text-white hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Cart
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className="px-4 py-3 text-white hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Contact Us
                  </NavLink>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
