import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import MainNavBar from "../Components/MainNavBar";

const ProductDetailPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0); // Track which image is selected
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // fetch product by ID
    setLoading(true);
    fetch(`http://localhost:5000/api/v1/products/productdetails/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);


  if (loading) return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-4"></div>
        <div className="h-64 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-center">
      <p className="text-red-500 text-xl">❌ Product not found</p>
    </div>
  );

  // Handle multiple images - if product has images array, use it; otherwise use single image
  const productImages = product.images && Array.isArray(product.images) 
    ? product.images 
    : product.image_url 
      ? [product.image_url] 
      : [];

  // Create multiple variations of the same image for demo (you can remove this when you have actual multiple images)
  const demoImages = productImages.length > 0 ? [
    productImages[0],
    productImages[0], // Same image with different view (you'll replace with actual different angles)
    productImages[0], // Same image with different view
    productImages[0]  // Same image with different view
  ] : [];

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, Math.min(parseInt(product.stock_quantity), prev + change)));
  };

  //====================================================================================================
const handleAddToCart = async (qty) => {
  try {
    const userId = 1;
    const response = await fetch(
      `http://localhost:5000/api/v1/customer/${userId}/addToCart/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: qty }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      alert("✅ Product added to cart successfully!");
    } else {
      alert("⚠️ " + (data.message || 'Failed to add product to cart'));
    }

  } catch (error) {
    console.error("❌ Error:", error);
    alert("❌ Error adding product to cart",error);
  }
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-2 mb-2">
      <MainNavBar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <a href="#" className="text-gray-700 hover:text-blue-600">Products</a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              {demoImages.length > 0 && (
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={demoImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                </div>
              )}
              
              {/* Thumbnail Images */}
              {demoImages.length > 1 && (
                <div className="flex space-x-3">
                  {demoImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-blue-500 ring-2 ring-blue-200 shadow-md transform scale-105' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {demoImages.length > 1 && (
                <div className="text-center">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {selectedImage + 1} of {demoImages.length}
                  </span>
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Added:</span>
                    <span className="text-sm text-gray-700 font-medium">
                      {formatDate(product.created_at)}
                    </span>
                  </div>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {product.longDescription}

                </p>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                    Best Price
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $50 • 30-day returns
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    parseInt(product.stock_quantity) > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`font-medium ${
                    parseInt(product.stock_quantity) > 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {parseInt(product.stock_quantity) > 0 
                      ? `In Stock (${product.stock_quantity} available)` 
                      : 'Out of Stock'
                    }
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <span className="text-lg font-medium">−</span>
                    </button>
                    <span className="px-6 py-3 font-semibold text-lg border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={quantity >= parseInt(product.stock_quantity)}
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total: ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAddToCart(quantity)}
                    disabled={parseInt(product.stock_quantity) <= 0}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    disabled={parseInt(product.stock_quantity) <= 0}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ProductDetailPage;