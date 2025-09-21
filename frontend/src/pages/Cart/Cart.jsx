import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, appliedCoupon, setAppliedCoupon, discount, setDiscount , coupons } = useContext(StoreContext);
  const [promoInput, setPromoInput] = useState(""); 
  const [error, setError] = useState(""); 
  const [successMsg, setSuccessMsg] = useState(""); 
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (appliedCoupon) {
      setPromoInput(appliedCoupon);
      setSuccessMsg(`Coupon ${appliedCoupon} applied`);
    }
  }, [appliedCoupon]);

  const handleApplyCoupon = () => {
    const code = promoInput.trim().toUpperCase();
    const subtotal = getTotalCartAmount();
    const coupon = coupons.find(c => c.code === code);

    if (!coupon) {
      setSuccessMsg("");
      setError("Invalid coupon code");
      setAppliedCoupon("");
      setDiscount(0);
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("appliedDiscount");
      return;
    }

    if (subtotal === 0) {
      setSuccessMsg("");
      setError("Your cart is empty");
      setAppliedCoupon("");
      setDiscount(0);
      return;
    }

    if (subtotal < coupon.minAmount) {
      setSuccessMsg("");
      setError(`Cart total must be at least ₹${coupon.minAmount} to use this coupon`);
      return;
    }

    // Apply coupon
    setAppliedCoupon(code);
    setDiscount(coupon.discount);
    setSuccessMsg(`Coupon ${code} applied`);
    setError("");
    localStorage.setItem("appliedCoupon", code);
    localStorage.setItem("appliedDiscount", coupon.discount);
  };

  const removeCoupon = () => {
    setAppliedCoupon("");
    setDiscount(0);
    setPromoInput("");
    setError("");
    setSuccessMsg("");
    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("appliedDiscount");
  };

  const handleSelectCoupon = (code) => {
    setPromoInput(code);
    setError("");
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee - discount;

  // ✅ NEW useEffect to auto-remove coupon if subtotal drops below minAmount
  useEffect(() => {
    if (appliedCoupon) {
      const coupon = coupons.find(c => c.code === appliedCoupon);
      if (coupon && subtotal < coupon.minAmount) {
        setAppliedCoupon("");
        setDiscount(0);
        setPromoInput("");
        setSuccessMsg("");
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("appliedDiscount");
      }
    }
  }, [subtotal, appliedCoupon, coupons, setAppliedCoupon, setDiscount]);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {food_list.map(item => cartItems[item._id] > 0 && (
          <div key={item._id}>
            <div className='cart-items-title cart-items-item'>
              <img src={url + "/images/" + item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>&#8377; {item.price}</p>
              <p>{cartItems[item._id]}</p>
              <p>&#8377; {item.price * cartItems[item._id]}</p>
              <p className='cross' onClick={() => removeFromCart(item._id)} style={{color:'red', cursor:'pointer'}}>Remove</p>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-bottom">
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
                  <p>
                    Discount ({appliedCoupon}) 
                    <span onClick={removeCoupon} style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}>Remove</span>
                  </p>
                  <p>&#8377; {discount}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <p>Total</p>
              <p>&#8377; {total < 0 ? 0 : total}</p>
            </div>
          </div>
          <button onClick={() => navigate('/order')} style={{backgroundColor:'#ff5722', color:'#fff'}}>Proceed to Checkout</button>
        </div>

        <div className="cart-promocode" ref={inputRef}>
          <p>If you have a promo code, enter it here</p>
          <div className="cart-promocode-input">
            <input
              type="text"
              placeholder='Enter a coupon code'
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              onFocus={() => setShowDropdown(true)}
            />
            <button onClick={handleApplyCoupon} disabled={subtotal===0} style={{backgroundColor:'#ff5722', color:'#fff'}}>Apply</button>
          </div>
          {successMsg && <p style={{ color: 'green', marginTop: '5px' }}>{successMsg}</p>}
          {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}

          {showDropdown && (
            <div className="coupon-list">
              {coupons.map((c, idx) => (
                <p key={idx} className="coupon-item" onClick={() => handleSelectCoupon(c.code)}>
                  {c.code} - &#8377; {c.discount} off (Min ₹{c.minAmount})
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
