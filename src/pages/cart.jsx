import React, { useEffect, useState } from "react";
import MainNavBar from "../Components/MainNavBar";
import CartItems from "../Components/cartitems";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);

  // Fetch cart from backend
  useEffect(() => {
    const userId = 1;
    axios
      .get(`http://localhost:5000/api/v1/cart/${userId}/getCart`)
      .then((res) => setCart(res.data.data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  // Calculate total
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate total items
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Clear cart (backend + frontend)
  const clearCart = () => {
    const userId = 1;
    axios
      .delete(`http://localhost:5000/api/v1/cart/${userId}/clear`)
      .then(() => {
      setCart([]); // reset state when backend confirms
    })
      .catch((err) => console.error("Error clearing cart:", err));
  };

  const handleCheckout = () => {
    const userId = 1;

    axios
      .post(`http://localhost:5000/api/v1/cart/order/${userId}`)
      .then((res) => {
        alert(`✅ Order placed successfully! Order ID: ${res.data.orderId}`);
      })
      .catch((err) => {
        console.error("Error placing order:", err);
        alert("❌ Failed to place order. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] font-sans relative overflow-hidden">
      <MainNavBar />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 sm:mb-8 text-center p-6 sm:p-8 md:p-10 mx-4 rounded-2xl relative overflow-hidden text-white shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-700">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">Shopping Cart</h1>
        <p className="text-base sm:text-lg font-light opacity-90">
          Items in cart: {totalItems}
        </p>
      </div>

      {/* Cart Items (passing data as props) */}
      <div className="px-4">
        <CartItems cart={cart} setCart={setCart} />
      </div>

      {/* Summary */}
      <div className="max-w-6xl mx-auto mt-6 sm:mt-8 p-4 sm:p-6 md:p-8 mx-4 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-4 sm:mb-6 p-4 sm:p-6 rounded-xl border-2 border-transparent relative bg-gradient-to-br from-gray-50 to-gray-200">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 relative z-10">
            Total: {totalAmount.toFixed(2)} LKR
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
          <button
            onClick={clearCart}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-white font-semibold uppercase shadow-md bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 transition-all text-sm sm:text-base"
          >
            Clear Cart
          </button>

          <button 
          onClick={handleCheckout}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-white font-semibold uppercase shadow-md bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all text-sm sm:text-base">
            Proceed to Checkout
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-white font-semibold uppercase shadow-md bg-gradient-to-br from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 transition-all text-sm sm:text-base"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;