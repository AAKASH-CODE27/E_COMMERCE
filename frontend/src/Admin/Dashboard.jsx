import React from "react";
import "../AdminStyles/Dashboard.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";

import {
  AddBox,
  Dashboard as DashboardIcon,
  Inventory,
  People,
  ShoppingCart,
  Star,
  Error as ErrorIcon,
  Instagram,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <Navbar />
      <PageTitle title="Admin Dashboard" />
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="logo">
            <DashboardIcon className="logo-icon" />
            Admin Dashboard
          </div>

          <nav className="nav-menu">
            <div className="nav-section">
              <h3> Products</h3>
              <Link to="/admin/products">
                <Inventory className="nav-icon" /> All Products{" "}
              </Link>

              <Link to="/admin/products/create">
                <AddBox className="nav-icon" /> Create Products{" "}
              </Link>
            </div>

            <div className="nav-section">
              <h3>Users</h3>
              <Link to="/admin/products">
                <People className="nav-icon" />
                All Users
              </Link>
            </div>

            <div className="nav-section">
              <h3>Orders</h3>
              <Link to="/admin/orders">
                <ShoppingCart className="nav-icon" />
                All Orders
              </Link>
            </div>

            <div className="nav-section">
              <h3>Reviews</h3>
              <Link to="/admin/reviews">
                <Star className="nav-icon" />
                All Reviews
              </Link>
            </div>
          </nav>
        </div>

        <div className="main-content">
          <div className="stats-grid">
            <div className="stat-box">
              <Inventory className="icon" />
              <h3>Total Products </h3>
              <p> 4</p>
            </div>

            <div className="stat-box">
              <ShoppingCart className="icon" />
              <h3>Total Orders</h3>
              <p>5</p>
            </div>

            <div className="stat-box">
              <Star className="icon" />
              <h3>Out of Stocks</h3>
              <p>2</p>
            </div>

            <div className="stat-box">
              <ErrorIcon className="icon" />
              <h3>In Stock</h3>
              <p>4</p>
            </div>

            <div className="stat-box">
              <ShoppingCart className="icon" />
              <h3>Total Orders</h3>
              <p>5</p>
            </div>
          </div>

          <div className="social-stats">
            <div className="social-box instagram">
              <Instagram />
              <h3> Instagram</h3>
              <p> 123K Followers</p>
              <p> 12 Post</p>
            </div>

            <div className="social-box linkedIn">
              <Instagram />
              <h3> LinkedIn</h3>
              <p> 2000 Followers</p>
              <p> 5 Post</p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
export default Dashboard;
