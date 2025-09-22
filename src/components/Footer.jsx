import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { toast } from '@/components/ui/use-toast.js';

export default function Footer() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;

    setLoading(true);
    try {
      const res = await fetch('https://formspree.io/f/xzzandwb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast({
          title: 'Subscribed 🎉',
          description: 'Thank you for subscribing to our CABIN!',
        });
        form.reset();
      } else {
        toast({
          title: 'Oops!',
          description: 'Something went wrong. Please try again later.',
        });
      }
    } catch (err) {
      toast({
        title: 'Network Error',
        description: 'Could not connect to the server. Try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-16 bg-black/30 backdrop-blur border-t border-white/10">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand Block */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">
            SHOES CABIN
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Crafted with care to keep your steps bold and comfy. Explore sneakers that elevate your style.
          </p>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} SHOES CABIN. All rights reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Footer navigation" className="flex flex-col gap-3">
          <Link to="/shop" className="text-sm text-white/70 hover:text-white transition">Shop</Link>
          <Link to="/cart" className="text-sm text-white/70 hover:text-white transition">Cart</Link>
          <Link to="/contact" className="text-sm text-white/70 hover:text-white transition">Contact Us</Link>
        </nav>

        {/* Newsletter */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium uppercase bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">Stay Updated</h3>
          <p className="text-sm text-white/70">Subscribe to get notified about new drops.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              name="email"
              required
              className="flex-1 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              placeholder="Your email address"
              aria-label="Email"
            />
            <button
              type="submit"
              disabled={loading}
              className="relative flex items-center justify-center rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black text-sm px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-fuchsia-400 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Subscribe"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Social Icons */}
      <div className="container mx-auto px-6">
        <div className="border-t border-white/10 py-6 flex justify-center gap-8">
          {[
            { Icon: FaInstagram, href: 'https://www.instagram.com/shoescabin', label: 'Instagram', gradient: 'from-pink-500 to-yellow-400' },
            { Icon: FaFacebookF, href: 'https://www.facebook.com/profile.php?id=61580998449703', label: 'Facebook', gradient: 'from-blue-500 to-cyan-400' },
            { Icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', gradient: 'from-sky-400 to-cyan-300' },
          ].map(({ Icon, href, label, gradient }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group relative"
            >
              <span
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} blur-sm opacity-40 group-hover:opacity-80 transition`}
              />
              <Icon className="relative text-xl text-white/80 group-hover:text-white transition" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
