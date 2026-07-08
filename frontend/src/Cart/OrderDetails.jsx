import React, { useEffect } from "react";
import "../OrderStyles/OrderDetails.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, clearErrors } from "../features/order/orderSlice";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function OrderDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);

  const address = order && order.shippingInfo
    ? `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pincode}, ${order.shippingInfo.country}`
    : "";

  const statusClass = order && order.orderStatus ? order.orderStatus.toLowerCase() : "processing";
  const isPaid = order && order.paymentInfo && order.paymentInfo.status === "succeeded";
  const paymentClass = isPaid ? "paid" : "not-paid";

  return (
    <>
      <PageTitle title="Order Details" />
      <Navbar />

      {loading || !order || !order.shippingInfo ? (
        <Loader />
      ) : (
        <div className="order-box">
          <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--bg-secondary)" }}>
            Order #{order._id}
          </h2>

          {/* Shipping Details */}
          <div className="table-block">
            <h3 className="table-title">Shipping Information</h3>
            <table className="table-main">
              <tbody>
                <tr className="table-row">
                  <th className="table-cell" style={{ width: "30%" }}>Name</th>
                  <td className="table-cell">{order.user && order.user.name}</td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Phone</th>
                  <td className="table-cell">{order.shippingInfo.phoneNumber}</td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Address</th>
                  <td className="table-cell">{address}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment and Status Details */}
          <div className="table-block">
            <h3 className="table-title">Status Summary</h3>
            <table className="table-main">
              <tbody>
                <tr className="table-row">
                  <th className="table-cell" style={{ width: "30%" }}>Payment Status</th>
                  <td className="table-cell">
                    <span className={`pay-tag ${paymentClass}`}>
                      {isPaid ? "PAID" : "NOT PAID"}
                    </span>
                  </td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Order Status</th>
                  <td className="table-cell">
                    <span className={`status-tag ${statusClass}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Placed On</th>
                  <td className="table-cell">
                    {new Date(order.createAt).toLocaleDateString()} at{" "}
                    {new Date(order.createAt).toLocaleTimeString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Order Items */}
          <div className="table-block">
            <h3 className="table-title">Order Items</h3>
            <table className="table-main">
              <thead className="table-head">
                <tr>
                  <th className="head-cell">Image</th>
                  <th className="head-cell">Product Name</th>
                  <th className="head-cell">Price</th>
                  <th className="head-cell">Quantity</th>
                  <th className="head-cell">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <tr className="table-row" key={item.product}>
                      <td className="table-cell">
                        <img src={item.image} alt={item.name} className="item-img" />
                      </td>
                      <td className="table-cell">
                        <Link to={`/product/${item.product}`} style={{ textDecoration: "none", color: "#6c5b7b", fontWeight: "bold" }}>
                          {item.name}
                        </Link>
                      </td>
                      <td className="table-cell">${item.price.toFixed(2)}</td>
                      <td className="table-cell">{item.quantity}</td>
                      <td className="table-cell">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Bill breakdown */}
          <div className="table-block">
            <h3 className="table-title">Payment breakdown</h3>
            <table className="table-main">
              <tbody>
                <tr className="table-row">
                  <th className="table-cell" style={{ width: "30%" }}>Subtotal</th>
                  <td className="table-cell">${order.itemPrice.toFixed(2)}</td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Tax (18%)</th>
                  <td className="table-cell">${order.taxPrice.toFixed(2)}</td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Shipping</th>
                  <td className="table-cell">${order.shippingPrice.toFixed(2)}</td>
                </tr>
                <tr className="table-row" style={{ fontWeight: "bold" }}>
                  <th className="table-cell">Total Paid</th>
                  <td className="table-cell" style={{ color: "#28a745" }}>${order.totalPrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderDetails;
