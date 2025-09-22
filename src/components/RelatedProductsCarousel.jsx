import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function RelatedProductCard({ product }) {
  const defaultImage =
    product.media && Object.values(product.media)[0]?.[0]?.src
      ? Object.values(product.media)[0][0].src
      : 'https://via.placeholder.com/300';


  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="flex-none w-full sm:w-1/2 lg:w-1/3 p-2 group"
    >
      <Link to={`/product/${product.id}`} className="block rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-3 shadow-lg group-hover:shadow-cyan-400/10 transition-shadow h-full flex flex-col">
        <div className="block rounded-xl overflow-hidden aspect-[4/3] border border-white/10">
          <img src={defaultImage} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-white/70">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function RelatedProductsCarousel({ products }) {
  const scrollRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft <
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      );
    }
  };

  React.useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollability);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollability);
      }
    };
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8; // Scroll 80% of current view width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 -mx-2 scrollbar-hide snap-x snap-mandatory"
      >
        {products.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
      {canScrollLeft && (
        <Button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-lg transition-all duration-300"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      {canScrollRight && (
        <Button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-lg transition-all duration-300"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}