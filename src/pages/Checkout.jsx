import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "react-router-dom";
import { useCart } from "@/store/CartContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { AlertCircle, X } from "lucide-react"; // red info icon
import { motion, AnimatePresence } from "framer-motion";


export default function Checkout() {
    const { id } = useParams();
    const location = useLocation();
    const { items, total } = useCart();

    // If state was passed from Cart (multiple selected items)
    const [checkoutItems, setCheckoutItems] = useState([]);
    const navigate = useNavigate();
    const [showEmptyModal, setShowEmptyModal] = useState(false);
    // const [showQuantityPopup, setShowQuantityPopup] = useState(false);
    const [currentEditingItem, setCurrentEditingItem] = useState(null);
    const [tempQuantity, setTempQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [upiOption, setUpiOption] = useState(""); // GooglePay or PhonePe


    useEffect(() => {
        if (id) {
            // Single item checkout
            setCheckoutItems(items.filter((it) => it.id === id));
        } else if (location.state?.items) {
            // Multiple selected items from Cart
            setCheckoutItems(items.filter((it) => location.state.items.includes(it.id)));
            localStorage.setItem("checkoutItems", JSON.stringify(location.state.items));
        } else {
            // Restore from localStorage if user refreshes
            const saved = JSON.parse(localStorage.getItem("checkoutItems")) || [];
            setCheckoutItems(items.filter((it) => saved.includes(it.id)));
        }
    }, [id, location.state, items]);

    const computedTotal = checkoutItems.reduce(
        (acc, it) => acc + it.qty * it.price,
        0
    );

    const emptyAddress = {
        name: "",
        phone: "",
        alternatePhone: "",
        type: "Home",
        street: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
    };


    const STORAGE_KEY = "checkoutAddress";

    const [address, setAddress] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : emptyAddress;
        }
        return emptyAddress;
    });


    // If address was never saved, start directly in edit mode
    const [mode, setMode] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            return saved ? "default" : "edit";
        }
        return "edit";
    });



    // Optional: if you ever change STORAGE_KEY shape, you could migrate here.
    useEffect(() => {
        // No-op placeholder for future migrations
    }, []);

    const singleItem = id ? items.find((item) => item.id === id) : null;

    const formattedAddress = `${address.street}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}`;

    // Handle "Use my current location"
    const handleUseLocation = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );
                const data = await res.json();
                const addr = data.address;

                setAddress((prev) => ({
                    ...prev,
                    street: addr.road || prev.street,
                    locality: addr.suburb || addr.neighbourhood || prev.locality,
                    city: addr.city || addr.town || addr.village || prev.city,
                    state: addr.state || prev.state,
                    pincode: addr.postcode || prev.pincode,
                    landmark: addr.attraction || addr.building || prev.landmark,
                }));
            } catch (err) {
                console.error("Error fetching location details", err);
            }
        });
    };

    // Save explicitly when user confirms
    const handleSaveAndDeliver = () => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
        } catch (e) {
            console.warn("Failed to save address:", e);
        }
        setMode("default");
    };

    // Add this helper function inside Checkout component
    const handleWhatsAppRedirect = () => {
        // 1. Cart items list
        let productsList = checkoutItems
            .map(
                (it, i) =>
                    `${i + 1}. ${it.name} (x${it.qty})\n   Size: ${it.size || "N/A"}, Colour: ${it.color || "N/A"
                    }\n   Price: ₹${(it.qty * it.price).toLocaleString()}`
            )
            .join("\n\n");

        // 2. Address in expanded view
        let expandedAddress = `
Name: ${address.name}
Phone: ${address.phone}${address.alternatePhone ? " / " + address.alternatePhone : ""}
Street: ${address.street}
Locality: ${address.locality}
City: ${address.city}
State: ${address.state}
Pincode: ${address.pincode}
Landmark: ${address.landmark || "N/A"}
Type: ${address.type}
  `;

        // 3. Payment method
        let paymentText = "Not Selected";
        if (paymentMethod === "upi") {
            paymentText = `UPI - ${upiOption === "gpay" ? "Google Pay" : "PhonePe"}`;
        } else if (paymentMethod === "cod") {
            paymentText = "Cash on Delivery";
        } else if (paymentMethod === "card") {
            paymentText = "Card Payment (to be collected)";
        }

        // 4. Final message
        let message = `🛒 *New Order Request*\n\n📦 Products:\n${productsList}\n\n💰 Total: ₹${computedTotal.toLocaleString()}\n\n📍 Delivery Address:\n${expandedAddress}\n\n💳 Payment Method: ${paymentText}\n\nPlease confirm my order.`;

        // 5. Redirect to WhatsApp
        let phone = "919987257764"; // replace with your number
        let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };


    return (
        <>
            <Helmet>
                <title>SHOES CABIN | Checkout</title>
            </Helmet>

            <section className="container mx-auto pt-6 px-4 sm:px-6 lg:px-8 space-y-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Checkout
                </h1>

                {/* 1. Delivery Address Section */}
                <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur relative">
                    <h2 className="font-semibold text-lg mb-2">Delivery Address</h2>

                    {/* Default View */}
                    {mode === "default" && (
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{address.name}</p>
                                <p className="text-white/80">
                                    {address.phone}
                                    {address.alternatePhone ? " / " + address.alternatePhone : ""}
                                </p>
                                <p className="mt-2 text-white/70 leading-relaxed">
                                    {formattedAddress}
                                </p>
                                {address.landmark && (
                                    <p className="text-white/70">Landmark : {address.landmark}</p>
                                )}
                                {address.type === "Work" && (
                                    <p className="text-white/70">Delivery Time : 10AM to 6PM</p>
                                )}
                            </div>
                            <button
                                onClick={() => setMode("expanded")}
                                className="text-cyan-400 font-semibold text-sm hover:underline"
                            >
                                Change
                            </button>
                        </div>
                    )}

                    {/* Expanded View */}
                    {mode === "expanded" && (
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">
                                        {address.name}{" "}
                                        <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-xs">
                                            {address.type}
                                        </span>
                                    </p>
                                    <p className="text-white/80">
                                        {address.phone}
                                        {address.alternatePhone ? " / " + address.alternatePhone : ""}
                                    </p>
                                    <p className="mt-2 text-white/70 leading-relaxed">
                                        {formattedAddress}
                                    </p>
                                    {address.landmark && (
                                        <p className="text-white/70">Landmark : {address.landmark}</p>
                                    )}
                                    {address.type === "Work" && (
                                        <p className="text-white/70">Delivery Time : 10AM to 6PM</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setMode("edit")}
                                    className="text-cyan-400 font-semibold text-sm hover:underline"
                                >
                                    Edit
                                </button>
                            </div>

                            <Button
                                onClick={() => setMode("default")}
                                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                            >
                                DELIVER HERE
                            </Button>
                        </div>
                    )}

                    {/* Edit Form */}
                    {mode === "edit" && (
                        <div className="space-y-4">
                            <Button
                                onClick={handleUseLocation}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            >
                                Use my current location
                            </Button>

                            {/* Name + Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={address.name}
                                        onChange={(e) =>
                                            setAddress({ ...address, name: e.target.value })
                                        }
                                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">
                                        10-digit mobile number
                                    </label>
                                    <input
                                        type="text"
                                        value={address.phone}
                                        onChange={(e) =>
                                            setAddress({ ...address, phone: e.target.value })
                                        }
                                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                    />
                                </div>
                            </div>

                            {/* Pincode + Locality */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        value={address.pincode}
                                        onChange={(e) =>
                                            setAddress({ ...address, pincode: e.target.value })
                                        }
                                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Locality</label>
                                    <input
                                        type="text"
                                        value={address.locality}
                                        onChange={(e) =>
                                            setAddress({ ...address, locality: e.target.value })
                                        }
                                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                    />
                                </div>
                            </div>

                            {/* Street */}
                            <div>
                                <label className="block text-sm mb-1">
                                    Address (Area and Street)
                                </label>
                                <textarea
                                    rows={2}
                                    value={address.street}
                                    onChange={(e) =>
                                        setAddress({ ...address, street: e.target.value })
                                    }
                                    className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                />
                            </div>

                            {/* City + State */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">City/District/Town</label>
                                    <input
                                        type="text"
                                        value={address.city}
                                        onChange={(e) =>
                                            setAddress({ ...address, city: e.target.value })
                                        }
                                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">State</label>
                                    <select
                                        value={address.state}
                                        onChange={(e) =>
                                            setAddress({ ...address, state: e.target.value })
                                        }
                                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                    >
                                        <option>Maharashtra</option>
                                        <option>Delhi</option>
                                        <option>Karnataka</option>
                                    </select>
                                </div>
                            </div>

                            {/* Landmark + Alternate Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        value={address.landmark}
                                        onChange={(e) =>
                                            setAddress({ ...address, landmark: e.target.value })
                                        }
                                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">
                                        Alternate Phone (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={address.alternatePhone}
                                        onChange={(e) =>
                                            setAddress({ ...address, alternatePhone: e.target.value })
                                        }
                                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                    />
                                </div>
                            </div>

                            {/* Address Type */}
                            <div>
                                <label className="block text-sm mb-2">Address Type</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Home"
                                            checked={address.type === "Home"}
                                            onChange={(e) =>
                                                setAddress({ ...address, type: e.target.value })
                                            }
                                        />
                                        Home (All day delivery)
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Work"
                                            checked={address.type === "Work"}
                                            onChange={(e) =>
                                                setAddress({ ...address, type: e.target.value })
                                            }
                                        />
                                        Work (Delivery between 10 AM - 5 PM)
                                    </label>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSaveAndDeliver}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold"
                                >
                                    SAVE & DELIVER HERE
                                </Button>
                                <Button variant="outline" onClick={() => setMode("expanded")}>
                                    CANCEL
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Order Summary Section */}
                <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
                    <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                    <ul className="divide-y divide-white/10">
                        {checkoutItems.map((it) => (
                            <li
                                key={it.id}
                                className="py-4 flex items-center justify-between gap-4"
                            >
                                {/* Left: Image */}
                                <div className="flex flex-col items-center">
                                    <img
                                        src={
                                            it.image // ✅ Prefer the image passed from ProductPage
                                                ? it.image
                                                : it.images
                                                    ? Object.values(it.images)[0]
                                                    : it.media
                                                        ? Object.values(it.media)[0]?.[0]?.src
                                                        : 'https://via.placeholder.com/150'
                                        }
                                        alt={it.name}
                                        className="w-24 h-24 object-cover rounded-md border border-white/10"
                                    />
                                </div>

                                {/* Middle: product details + qty/remove */}
                                <div className="flex-1">
                                    <p className="font-semibold text-base sm:text-lg">{it.name}</p>
                                    <p className="text-sm text-white/70 mt-1">
                                        <span className="font-semibold">Size:</span> {it.size || "N/A"}{" "}
                                        <span className="ml-4 font-semibold">Colour:</span>{" "}
                                        {it.color || "N/A"}
                                    </p>
                                    <p className="text-sm text-white/60 mt-1">Seller: <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">
                                        SHOES CABIN
                                    </span></p>

                                    {/* Price info */}
                                    <div className="mt-2 flex items-center gap-2 sm:hidden">
                                        <span className="font-bold text-lg">
                                            ₹{Number.isInteger(it.qty * it.price)
                                                ? (it.qty * it.price).toLocaleString("en-IN")
                                                : (it.qty * it.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>

                                    </div>

                                    {/* Qty + Remove row */}
                                    <div className="mt-3 flex items-center gap-2">

                                        {/* Qty counter for desktop */}
                                        <div className="flex items-center border border-yellow-400 rounded-full px-3 py-1 w-fit">
                                            <button
                                                onClick={() =>
                                                    setCheckoutItems((prev) =>
                                                        prev.map((p) =>
                                                            p.id === it.id && p.qty > 1
                                                                ? { ...p, qty: p.qty - 1 }
                                                                : p
                                                        )
                                                    )
                                                }
                                                className="px-2 font-bold text-lg"
                                            >
                                                –
                                            </button>
                                            <span className="px-2">{it.qty}</span>
                                            <button
                                                onClick={() =>
                                                    setCheckoutItems((prev) =>
                                                        prev.map((p) =>
                                                            p.id === it.id ? { ...p, qty: p.qty + 1 } : p
                                                        )
                                                    )
                                                }
                                                className="px-2 font-bold text-lg"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Remove button same size as qty counter */}
                                        <button
                                            onClick={() => {
                                                if (checkoutItems.length === 1) {
                                                    setCheckoutItems([]);
                                                    setShowEmptyModal(true);
                                                } else {
                                                    setCheckoutItems((prev) => prev.filter((p) => p.id !== it.id));
                                                }
                                            }}
                                            className="flex items-center justify-center border border-red-500 text-red-500 rounded-full px-4 py-1 font-semibold text-sm hover:bg-red-500 hover:text-white transition"
                                        >
                                            REMOVE
                                        </button>
                                    </div>
                                </div>

                                {/* Right: Price for desktop */}
                                <div className="hidden sm:block font-bold text-lg sm:min-w-[80px] text-right">
                                    ₹{Number.isInteger(it.qty * it.price)
                                        ? (it.qty * it.price).toLocaleString("en-IN")
                                        : (it.qty * it.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
                        <p className="font-semibold">Total</p>
                        <p className="font-bold">
                            ₹{Number.isInteger(computedTotal)
                                ? computedTotal.toLocaleString("en-IN")
                                : computedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* 3. Payment Section */}
                <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur space-y-4">
                    <h2 className="font-semibold text-lg">Payment Method</h2>

                    {/* Main Payment Dropdown */}
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-cyan-400"
                    >
                        <option value="">-- Select Payment Method --</option>
                        <option className="bg-[#0f172a] text-white" value="upi">
                            UPI
                        </option>
                    </select>

                    {/* Sub-options when UPI is chosen */}
                    {paymentMethod === "upi" && (
                        <div className="space-y-3 mt-2">
                            <p className="text-sm text-white/80">Choose UPI App</p>
                            <div className="flex flex-col gap-3">
                                {/* Google Pay */}
                                <div className="p-3 border border-white/10 rounded-lg">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="upiOption"
                                            value="gpay"
                                            checked={upiOption === "gpay"}
                                            onChange={(e) => setUpiOption(e.target.value)}
                                        />
                                        <img
                                            src="https://i.pinimg.com/originals/4b/3a/d6/4b3ad6744af7f31c9fb3b08715bef0f4.png"
                                            alt="Google Pay"
                                            className="w-4 h-4 object-contain"
                                        />
                                        <span className="font-medium text-lg">Google Pay</span>
                                    </label>

                                    {/* Show pay button when selected */}
                                    {upiOption === "gpay" && (
                                        <Button
                                            onClick={handleWhatsAppRedirect}
                                            className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                                        >
                                            Pay via WhatsApp ₹{Number.isInteger(computedTotal)
                                                ? computedTotal.toLocaleString("en-IN")
                                                : computedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

                                        </Button>

                                    )}
                                </div>

                                {/* PhonePe */}
                                <div className="p-3 border border-white/10 rounded-lg">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="upiOption"
                                            value="phonepe"
                                            checked={upiOption === "phonepe"}
                                            onChange={(e) => setUpiOption(e.target.value)}
                                        />
                                        <img
                                            src="https://cdn.freelogovectors.net/wp-content/uploads/2023/11/phonepe_logo-freelogovectors.net_.png"
                                            alt="PhonePe"
                                            className="w-6 h-6 object-contain"
                                        />
                                        <span className="font-medium text-lg">PhonePe</span>
                                    </label>

                                    {/* Show pay button when selected */}
                                    {upiOption === "phonepe" && (
                                        <Button
                                            onClick={handleWhatsAppRedirect}
                                            className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                                        >
                                            Pay via WhatsApp ₹{Number.isInteger(computedTotal)
                                                ? computedTotal.toLocaleString("en-IN")
                                                : computedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

                                        </Button>

                                    )}
                                </div>
                            </div>
                        </div>
                    )}



                    <Button
                        onClick={handleWhatsAppRedirect}
                        className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold"
                    >
                        Place Order (₹{Number.isInteger(computedTotal)
                            ? computedTotal.toLocaleString("en-IN")
                            : computedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        )
                    </Button>
                </div>


                {/* Empty checkout modal */}
                <AnimatePresence>
                    {showEmptyModal && (
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8 max-w-md w-full text-center"
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Your checkout has no items.</h3>
                                <p className="text-white/70 mb-6">Please go back to your cart.</p>
                                <Button
                                    onClick={() => navigate("/cart")}
                                    className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold"
                                >
                                    GO TO CART
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </section>
        </>
    );
}