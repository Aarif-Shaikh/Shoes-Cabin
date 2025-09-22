import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { heroSliderProducts } from '@/data/heroSliderProducts.js';

// Hook for responsive breakpoint
function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default function HeroSlider() {
  const [center, setCenter] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const hideButtons = useMediaQuery("(max-width: 1200px)");
  const navigate = useNavigate();

  const prev = () =>
    setCenter((c) => (c + heroSliderProducts.length - 1) % heroSliderProducts.length);
  const next = () => setCenter((c) => (c + 1) % heroSliderProducts.length);

  const slot = (idx) => {
    if (idx === center) return "center";
    if ((center + 1) % heroSliderProducts.length === idx) return "right";
    if ((center - 1 + heroSliderProducts.length) % heroSliderProducts.length === idx) return "left";
    return "hidden";
  };

  const getMotion = (pos) => {
    if (!isMobile) {
      switch (pos) {
        case "center":
          return { 
            x: 0, 
            scale: 1.15, 
            rotateY: 0, 
            zIndex: 40, 
            opacity: 1, 
            filter: "brightness(1) blur(0px)", 
            translateZ: 80 
          };
        case "left":
          return { 
            x: -300, 
            scale: 0.9, 
            rotateY: 30, 
            zIndex: 20, 
            opacity: 0.6, 
            filter: "brightness(0.8) blur(2px)", 
            translateZ: -100 
          };
        case "right":
          return { 
            x: 300, 
            scale: 0.9, 
            rotateY: -30, 
            zIndex: 20, 
            opacity: 0.6, 
            filter: "brightness(0.8) blur(2px)", 
            translateZ: -100 
          };
        case "hidden":
          return { x: 0, scale: 0.6, rotateY: 0, zIndex: 0, opacity: 0 };
        default:
          return {};
      }
    } else {
      switch (pos) {
        case "center":
          return { y: 0, scale: 1.1, zIndex: 30, opacity: 1, filter: "brightness(1) blur(0px)" };
        case "left":
          return { y: -200, scale: 0.85, zIndex: 20, opacity: 0.6, filter: "brightness(0.8) blur(2px)" };
        case "right":
          return { y: 200, scale: 0.85, zIndex: 20, opacity: 0.6, filter: "brightness(0.8) blur(2px)" };
        case "hidden":
          return { y: 0, scale: 0.7, zIndex: 0, opacity: 0 };
        default:
          return {};
      }
    }
  };

  const handleDragEnd = (event, info) => {
    if (!isMobile) {
      if (info.offset.x > 80) prev();
      else if (info.offset.x < -80) next();
    } else {
      if (info.offset.y > 80) prev();
      else if (info.offset.y < -80) next();
    }
  };

  // Auto-slide every 4s (pause on hover)
  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCenter((c) => (c + 1) % heroSliderProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, center]);

  return (
    <section
      aria-label="Featured shoe slider"
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`relative mx-auto flex items-center justify-center py-8 perspective-[1600px] ${
          isMobile ? "flex-col" : "flex-row"
        }`}
      >
        <div
          className={`relative w-full max-w-5xl overflow-visible flex items-center justify-center ${
            isMobile ? "h-[550px]" : "h-[400px]"
          }`}
        >
          {heroSliderProducts.map((product, i) => (
            <motion.div
              key={product.id}
              className="absolute cursor-pointer transition-all duration-500"
              animate={getMotion(slot(i))}
              transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
              drag={isMobile ? "y" : "x"}
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={handleDragEnd}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className={`w-[260px] md:w-[360px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ${
                  slot(i) === "center"
                    ? "shadow-black/50"
                    : "shadow-black/70"
                }`}
              >
                <img
                  className="w-full h-full object-cover"
                  src={product.image}
                  alt={product.name}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {!hideButtons && (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous shoe"
              onClick={prev}
              className="absolute left-[12%] rounded-full bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Next shoe"
              onClick={next}
              className="absolute right-[12%] rounded-full bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center gap-2 mt-1">
        {heroSliderProducts.map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={[
              "h-1.5 rounded-full transition-all",
              center === i
                ? "w-6 bg-gradient-to-r from-fuchsia-400 to-cyan-300"
                : "w-2 bg-white/30",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}
