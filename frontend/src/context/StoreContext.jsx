import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null); // ✅ store logged-in user here

  // ✅ Coupons state
  const [coupons, setCoupons] = useState([]);

  // ✅ Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const url = import.meta.env.VITE_BACKEND_URL;

  // Load user from localStorage (on refresh)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("food-del-user"));
    if (storedUser) {
      setUser(storedUser);
    }

    // Load saved coupon & discount
    const savedCoupon = localStorage.getItem("appliedCoupon");
    const savedDiscount = localStorage.getItem("appliedDiscount");
    if (savedCoupon) setAppliedCoupon(savedCoupon);
    if (savedDiscount) setDiscount(Number(savedDiscount));
  }, []);

  const addToCart = async (itemId) => {
    if (!user) {
      toast.error("Please login to add items to cart!");
      return;
    }

    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    await axios.post(
      url + "/api/cart/add",
      { itemId },
      { withCredentials: true }
    );
  };

  const removeFromCart = async (itemId) => {
    if (!user) {
      toast.error("Please login to remove items!");
      return;
    }

    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    await axios.post(
      url + "/api/cart/remove",
      { itemId },
      { withCredentials: true }
    );
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error("Error fetching orders");
    }
  };

  const loadCartData = async () => {
    if (!user) {
      console.log("User not logged in. Skipping cart fetch.");
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { withCredentials: true }
      );
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error(
        "Error loading cart:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Fetch coupons from backend (authenticated)
const fetchCoupons = async () => {
  try {
    const res = await axios.get(url + "/api/cart/get-coupons", {
      withCredentials: true, // ✅ include this
    });
    if (res.data.success) {
      setCoupons(res.data.coupons);
      console.log(res.data.coupons)
    }
  } catch (error) {
    console.error("Error fetching coupons:", error);
    toast.error("Failed to load coupons");
  }
};
  
useEffect(()=>{
  fetchFoodList();
},[])

  useEffect(() => {
    if(!user) return ;
    async function loadData() {
      await loadCartData();
      await fetchCoupons();
    }
    loadData();
  }, [user]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    fetchAllOrders,
    user,
    setUser,
    // ✅ Expose coupon state
    appliedCoupon,
    setAppliedCoupon,
    discount,
    setDiscount,
    fetchCoupons,
    coupons
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
