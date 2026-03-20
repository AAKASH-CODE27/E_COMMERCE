import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import "../componentStyles/Navbar.css";
import "../pageStyles/Search.css";
import { useSelector } from "react-redux";
import UserDashboard from "../User/UserDashboard";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [openDashboard, setOpenDashboard] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
    setSearchQuery("");
  };

  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // const isAuthenticated = true;
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            {" "}
            ShopyyMart
          </Link>
        </div>
        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li onClick={() => setIsMenuOpen(false)}>
              <Link to="/"> Home</Link>
            </li>
            <li>
              <Link to="/product">Product</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-icons">
          <div className="search-container">
            <form
              className={`search-form ${isSearchOpen ? "active" : ""}`}
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <button
              type="button"
              className="search-icon"
              onClick={toggleSearch}
            >
              <SearchIcon focusable="false" />
            </button>
          </div>
          <div className="cart-container">
            <Link to="/cart">
              <ShoppingCartIcon className="icon" />
              <span className="cart-badge"> 6 </span>
            </Link>
          </div>

          {!isAuthenticated ? (
            <Link to="/register" className="register-link">
              <PersonAddIcon className="icon" />
            </Link>
          ) : (
            <div
              className="user-avatar-container"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              <img
                src={user?.avatar?.url || "/images/profile.png"}
                alt="user"
                className="navbar-avatar"
              />

              {openDashboard && <UserDashboard user={user} />}
            </div>
          )}

          <div className="navbar-hamburger" onClick={toggleMenu}>
            {isMenuOpen ? (
              <CloseIcon className="icon" />
            ) : (
              <MenuIcon className="icon" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
