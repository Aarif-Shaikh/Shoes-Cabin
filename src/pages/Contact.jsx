// import React from 'react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

export default function Contact() {
  const [activeIndex, setActiveIndex] = useState(0);
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name');
    if (!name) return;
    toast({
      title: `Thanks, ${name}!`,
      description: "We've received your message and will reply soon.",
    });
    e.currentTarget.reset();
  };

  return (
    <>
      <Helmet>
        <title>SHOES CABIN | Contact Us</title>
        <meta
          name="description"
          content="Contact SHOES CABIN for support, sizing help, or product questions. We're here to help."
        />
      </Helmet>

      <section className="container mx-auto pt-16 pb-24">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Get in Touch
          </h1>
          <p className="text-white/70 mt-3">
            We'd love to hear from you. Whether you have a question about sizing, orders, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 mt-14">
          <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 text-center">
            <Mail className="mx-auto mb-3 text-fuchsia-400" size={28} />
            <h3 className="text-white font-semibold">Email</h3>
            <a
              href="mailto:shoescabin.store@gmail.com"
              className="text-sm text-white/70 hover:text-fuchsia-400 hover:underline"
            >
              shoescabin.store@gmail.com
            </a>

          </div>
          <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 text-center">
            <Phone className="mx-auto mb-3 text-fuchsia-400" size={28} />
            <h3 className="text-white font-semibold">Phone</h3>
            <div className="flex items-center justify-center gap-2">
              <a
                href="tel:+919987257764"
                className="text-sm text-white/70 hover:text-fuchsia-400 hover:underline"
              >
                +91 9987257764
              </a>
              <span className="text-sm text-white/50">/</span>
              <a
                href="tel:+917400061131"
                className="text-sm text-white/70 hover:text-fuchsia-400 hover:underline"
              >
                +91 7400061131
              </a>
            </div>

          </div>

          <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 text-center">
            <Clock className="mx-auto mb-3 text-fuchsia-400" size={28} />
            <h3 className="text-white font-semibold">Hours</h3>
            <p className="text-sm text-white/70">Everyday, 10 AM–10.30 PM</p>
          </div>
          <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 text-center">
            <MapPin className="mx-auto mb-3 text-fuchsia-400" size={28} />
            <h3 className="text-white font-semibold">Location</h3>
            <p className="text-sm text-white/70">Thane, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-16 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Send us a message</h2>
          <form
            className="grid gap-4 rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur"
            onSubmit={async (e) => {
              e.preventDefault();

              const form = e.currentTarget;
              const fd = new FormData(form);

              try {
                const res = await fetch('https://formspree.io/f/xandrogn', {
                  method: 'POST',
                  body: fd,
                  headers: { Accept: 'application/json' },
                });

                if (res.ok) {
                  toast({
                    title: 'Thanks!',
                    description: "We've received your message and will reply soon.",
                  });
                  form.reset();
                } else {
                  toast({
                    title: 'Error',
                    description: 'Something went wrong. Please try again later.',
                    variant: 'destructive',
                  });
                }
              } catch (err) {
                toast({
                  title: 'Error',
                  description: 'Unable to send your message. Please try again.',
                  variant: 'destructive',
                });
              }
            }}
          >
            <label className="grid gap-1">
              <span className="text-sm text-white/80">Name</span>
              <input
                name="name"
                required
                className="rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                placeholder="Jane Doe"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-white/80">Email</span>
              <input
                type="email"
                name="email"
                required
                className="rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                placeholder="jane@example.com"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-white/80">Message</span>
              <textarea
                name="message"
                required
                rows="5"
                className="rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                placeholder="How can we help?"
              />
            </label>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold"
              >
                Send message
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                onClick={() => {
                  toast({
                    title: '📞 Call Support',
                    description: (
                      <div className="flex flex-col mt-2 space-y-1">
                        <a href="tel:+919987257764" className="text-fuchsia-400 underline">+91 9987257764</a>
                        <a href="tel:+917400061131" className="text-fuchsia-400 underline">+91 7400061131</a>
                      </div>
                    ),
                  });
                }}
              >
                Call support
              </Button>
            </div>
          </form>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">Visit our store</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.756024232584!2d73.0287989!3d19.162153999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bf71fd736d99%3A0xa74cc2216702b2be!2sMUMBAI%20CHAAT!5e0!3m2!1sen!2sin!4v1758179705682!5m2!1sen!2sin"
            className="w-full h-80 rounded-2xl border border-white/10"
            loading="lazy"
          ></iframe>
        </div>

        {/* Carousel Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6 text-center">Meet the Owners</h2>

          <div className="relative max-w-5xl mx-auto px-4 md:px-0">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              loop={false}
              slidesPerView={1}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: true,
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              onSwiper={(swiper) => setActiveIndex(swiper.activeIndex)}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 0,
                  coverflowEffect: {
                    rotate: 0, stretch: 0,
                    depth: 600,
                    modifier: 3,
                    slideShadows: false
                  }
                },
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 20,
                  coverflowEffect: {
                    rotate: 0, stretch: 0,
                    depth: 300,
                    modifier: 2.2,
                    slideShadows: true
                  }
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                  coverflowEffect: {
                    rotate: 0, stretch: 0,
                    depth: 180,
                    modifier: 1.6,
                    slideShadows: true
                  }
                },
                1024: {
                  slidesPerView: 2.5,
                  spaceBetween: 40,
                  coverflowEffect: {
                    rotate: 0, stretch: 0,
                    depth: 100,
                    modifier: 1.2,
                    slideShadows: true
                  }
                }
              }}



              modules={[EffectCoverflow, Pagination, Navigation]}
              className="py-12"
            >
              {[
                { name: 'Arif Shaikh', role: 'Founder', img: '/cabinMaterials/Arif2.jpg' },
                { name: 'Shadman', role: 'Founder', img: '/cabinMaterials/Shadman.jpg' },
              ].map((person, i) => (
                <SwiperSlide
                  key={i}
                  className="flex items-center justify-center w-full h-[380px] sm:h-[400px] md:h-[380px] lg:h-[380px]"
                >

                  <div
                    className={`
                        w-[220px] sm:w-[340px] md:w-[360px] lg:w-[380px]
                        transition-all duration-500 rounded-2xl border border-white/10 text-center backdrop-blur
                        p-6 bg-white/5 h-full flex flex-col justify-center items-center
                        ${i === activeIndex
                        ? 'scale-110 opacity-100 shadow-xl shadow-fuchsia-500/30 z-20'
                        : 'scale-90 opacity-50 blur-[1px] z-0'}
                  `}
                  >
                    <img
                      src={person.img}
                      alt={person.name}
                      className="w-24 h-24 xs:w-26 xs:h-26 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto rounded-full mb-3 xs:mb-4 sm:mb-5 object-cover border border-white/10"
                    />
                    <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white">{person.name}</h3>
                    <p className="text-xs xs:text-sm text-white/60 mt-1 xs:mt-2">{person.role}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}