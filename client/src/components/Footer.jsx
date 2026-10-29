import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import Logo from './Logo.jsx';

const socials = [
  { icon: FaInstagram, label: 'Instagram' },
  { icon: FaXTwitter, label: 'X' },
  { icon: FaLinkedinIn, label: 'LinkedIn' },
]

const Footer = () => {
  return (
    <footer className="mt-auto bg-ink-grade text-ink-100">
      <div className="container mx-auto grid gap-10 py-12 md:grid-cols-[1.4fr,1fr,1fr]">

        <div className="max-w-sm">
          <Logo tone="ink" />
          <p className="mt-4 text-sm leading-relaxed text-ink-200">
            Everyday groceries, sourced daily and priced fairly. Built for the
            weekly shop, not the panic buy.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {
              socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-ink-100 transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon size={15} />
                </a>
              ))
            }
          </div>
        </div>

        <div>
          <p className="eyebrow text-ink-300">Shop</p>
          <ul className="mt-4 grid gap-2.5 text-sm">
            <li><Link to="/" className="text-ink-200 transition-colors hover:text-brand">All categories</Link></li>
            <li><Link to="/search" className="text-ink-200 transition-colors hover:text-brand">Search</Link></li>
            <li><Link to="/cart" className="text-ink-200 transition-colors hover:text-brand">Your cart</Link></li>
            <li><Link to="/dashboard/myorders" className="text-ink-200 transition-colors hover:text-brand">Orders</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-300">Account</p>
          <ul className="mt-4 grid gap-2.5 text-sm">
            <li><Link to="/dashboard/profile" className="text-ink-200 transition-colors hover:text-brand">Profile</Link></li>
            <li><Link to="/dashboard/address" className="text-ink-200 transition-colors hover:text-brand">Saved addresses</Link></li>
            <li><Link to="/login" className="text-ink-200 transition-colors hover:text-brand">Log in</Link></li>
            <li><Link to="/register" className="text-ink-200 transition-colors hover:text-brand">Create account</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-300 sm:flex-row">
          <p>© {new Date().getFullYear()} GoKart. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-brand">Privacy</a>
            <a href="#" className="transition-colors hover:text-brand">Terms</a>
            <a href="#" className="transition-colors hover:text-brand">Support</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
