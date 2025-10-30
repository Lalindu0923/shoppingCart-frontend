import React, { useState } from "react";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/navBar";
import Footer from "../Components/Footer";
import MainNavBar from "../Components/MainNavBar";


export default function SimpleHomeDesign() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const cartItemCount = 0;
  const [searchTerm, setSearchTerm] = useState("");

  // Map category values to backend IDs
  const categoryMap = {
    vegetables: 1,
    fruits: 2,
    drinks: 3,
    snacks: 4,
    cakes: 5,
  };

  // Called when user clicks a category button
  const handleCategoryClick = (categoryValue) => {
    setSelectedCategory(categoryValue);

    const categoryId = categoryMap[categoryValue];
    fetch(`http://localhost:5000/api/v1/products/categories/${categoryId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.data))
      .catch((err) => console.error(err));
  };

  const handleViewDetails = (id) => {
    navigate(`product/${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-0 font-roboto">
      <MainNavBar />

      {/* --- Hero Section --- */}
      <section className="relative  text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
          backgroundSize: 'cover',}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat">
            Unlimited <span className="text-indigo-600">SHOPPING</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start shopping with us today
          </p>
        </div>
      </section>

      {/* --- Category NavBar --- */}
      <NavBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryClick}
      />
      {/* --- Search Bar --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
        />
      
      </div>
      {/* --- Products Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 && (
              <p className="col-span-full text-gray-500">
                Select a category to see products
              </p>
            )}
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                <div className="h-48 bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {product.name}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="font-bold mb-4">${product.price}</p>
                  <p>{product.id}</p>
                  <button 
                  onClick={() => handleViewDetails(product.id)}
                  className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center">
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
