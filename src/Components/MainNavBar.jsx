import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";

const MainNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = 0;
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 font-sans" >ShoppingCart</span>
          </div>

          {/* Desktop Links + Cart */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/"
              className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </a>
            <a
              href="/contact"
              className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </a>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button + Cart */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <a
                href="/"
                className="text-gray-900 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/contact"
                className="text-gray-500 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavBar;