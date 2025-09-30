import React from "react";

const categories = [
  { name: "Vegetables", value: "vegetables" },
  { name: "Fruits", value: "fruits" },
  { name: "Drinks", value: "drinks" },
  { name: "Snacks", value: "snacks" },
  { name: "Cakes", value: "cakes" },
];

export default function NavBar({ selectedCategory, onSelectCategory }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-16 py-2">

          {/* Category Links - Responsive */}
          <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 w-full justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.value
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

