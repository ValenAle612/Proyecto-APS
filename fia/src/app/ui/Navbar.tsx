// app/ui/Navbar.tsx
'use client';

import Link from "next/link";
import { useState } from "react";
import { AiOutlineUser, AiOutlineShopping, AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Session } from "next-auth";

type NavbarProps = {
  session: Session | null;
};

const navLinkClass =
  "relative text-white text-sm transition-transform duration-300 hover:scale-105";

const underlineClass = `
  after:content-[''] after:absolute after:-bottom-1 after:left-0
  after:w-0 after:h-[1px] after:bg-white
  hover:after:w-full after:transition-all after:duration-300
`;

/**
 * Renders the navigation bar for the application, including links to home, catalog, and user/cart pages.
 * Displays icons for search, shopping cart, and user profile with interactive search overlay functionality.
 * Handles responsive design with a mobile menu toggle.
 * Manages the state for search overlay visibility, current search query, and mobile menu visibility.
 */

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-dcic_gray_lighter bg-opacity-70 backdrop-blur-md z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-dcic_blue text-xl font-semibold hover:opacity-80 transition">
            <strong className="text-white">DCIC</strong>_books
          </Link>

          {/* Menú de navegación principal para desktop */}
          <div className="hidden md:flex ml-6 space-x-6 justify-center">
            <Link href="/" className={`${navLinkClass} ${underlineClass}`}>
              Home
            </Link>
            <Link href="/catalog" className={`${navLinkClass} ${underlineClass}`}>
              Catalog
            </Link>
          </div>


            {/* Botón de hamburguesa para móvil */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-5 h-5 relative flex items-center justify-center"
              aria-label="Toggle Mobile Menu"
            >
              <span
                className={`absolute h-0.5 w-4 bg-white transition-all duration-300 ease-in-out
                  ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}
                `}
              />
              <span
                className={`absolute h-0.5 w-4 bg-white transition-all duration-300 ease-in-out
                  ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}
                `}
              />
              <span
                className={`absolute h-0.5 w-4 bg-white transition-all duration-300 ease-in-out
                  ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}
                `}
              />
            </button>
          </div>

        {/* Menú móvil desplegable */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-500 ease-in-out
            bg-dcic_darkGray bg-opacity-70 px-6 border-dcic_darkGray
            backdrop-blur-md z-50 shadow-md
            ${isMobileMenuOpen ? 'max-h-64 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}
          `}
        >
          <div className="flex flex-col space-y-4 transition-opacity duration-300 delay-100">
            <Link href="/" className={`${navLinkClass} ${underlineClass}`} onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link href="/catalog" className={`${navLinkClass} ${underlineClass}`} onClick={toggleMobileMenu}>
              Catalog
            </Link>
          </div>
        </div>

      </nav>
    </>
  );
}