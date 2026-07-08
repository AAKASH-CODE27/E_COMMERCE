import React, { useState } from "react";
import "../CartStyles/OrderConfirm.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import CheckoutSteps from "../components/CheckoutSteps";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ConfirmOrder() {
  const navigate = useNavigate();
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shippingCharges = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pincode}, ${shippingInfo.country}`;

  const proceedToPayment = async () => {
    setLoading(true);
    try {
      // Hit the reservation API to block/lock stock before allowing checkout/payment
      const itemsPayload = cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("/api/v1/reserve-stock", { items: itemsPayload }, config);

      if (data.success) {
        toast.success(data.message || "Inventory reserved for checkout!");
        
        // Save price details in session storage so we can load them on the payment page
        const orderInfo = {
          subtotal,
          shippingCharges,
          tax,
          totalPrice,
        };
        sessionStorage.setItem("orderInfo", JSON.stringify(orderInfo));
        navigate("/process/payment");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Stock reservation failed. Try again!";
      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Confirm Order" />
      <Navbar />

      <CheckoutSteps activeStep={1} />

      <div className="confirm-container">
        <h2 className="confirm-header">Confirm Your Order</h2>

        <div className="confirm-table-container">
          {/* Shipping Info Table */}
          <table className="confirm-table">
            <caption>Shipping Info</caption>
            <tbody>
              <tr>
                <th style={{ width: "30%" }}>Name</th>
                <td>{user && user.name}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{shippingInfo && shippingInfo.phoneNumber}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{address}</td>
              </tr>
            </tbody>
          </table>

          {/* Cart Items Table */}
          <table className="confirm-table">
            <caption>Your Cart Items</caption>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems &&
                cartItems.map((item) => (
                  <tr key={item.product}>
                    <td>
                      <img src={item.image} alt="Product" className="order-product-image" />
                    </td>
                    <td>
                      <Link to={`/product/${item.product}`} style={{ color: "#6c5b7b", textDecoration: "none", fontWeight: "bold" }}>
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Order Summary Table */}
          <table className="confirm-table">
            <caption>Order Summary</caption>
            <tbody>
              <tr>
                <th style={{ width: "30%" }}>Subtotal</th>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Shipping Charges</th>
                <td>{shippingCharges === 0 ? "Free" : `$${shippingCharges.toFixed(2)}`}</td>
              </tr>
              <tr>
                <th>GST / Sales Tax (18%)</th>
                <td>${tax.toFixed(2)}</td>
              </tr>
              <tr style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                <th>Total Amount</th>
                <td style={{ color: "#10b981" }}>${totalPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="proceed-button" onClick={proceedToPayment} disabled={loading}>
          {loading ? "Locking Stock..." : "Proceed to Payment"}
        </button>
      </div>
    </>
  );
}

export default ConfirmOrder;
