import './EditFood.css';
import { assets } from '../../assets/assets';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { StoreContext } from '../../context/StoreContext';
import { useParams, useNavigate } from 'react-router-dom';

const EditFood = () => {
  const { backend_url, foodList, fetchFoodList } = useContext(StoreContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const [data, setData] = useState({
    name: "", 
    description: "",
    price: "",
    category: "Salad",
    image: ""
  });

  // ✅ Load food details on mount
  useEffect(() => {
    if (!foodList || foodList.length === 0) return;
    
    const foodItem = foodList.find(f => f._id === id);

    if (foodItem) {
      setData({
        name: foodItem.name,
        description: foodItem.description,
        price: foodItem.price,
        category: foodItem.category,
        image: foodItem.image
      });
    } else {
      toast.error("Food not found!");
      navigate("/list");
    }
  }, [id, foodList, navigate]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Update Food API
  const updateFood = async () => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(`${backend_url}/api/food/update/${id}`, formData);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchFoodList();
        setIsEdit(false);
        navigate("/list-food");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update food");
    }
  };

  return (
    <div className='add'>
      {/* ✅ Standardized Header */}
      <div className="editfood-header">
        <h2>Edit Food</h2>
        <p className="subheading">Update or modify the food item details</p>
      </div>

      <form className='flex-col' onSubmit={(e)=>{e.preventDefault(); updateFood();}}>
        
        {/* ✅ Image Section */}
        <div className="add-img-upload flex-col">  
          <p>Upload Image</p>
          {
            isEdit ? (
              <label htmlFor="image">
                <div className="inline-block relative cursor-pointer">
                  <img
                    className="w-36 rounded opacity-75"
                    src={
                      image
                        ? URL.createObjectURL(image)
                        : data.image
                          ? `${backend_url}/images/${data.image}`
                          : assets.upload_area
                    }
                    alt="food"
                  />
                </div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
            ) : (
              <img
                className="w-36 rounded"
                src={`${backend_url}/images/${data.image}`}
                alt="food"
              />
            )
          }
        </div>

        {/* Product Name */}
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name='name' 
            placeholder='Type here' 
            disabled={!isEdit}
          />
        </div>

        {/* Product Description */}
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea 
            onChange={onChangeHandler} 
            value={data.description} 
            name="description" 
            rows="6" 
            placeholder='write content here ' 
            required 
            disabled={!isEdit}
          />
        </div>

        {/* Category & Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select 
              onChange={onChangeHandler} 
              name="category" 
              value={data.category}
              disabled={!isEdit}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input 
              onChange={onChangeHandler} 
              value={data.price} 
              type="number" 
              name='price' 
              placeholder='$20' 
              disabled={!isEdit}
            />
          </div>
        </div>
        
        {/* Save / Edit Toggle */}
        {
          isEdit 
          ? <button type='submit' className='add-btn'>Save Changes</button>
          : <p type='button' onClick={()=>setIsEdit(true)} className='add-btn'>Edit</p>
        }
      </form>
    </div>
  );
};

export default EditFood;
