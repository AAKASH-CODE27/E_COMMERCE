import React, { useEffect } from "react";
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

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

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
        <Route path="cart" element={<Cart />} />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<Dashboard />} adminOnly={true} />}
        />
      </Routes>
      {isAuthenticated && <UserDashboard user={user} />}
    </Router>
  );
}

export default App;
