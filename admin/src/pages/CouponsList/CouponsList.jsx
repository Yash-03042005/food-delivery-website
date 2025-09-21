import './CouponsList.css';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CouponsList = () => {
  const { backend_url, couponList, fetchCouponList } = useContext(StoreContext);

  // ✅ Delete Coupon
  const handleDelete = async (id) => {
    try {
      const res = await axios.post(`${backend_url}/api/admin/del-coupon`, { id });
      if (res.data.success) {
        toast.success("Coupon deleted successfully");
        fetchCouponList(); // refresh from context
      } else {
        toast.error("Failed to delete coupon");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="coupons-list">
      {/* ✅ Title & Subheading */}
      <h2 className="coupons-title">Coupons List</h2>
      <p className="coupons-subtitle">Manage your coupons here</p>

      <div className="coupons-table">
        <div className="coupons-table-format title">
          <b>Coupon Code</b>
          <b>Coupon Discount</b>
          <b>Min Order Amount</b>
          <b>Action</b>
        </div>

        {couponList.map((coupon, index) => (
          <div key={index} className="coupons-table-format">
            <p>{coupon.code}</p>
            <p>&#8377; {coupon.discount}</p>
            <p>&#8377; {coupon.minAmount}</p>
            <button
              className="coupon-delete-btn"
              onClick={() => handleDelete(coupon._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponsList;
