import React from "react";
import { Link } from "react-router-dom";
import "../CartStyles/PaymentSuccess.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";

function OrderSuccess() {
  return (
    <>
      <PageTitle title="Order Success" />
      <Navbar />
      <div className="payment-success-container">
        <div className="success-content">
          <div className="success-icon">
            <span className="checkmark"></span>
          </div>
          <h1>Your Order has been Placed Successfully!</h1>
          <p className="success-para">
            Thank you for shopping with us. Your payment has been processed and your order is being prepared.
          </p>
          <Link to="/orders" className="explore-btn">
            View My Orders
          </Link>
        </div>
      </div>
    </>
  );
}

export default OrderSuccess;
