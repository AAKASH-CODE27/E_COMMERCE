import React, { useRef, useState, useEffect } from "react";
import "../CartStyles/Payment.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, clearErrors } from "../features/order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

function Payment() {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error, success } = useSelector((state) => state.order);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(clearErrors());
    }
    if (success) {
      dispatch(clearCart());
      navigate("/success");
    }
  }, [dispatch, error, success, navigate]);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100), // Stripe expects amount in cents
  };

  const order = {
    shippingInfo,
    orderItems: cartItems.map((item) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    })),
    itemPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Request Stripe Payment Intent client_secret
      const { data } = await axios.post("/api/v1/payment/process", paymentData, config);
      const client_secret = data.client_secret;

      if (!client_secret) {
        toast.error("Failed to fetch payment client secret.");
        setLoading(false);
        payBtn.current.disabled = false;
        return;
      }

      // Confirm Card Payment
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pincode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        setLoading(false);
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // Attach payment info to order
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          // Dispatch order creation (which also completes stock reservation and updates catalog)
          dispatch(createOrder(order));
        } else {
          toast.error("There was an issue processing payment.");
          setLoading(false);
          payBtn.current.disabled = false;
        }
      }
    } catch (err) {
      setLoading(false);
      payBtn.current.disabled = false;
      const errorMsg = err.response?.data?.message || err.message || "Payment Error";
      toast.error(errorMsg);
    }
  };

  // Inline custom styles for Stripe Element inputs to look premium
  const stripeElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#333",
        fontFamily: "'Outfit', 'Roboto', 'Inter', sans-serif",
        "::placeholder": {
          color: "#999",
        },
      },
      invalid: {
        color: "#dc3545",
      },
    },
  };

  return (
    <>
      <PageTitle title="Payment" />
      <Navbar />

      <CheckoutSteps activeStep={2} />

      <div style={{ maxWidth: "500px", margin: "40px auto", padding: "0 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "var(--bg-secondary)" }}>
          Card Payment
        </h2>

        <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Card Number */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary-dark)" }}>
              <CreditCardIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
              Card Number
            </label>
            <div style={{ border: "1px solid #ddd", padding: "12px 16px", borderRadius: "8px", background: "white" }}>
              <CardNumberElement options={stripeElementOptions} />
            </div>
          </div>

          {/* Expiry Date */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary-dark)" }}>
              <EventIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
              Card Expiry Date
            </label>
            <div style={{ border: "1px solid #ddd", padding: "12px 16px", borderRadius: "8px", background: "white" }}>
              <CardExpiryElement options={stripeElementOptions} />
            </div>
          </div>

          {/* Card CVC */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary-dark)" }}>
              <VpnKeyIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
              Card CVC
            </label>
            <div style={{ border: "1px solid #ddd", padding: "12px 16px", borderRadius: "8px", background: "white" }}>
              <CardCvcElement options={stripeElementOptions} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="payment-container" style={{ margin: "20px 0" }}>
            <button
              type="button"
              className="payment-go-back"
              onClick={() => navigate("/order/confirm")}
              disabled={loading}
            >
              Go Back
            </button>
            <button
              type="submit"
              ref={payBtn}
              className="payment-btn"
              disabled={loading || !orderInfo}
            >
              {loading ? "Processing..." : `Pay $${orderInfo ? orderInfo.totalPrice.toFixed(2) : "0.00"}`}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Payment;
