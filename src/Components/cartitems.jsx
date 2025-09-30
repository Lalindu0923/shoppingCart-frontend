import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";


const CartItems = () => {
  const [cart, setCart] = useState([]);

  // Remove an item by id
  const removeFromCart = (id) => {
    console.log("Removing item with id:", id);
    // Call backend DELETE API
    axios
      .delete(`http://localhost:5000/api/v1/cart/1/removeItem/${id}`)
      .then(() => {
        setCart(cart.filter((item) => item.id !== id));
      })
      .catch((err) => console.error("Error removing item:", err));
  };


  useEffect(() => {
    const userId = 1;
    axios
      .get(`http://localhost:5000/api/v1/cart/${userId}/getCart`)
      .then((res) => setCart(res.data.data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);


  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-10 bg-white shadow-md rounded-xl">
        <p className="text-gray-600 text-lg">🛒 Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <tr>
            <th className="p-4">Product</th>
            <th className="p-4 text-center">Price (LKR)</th>
            <th className="p-4 text-center">Quantity</th>
            <th className="p-4 text-center">Total</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr
              key={item.id}
              className="border-b last:border-none hover:bg-gray-50 transition"
            >
              {/* Product name */}
              {/* <p>{item.id}</p> */}
              <td className="p-4 font-semibold text-gray-800">{item.name}</td>

              {/* Price */}
              <td className="p-4 text-center text-gray-700">
                {item.price.toFixed(2)}
              </td>

              {/* Quantity */}
              <td className="p-4 text-center text-gray-700">{item.quantity}</td>

              {/* Total per item */}
              <td className="p-4 text-center text-gray-900 font-semibold">
                {(item.price * item.quantity).toFixed(2)}
              </td>

              {/* Remove button */}
              <td className="p-4 text-center">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartItems;
