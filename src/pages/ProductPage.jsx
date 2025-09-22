import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductById, getRelatedProducts } from '@/data/products.js';
import { Button } from '@/components/ui/button.jsx';
import { useCart } from '@/store/CartContext.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { motion } from 'framer-motion';
import RelatedProductsCarousel from '@/components/RelatedProductsCarousel.jsx';

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = getProductById(productId);
  const relatedProducts = getRelatedProducts(productId);
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [selectedMedia, setSelectedMedia] = React.useState(null);

  React.useEffect(() => {
    if (product) {
      const firstColor = product.colors?.[0];
      setSelectedColor(firstColor || null);

      setSelectedSize(null);

      const firstMedia = firstColor && product.media[firstColor.name]
        ? product.media[firstColor.name][0]
        : null;
      setSelectedMedia(firstMedia);

      window.scrollTo(0, 0);
    }
  }, [productId, product]);


  const handleColorChange = (color) => {
    setSelectedColor(color);
    const media = product.media[color.name]?.[0] || null;
    setSelectedMedia(media);
  };


  if (!product) {
    return (
      <div className="container mx-auto pt-10 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button onClick={() => navigate('/shop')} className="mt-4">
          Back to Shop
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Hold on!',
        description: 'Please select a size first.',
        variant: 'destructive'
      });
      return;
    }

    // Generate a unique key for this specific variant
    const uniqueId = `${product.id}-${selectedColor.name}-${selectedSize}`;

    addItem({
      ...product,
      id: uniqueId, // ✅ use unique ID instead of just product.id
      color: selectedColor.name,
      size: selectedSize,
      qty: 1,
      image: selectedMedia?.src
    });
  };



  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: "Hold on!",
        description: "Please select a size first.",
        variant: "destructive",
      });
      return;
    }

    const uniqueId = `${product.id}-${selectedColor.name}-${selectedSize}`;

    addItem({
      ...product,
      id: uniqueId, // ✅ unique ID
      color: selectedColor.name,
      size: selectedSize,
      qty: 1,
      image: selectedMedia?.src
    });

    navigate(`/checkout/${uniqueId}`);
  };



  return (
    <>
      <Helmet>
        <title>{`SHOES CABIN | ${product.name}`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <section className="container mx-auto pt-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">

            {selectedMedia && (
              <motion.div
                key={selectedMedia.src}
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden aspect-square"
              >
                {selectedMedia.type === 'image' ? (
                  <img src={selectedMedia.src} alt="" className="w-full h-full object-cover" />
                ) : (
                  <video src={selectedMedia.src} controls className="w-full h-full object-cover" />
                )}
              </motion.div>
            )}


            {/* Thumbnail Row */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {(product.media[selectedColor?.name] || []).map((m, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMedia(m)}
                  className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 
        ${selectedMedia?.src === m.src ? 'border-fuchsia-400' : 'border-white/20 hover:border-white/40'}`}
                >
                  {m.type === 'image' ? (
                    <img src={m.src} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <video src={m.src} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="text-2xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">
              ₹{Number.isInteger(product.price)
                ? product.price.toLocaleString("en-IN")
                : product.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>

            <div className="text-white/70 mt-4 space-y-4">
              {product.description.split('\n\n').map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>


            <div className="mt-6">
              <p className="text-sm font-semibold">Color: <span className="text-white/80">{selectedColor?.name}</span></p>
              <div className="flex items-center gap-3 mt-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorChange(color)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all 
      ${selectedColor?.name === color.name
                        ? 'border-fuchsia-400 scale-110'
                        : 'border-white/20 hover:border-white/40'}`}
                  >
                    {product.media[color.name]?.[0] && (
                      <img
                        src={product.media[color.name][0].src}
                        alt={`${product.name} in ${color.name}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}

              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold">Size</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'secondary' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                    className={`border-white/15 ${selectedSize !== size && 'bg-white/5 text-white hover:bg-white/10'}
                      ${selectedSize === size && 'bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black'}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 grid sm:grid-cols-2 gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold"
              >
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-16 mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">You Might Also Like</h2>
        <RelatedProductsCarousel products={relatedProducts} />
      </section>
    </>
  );
}
