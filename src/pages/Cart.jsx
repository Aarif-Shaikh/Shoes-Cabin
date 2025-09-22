import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useCart } from "@/store/CartContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "@/components/ui/use-toast.js";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getProductById } from "@/data/products.js";


export default function Cart() {
  const { items, increase, decrease, remove, total, clear } = useCart();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartSelections")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    setSelectedItems((prev) => {
      const updated = {};
      items.forEach((it) => {
        updated[it.id] = prev[it.id] ?? false;
      });
      return updated;
    });
  }, [items]);

  useEffect(() => {
    localStorage.setItem("cartSelections", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const toggleSelection = (id) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deselectAll = () => {
    const deselected = {};
    items.forEach((it) => {
      deselected[it.id] = false;
    });
    setSelectedItems(deselected);
  };

  const onCheckout = () => {
    const selectedIds = Object.keys(selectedItems).filter((id) => selectedItems[id]);
    if (selectedIds.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item before checkout.",
      });
      return;
    }
    localStorage.setItem("checkoutItems", JSON.stringify(selectedIds));
    if (selectedIds.length === 1) {
      navigate(`/checkout/${selectedIds[0]}`);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      <Helmet>
        <title>SHOES CABIN | Cart</title>
      </Helmet>

      <section className="container mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          Shopping Cart
        </h1>

        {items.length > 0 && (
          <button
            onClick={deselectAll}
            className="mt-1 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300"
          >
            Deselect all items
          </button>
        )}

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur text-center">
            <p className="text-white/80">Your cart is empty.</p>
            <Link
              to="/shop"
              className="inline-block mt-4 rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black px-4 py-2 font-semibold"
            >
              Explore the shop
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr,360px] gap-6 mt-6">
            <div className="rounded-2xl border border-white/10 p-4 bg-white/5 backdrop-blur">
              <ul>
                {items.map((it, index) => (
                  <CartItem
                    key={it.id}
                    item={it}
                    increase={increase}
                    decrease={decrease}
                    remove={remove}
                    selected={!!selectedItems[it.id]}
                    onToggle={() => toggleSelection(it.id)}
                    isLast={index === items.length - 1}
                  />
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 p-4 bg-white/5 backdrop-blur h-fit">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  Subtotal ({items.reduce((sum, it) => sum + it.qty, 0)}{" "}
                  {items.reduce((sum, it) => sum + it.qty, 0) === 1 ? "item" : "items"})
                </p>
                <p className="font-bold">
                  ₹{Number.isInteger(total)
                    ? total.toLocaleString("en-IN")
                    : total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>

              </div>
              <p className="text-sm text-white/60 mt-2">
                Taxes and shipping calculated at checkout.
              </p>
              <div className="mt-4 grid gap-2">
                <Button
                  onClick={onCheckout}
                  className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold"
                >
                  Proceed to checkout
                </Button>
                <Button
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => {
                    clear();
                    toast({
                      title: "Cart cleared",
                      description: "Your cart is now empty.",
                    });
                    localStorage.removeItem("cartSelections");
                  }}
                >
                  Clear cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

/* -------------------------------
   Cart Item Component
-------------------------------- */
function CartItem({ item, increase, decrease, remove, selected, onToggle, isLast }) {
  const navigate = useNavigate();

  // ✅ Use the image saved in the cart
  const images = [item.image || "/placeholder.png"];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => setCurrentIndex((p) => (p + 1) % images.length), 3000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  return (
    <li className={`py-6 ${!isLast ? "border-b border-white/10" : ""}`}>
      {/* Mobile */}
      <div className="block sm:hidden">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={selected}
                onChange={onToggle}
                className="mt-1 w-5 h-5 accent-fuchsia-500"
              />
              <div>
                <p className="font-semibold text-sm leading-snug">{item.name}</p>
                <p className="text-green-500 text-xs mt-1">In stock</p>
                <p className="text-xs text-white/70 mt-1">
                  <span className="font-semibold">Size:</span> {item.size || "N/A"}{" "}
                  <span className="ml-2 font-semibold">Colour:</span> {item.color || "N/A"}
                </p>
                <p className="font-bold text-base mt-1">
                  ₹{Number.isInteger(item.price)
                    ? item.price.toLocaleString("en-IN")
                    : item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>

              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => remove(item.id)}
                className="flex items-center gap-1 border px-3 py-1 rounded-full text-red-500 border-red-400"
              >
                <Trash2 size={14} /> Delete
              </button>
              <button className="border px-3 py-1 rounded-full">Save for later</button>
              <button onClick={() => navigate("/shop")} className="border px-3 py-1 rounded-full">
                See more like this
              </button>
              <button className="border px-3 py-1 rounded-full">Share</button>
            </div>
          </div>

          <div className="flex-shrink-0 cursor-pointer">
            <img
              src={images[currentIndex]}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md border border-white/10"
              onClick={() => navigate(`/product/${item.id}`)}
            />
            <div className="mt-2 flex items-center border border-yellow-400 rounded-full px-3 py-1 w-fit mx-auto">
              <button onClick={() => decrease(item.id)} className="px-1 font-bold">–</button>
              <span className="px-2">{item.qty}</span>
              <button onClick={() => increase(item.id)} className="px-1 font-bold">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={selected} onChange={onToggle} className="w-5 h-5 accent-fuchsia-500" />
          <img
            src={images[currentIndex]}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-md border border-white/10"
            onClick={() => navigate(`/product/${item.id}`)}
          />
        </div>

        <div className="flex-1">
          <p className="font-semibold text-base sm:text-lg">{item.name}</p>
          <p className="text-green-400 text-sm mt-1">In stock</p>
          <p className="text-sm text-white/70 mt-1">
            <span className="font-semibold">Size:</span> {item.size || "N/A"}{" "}
            <span className="ml-4 font-semibold">Colour:</span> {item.color || "N/A"}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center border border-yellow-400 rounded-full px-3 py-1">
              <button onClick={() => decrease(item.id)} className="px-1 font-bold">–</button>
              <span className="px-2">{item.qty}</span>
              <button onClick={() => increase(item.id)} className="px-1 font-bold">+</button>
            </div>
            <button onClick={() => remove(item.id)} className="flex items-center gap-1 text-red-500 font-semibold">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        <div className="sm:text-right font-bold text-lg sm:min-w-[80px]">
          ₹{Number.isInteger(item.price)
            ? item.price.toLocaleString("en-IN")
            : item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

      </div>
    </li>
  );
}

