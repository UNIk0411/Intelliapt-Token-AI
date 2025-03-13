
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import WalletConnect from './WalletConnect';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-subtle py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-aptos flex items-center justify-center mr-2">
                <span className="text-white font-semibold text-lg">Aι</span>
              </div>
              <span className="text-darkText font-semibold text-xl">TokenAI</span>
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#predictions" className="text-darkText hover:text-aptos transition-colors">
              Predictions
            </a>
            <a href="#tokens" className="text-darkText hover:text-aptos transition-colors">
              Tokens
            </a>
            <a href="#how-it-works" className="text-darkText hover:text-aptos transition-colors">
              How It Works
            </a>
            <WalletConnect />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-darkText"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t mt-2 animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <a
              href="#predictions"
              className="block py-2 text-darkText"
              onClick={() => setIsMenuOpen(false)}
            >
              Predictions
            </a>
            <a
              href="#tokens"
              className="block py-2 text-darkText"
              onClick={() => setIsMenuOpen(false)}
            >
              Tokens
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-darkText"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <div className="pt-2">
              <WalletConnect isMobile />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
