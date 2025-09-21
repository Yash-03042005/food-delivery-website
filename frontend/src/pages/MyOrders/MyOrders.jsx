import { StoreContext } from '../../context/StoreContext';
import './MyOrders.css';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const { url } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(
                url + "/api/order/userorders",
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                // Reverse to show latest first
                setData(response.data.data.reverse());
            } else {
                toast.error(response.data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchOrders(); // Cookies handle authentication
    }, []);

    return (
        <div className="my-orders">
            {/* ✅ Professional heading + subheading */}
            <div className="orders-header">
                <h2>My Orders</h2>
                <p className="subheading">Showing your most recent orders first</p>
            </div>

            <div className="container">
                {data.length === 0 ? (
                    <p className="no-orders-msg">No orders yet</p>
                ) : (
                    data.map((order, index) => (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="parcel" />

                            {/* Order items */}
                            <p>
                                {order.items.map((item, i) =>
                                    i === order.items.length - 1
                                        ? `${item.name} x ${item.quantity}`
                                        : `${item.name} x ${item.quantity}, `
                                )}
                            </p>

                            {/* Amount */}
                            <p>&#8377; {order.amount}.00</p>

                            {/* Items count */}
                            <p>Items: {order.items.length}</p>

                            {/* Status */}
                            <p>
                                <span>&#x25cf;</span> <b>{order.status}</b>
                            </p>

                            {/* Track button */}
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;
