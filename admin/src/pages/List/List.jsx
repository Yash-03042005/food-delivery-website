import './List.css';
import { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const List = () => {
  const { backend_url, foodList, fetchFoodList } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFoodList();
  }, []);

  // ✅ removeFood moved here
  const removeFood = async (foodId) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchFoodList(); // refresh list
      } else {
        toast.error("Failed to remove food item.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error removing food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <h2>Food List</h2>
        <p className="subheading">Manage your food items here</p>
      </div>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Edit</b>
          <b>Action</b>
        </div>
        {foodList.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${backend_url}/images/` + item.image} alt={item.name} />
            <p className="food-name">{item.name}</p>
            <p>{item.category}</p>
            <p>&#8377; {item.price}</p>
            <button 
              className="edit-btn" 
              onClick={() => navigate(`/food-edit/${item._id}`)}
            >
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => removeFood(item._id)}
              disabled={loading} // optional
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
