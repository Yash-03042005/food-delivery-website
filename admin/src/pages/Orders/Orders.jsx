import './Orders.css';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assets } from '../../assets/assets.js';
import { StoreContext } from '../../context/StoreContext.jsx';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { backend_url } = useContext(StoreContext);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(backend_url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data.reverse()); // latest first
        console.log(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backend_url + "/api/order/status", {
        orderId,
        status: event.target.value
      });

      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-page">
      {/* ✅ Heading + Subheading */}
      <div className="orders-header">
        <h2>All Orders</h2>
        <p className="subheading">Manage and update the latest customer orders</p>
      </div>

      <div className="order-list">
        {orders.length === 0 ? (
          <p className="no-orders-msg">No orders available</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="parcel" />

              <div className="order-details">
                <p className="order-item-food">
                  {order.items.map((item, idx) =>
                    idx === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  )}
                </p>

                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>

                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country}, {order.address.zipcode}
                  </p>
                </div>

                <p className="order-item-phone">{order.address.phone}</p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>&#8377; {order.amount}.00</p>

              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
