import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Cart from "../pages/cart";
import ProductDetailPage from "../pages/productDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cart",
    element: <Cart />
  },
  {
    path: "/product/:id",
    element: <ProductDetailPage />
  }
]);

const appRouter = () => {
  return <RouterProvider router={router} />;
};

export default appRouter;
