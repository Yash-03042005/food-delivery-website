import { assets } from '../../assets/assets'
import './Sidebar.css'
import {  NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">

        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Food Items</p>
        </NavLink>

        <NavLink to='/add-coupons' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Coupons</p>
        </NavLink>

        <NavLink to='/list-food' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Food Items</p>
        </NavLink>

        <NavLink to='/list-coupons' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Coupons</p>
        </NavLink>

        <NavLink to='/orders' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>

        

      </div>
    </div>
  )
}

export default Sidebar











