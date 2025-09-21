import { useState, useEffect, useContext } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [category, setCategory] = useState("All")
  const [showCartButton, setShowCartButton] = useState(false)
  const { cartItems, food_list } = useContext(StoreContext)
  const navigate = useNavigate()

  // Function to calculate total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // Update button visibility when cart or user changes
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("food-del-user"));
    const totalAmount = getTotalCartAmount();

    if (storedUser && totalAmount > 0) {
      setShowCartButton(true);
    } else {
      setShowCartButton(false);
    }
  }, [cartItems, food_list]); // ✅ removed "user" to avoid infinite loop

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />

      {/* Floating Cart Button */}
      {showCartButton && (
        <button 
          className="floating-cart-btn" 
          onClick={() => navigate("/cart")}
        >
          <span className="cart-left">
            {Object.values(cartItems).reduce((a, b) => a + b, 0)} items
          </span>
          <span className="cart-right">
            🛒 View Cart
          </span>
        </button>
      )}
    </div>
  )
}

export default Home
