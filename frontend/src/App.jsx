import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import Register from "./User/Register";
import Login from "./User/Login";
import UserDashboard from "./User/UserDashboard";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./features/user/userSlice";
import Profile from "./User/Profile";
import ProtectedRoute from "./components/ProtectedRoute.JSX";
import UpdateProfile from "./User/UpdateProfile";
import UpdatePassword from "./User/UpdatePassword";
import ForgotPassword from "./User/ForgotPassword";
import ResetPassword from "./User/ResetPassword";
import Cart from "./Cart/Cart";
import Dashboard from "./Admin/Dashboard";
import ProductsList from "./Admin/ProductsList";
import CreateProducts from "./Admin/CreateProducts";
import UpdateProduct from "./Admin/UpdateProduct";
import UsersList from "./Admin/UsersList";

import Shipping from "./Cart/Shipping";
import ConfirmOrder from "./Cart/ConfirmOrder";
import Payment from "./Cart/Payment";
import OrderSuccess from "./Cart/OrderSuccess";
import MyOrders from "./Cart/MyOrders";
import OrderDetails from "./Cart/OrderDetails";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.error("Error loading Stripe API key:", error);
    }
  }

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      getStripeApiKey();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/profile/update"
          element={<ProtectedRoute element={<UpdateProfile />} />}
        />
        <Route
          path="/password/update"
          element={<ProtectedRoute element={<UpdatePassword />} />}
        />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* Checkout & Order Routes */}
        <Route
          path="/shipping"
          element={<ProtectedRoute element={<Shipping />} />}
        />
        <Route
          path="/order/confirm"
          element={<ProtectedRoute element={<ConfirmOrder />} />}
        />
        {stripeApiKey && (
          <Route
            path="/process/payment"
            element={
              <ProtectedRoute
                element={
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <Payment />
                  </Elements>
                }
              />
            }
          />
        )}
        <Route
          path="/success"
          element={<ProtectedRoute element={<OrderSuccess />} />}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute element={<MyOrders />} />}
        />
        <Route
          path="/order/:id"
          element={<ProtectedRoute element={<OrderDetails />} />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<Dashboard />} adminOnly={true} />}
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute element={<ProductsList />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/products/create"
          element={
            <ProtectedRoute element={<CreateProducts />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/products/:updateId"
          element={
            <ProtectedRoute element={<UpdateProduct />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/users"
          element={<ProtectedRoute element={<UsersList />} adminOnly={true} />}
        />
      </Routes>
      {isAuthenticated && <UserDashboard user={user} />}
    </Router>
  );
}

export default App;
