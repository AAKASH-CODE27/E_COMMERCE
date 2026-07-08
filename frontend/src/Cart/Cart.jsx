import React from "react";
import "../CartStyles/Cart.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart, removeItemFromCart } from "../features/cart/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      toast.error("Required Quantity is not available in Stock!!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(addItemsToCart({ id, quantity: newQty }));
  };

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;
    if (quantity <= 1) {
      return;
    }
    dispatch(addItemsToCart({ id, quantity: newQty }));
  };

  const removeCartItem = (id) => {
    dispatch(removeItemFromCart(id));
    toast.success("Item removed from cart", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal + tax + shipping;

  const checkoutHandler = () => {
    if (isAuthenticated) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=shipping");
    }
  };

  return (
    <>
      <PageTitle title="Your Cart" />
      <Navbar />

      {cartItems.length === 0 ? (
        <div className="cart-page" style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", minHeight: "60vh", gap: "20px" }}>
          <h2>Your Cart is Empty</h2>
          <p>Go add some amazing products to your cart!</p>
          <Link to="/products" className="add-to-cart-btn" style={{ textDecoration: "none", textAlign: "center" }}>
            View Products
          </Link>
        </div>
      ) : (
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

              {cartItems.map((item) => (
                <CartItem
                  key={item.product}
                  item={item}
                  decreaseQty={decreaseQty}
                  increaseQty={increaseQty}
                  removeCartItem={removeCartItem}
                />
              ))}
            </div>
          </div>

          <div className="price-summary">
            <h3 className="price-summary-heading">Price Summary</h3>

            <div className="summary-item">
              <p className="summary-label">Subtotal:</p>
              <p className="summary-value">${subtotal.toFixed(2)}</p>
            </div>

            <div className="summary-item">
              <p className="summary-label">Tax (18%):</p>
              <p className="summary-value">${tax.toFixed(2)}</p>
            </div>

            <div className="summary-item">
              <p className="summary-label">Shipping:</p>
              <p className="summary-value">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
            </div>

            <div className="summary-total">
              <p className="summary-label">Total:</p>
              <p className="summary-value">${total.toFixed(2)}</p>
            </div>

            <button className="add-to-cart-btn" style={{ width: "100%", marginTop: "20px" }} onClick={checkoutHandler}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
