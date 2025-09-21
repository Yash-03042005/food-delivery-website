import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount, url, cartItems, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ Check logged-in user on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("food-del-user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // ✅ Logout function
  const logout = async () => {
    try {
      const response = await axios.post(
        url + "/api/user/logout",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Remove user
        localStorage.removeItem("food-del-user");
        setUser(null);

        // ✅ Clear cart immediately on logout
        setCartItems({});

        toast.success(response.data.message || "Logout successful");
        navigate("/");
      } else {
        toast.error(response.data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Cart click handler
  const handleCartClick = () => {
    const cartEmpty = Object.keys(cartItems).length === 0 || getTotalCartAmount() === 0;

    if (!user) {
      toast.warning("Please login to view your cart!");
      return;
    }

    if (cartEmpty) {
      toast.warning("Please add items to your cart first!");
      return;
    }

    navigate("/cart");
  };

  return (
    <div className="navbar">
      <Link to="/"><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          Home
        </Link>
        <Link to="/about" onClick={() => setMenu("about")} className={menu === "about" ? "active" : ""}>
          About
        </Link>
        <Link to="/contact-us" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>
          Contact-us
        </Link>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" />
        <div className="navbar-search-icon" onClick={handleCartClick}>
          <img src={assets.basket_icon} alt="Cart" />
          {/* ✅ Dot only appears if user is logged in and cart has items */}
          <div className={user && getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </div>
        {!user ? (
          <button onClick={() => setShowLogin(true)}>Login / Register</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />Orders
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
