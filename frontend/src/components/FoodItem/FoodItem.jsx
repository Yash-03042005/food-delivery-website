import './FoodItem.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodItem = ({id,name,price,description,image}) => {
  const { cartItems, addToCart, removeFromCart, url, user } = useContext(StoreContext);

  // wrapper function to check login
  const handleAddToCart = () => {
    if (!user) {
      toast.warning("Please login to add items to cart!");
      return;
    }
    addToCart(id);
  };

  const handleRemoveFromCart = () => {
    if (!user) {
      toast.warning("Please login first!");
      return;
    }
    removeFromCart(id);
  };

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url + "/images/" + image} alt="" />

        {!cartItems[id] ? (
          <img
            className='add'
            onClick={handleAddToCart}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className='food-item-counter'>
            <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="" />
            <p>{cartItems[id]}</p>
            <img onClick={handleAddToCart} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className='food-item-desc'>{description}</p>
        <p className='food-item-price'>&#8377; {price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
