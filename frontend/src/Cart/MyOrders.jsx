import React, { useEffect } from "react";
import "../OrderStyles/MyOrders.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { myOrders, clearErrors } from "../features/order/orderSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LaunchIcon from "@mui/icons-material/Launch";

function MyOrders() {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.order);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [dispatch, error]);

  return (
    <>
      <PageTitle title="My Orders" />
      <Navbar />

      {loading ? (
        <Loader />
      ) : !orders || orders.length === 0 ? (
        <div className="no-orders" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="no-order-message">No Orders Found</div>
          <Link to="/products" className="add-to-cart-btn" style={{ textDecoration: "none" }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="my-orders-container">
          <h1>My Orders</h1>
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Items Qty</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders.map((item) => (
                    <tr key={item._id}>
                      <td>{item._id}</td>
                      <td
                        style={{
                          color:
                            item.orderStatus === "Delivered"
                              ? "#10b981"
                              : item.orderStatus === "Cancelled"
                              ? "#ef4444"
                              : "#f59e0b",
                          fontWeight: "bold",
                        }}
                      >
                        {item.orderStatus}
                      </td>
                      <td>{item.orderItems.reduce((acc, i) => acc + i.quantity, 0)}</td>
                      <td>${item.totalPrice.toFixed(2)}</td>
                      <td>
                        <Link to={`/order/${item._id}`} className="order-link">
                          <LaunchIcon />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default MyOrders;
