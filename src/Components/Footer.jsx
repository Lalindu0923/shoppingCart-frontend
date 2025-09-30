import React from 'react'
import {ShoppingCart } from 'lucide-react';

const Footer = () => {
  return (
      <footer className="bg-gray-900 py-8 sm:py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-white">Shoping Cart</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p className="text-sm sm:text-base">&copy; 2025 HomeDesign. All rights reserved.</p>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base">Crafting beautiful homes since 2020</p>
            </div>
          </div>
        </div>
      </footer>
  )
};

export default Footer;