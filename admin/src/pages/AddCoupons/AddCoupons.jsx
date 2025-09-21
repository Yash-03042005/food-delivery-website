import './AddCoupons.css';
import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const AddCoupons = () => {
    const { backend_url, fetchCouponList } = useContext(StoreContext);

    const [data, setData] = useState({
        code: "",
        discount: "",
        minAmount: "",
        expiryDate: "" // Optional
    });

    // ✅ Modified handler to force uppercase for `code`
    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        setData(prev => ({
            ...prev,
            [name]: name === "code" ? value.toUpperCase() : value
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${backend_url}/api/admin/add-coupon`, data);

            if (response.data.success) {
                setData({
                    code: "",
                    discount: "",
                    minAmount: "",
                    expiryDate: ""
                });
                fetchCouponList(); // refresh coupon list if needed
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong!");
            console.error(error);
        }
    };

    return (
        <div className='add-coupon'>
            {/* ✅ Heading + Subheading (same as Orders.jsx) */}
            <div className="add-coupon-header">
                <h2>Add New Coupon</h2>
                <p className="subheading">Create and manage discount coupons for your customers</p>
            </div>

            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-coupon-field flex-col">
                    <p>Coupon Code</p>
                    <input 
                        type="text" 
                        name="code" 
                        value={data.code} 
                        onChange={onChangeHandler} 
                        placeholder="Enter coupon code" 
                        required 
                    />
                </div>

                <div className="add-coupon-field flex-col">
                    <p>Coupon Discount Amount</p>
                    <input 
                        type="number" 
                        name="discount" 
                        value={data.discount} 
                        onChange={onChangeHandler} 
                        placeholder="Enter discount" 
                        required 
                    />
                </div>

                <div className="add-coupon-field flex-col">
                    <p>Minimum Order Amount</p>
                    <input 
                        type="number" 
                        name="minAmount" 
                        value={data.minAmount} 
                        onChange={onChangeHandler} 
                        placeholder="Minimum order" 
                        required 
                    />
                </div>

                <button type='submit' className='add-coupon-btn'>Add Coupon</button>
            </form>
        </div>
    );
};

export default AddCoupons;
