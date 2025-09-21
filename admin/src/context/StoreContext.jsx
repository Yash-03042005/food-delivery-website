import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [foodList, setFoodList] = useState([]);
  // Coupon state
  const [couponList, setCouponList] = useState([]);

  // Fetch all foods
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        toast.error("Failed to fetch food list.");
      }
    } catch (error) {
      console.log(error)
      toast.error("Error fetching food list.");
    }
  };

  // Fetch all coupons
  const fetchCouponList = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/admin/list-coupons`);
      if (response.data.success) {
        setCouponList(response.data.coupons);
      } else {
        toast.error("Failed to fetch coupon list.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching coupon list.");
    }
  };

  useEffect(() => {
    fetchFoodList();
    fetchCouponList();
  }, []);

  const contextValue = {
    backend_url,
    foodList,
    setFoodList,
    fetchFoodList,
    fetchCouponList,
    couponList,
    setCouponList
    // removeFood removed here
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export default StoreContextProvider;
