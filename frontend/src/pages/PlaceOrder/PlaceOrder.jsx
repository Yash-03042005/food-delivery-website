import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify'; 

const PlaceOrder = () => {
  const { getTotalCartAmount, food_list, cartItems, url, fetchAllOrders, appliedCoupon, discount,setAppliedCoupon,setDiscount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];

    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const totalAmount = subtotal + deliveryFee - discount;

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalAmount < 0 ? 0 : totalAmount,
      appliedCoupon: appliedCoupon || null,
      discount: discount || 0
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        withCredentials: true,
      });

      if (response.data.success) {

        setAppliedCoupon("");
        setDiscount(0); 
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("appliedDiscount");
        
        await fetchAllOrders();
        setTimeout(() => {
          window.location.replace(response.data.session_url);
        }, 2000);
      } else {
        toast.error(response.data.message || "Error placing order");
      }
    } catch (error) {
      console.error("Order Placement Error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (getTotalCartAmount() === 0) navigate('/cart');
  }, [getTotalCartAmount, navigate]);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee - discount;

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
        </div>
        <div>
          <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
          <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        </div>
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>&#8377; {subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>&#8377; {deliveryFee}</p>
            </div>
            <hr />
            {appliedCoupon && (
              <>
                <div className="cart-total-details">
                  <p>Discount ({appliedCoupon})</p>
                  <p>- &#8377; {discount}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <p>Total</p>
              <p>&#8377; {total < 0 ? 0 : total}</p>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
