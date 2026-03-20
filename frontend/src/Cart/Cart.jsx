import React from "react";
import "../CartStyles/Cart.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import CartItem from "./CartItem";

function Cart() {
  return (
    <>
      <PageTitle title="Your Cart" />
      <Navbar />

      <div className="cart-page">
        <div className="cart-items">
          <div className="cart-items-heading">Your Cart</div>

          <div className="cart-table">
            <div className="cart-table-header">
              <div className="header-product">Product</div>
              <div className="header-quantity">Quantity</div>
              <div className="header-total itemitotal-heading">Item Total</div>
              <div className="header-action">Actions</div>
            </div>

            {/* Cart Item */}
            <CartItem />
          </div>
        </div>

        <div className="price-summary">
          <h3 className="price-summary-heading">Price Summary</h3>

          <div className="summary-item">
            <p className="summary-label">Subtotal :</p>
            <p className="summary-value">200/-</p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Tax (18%) :</p>
            <p className="summary-value">10/-</p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Shipping :</p>
            <p className="summary-value">50/-</p>
          </div>

          <div className="summary-total">
            <p className="summary-label">Totel :</p>
            <p className="summary-value">260 </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
