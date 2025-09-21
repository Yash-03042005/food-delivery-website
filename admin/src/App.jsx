import Navbar from './components/Navbar/Navbar.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import { Route,Routes } from 'react-router-dom'
import Add from './pages/Add/Add.jsx'
import List from './pages/List/List.jsx'
import Orders from './pages/Orders/Orders.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import EditFood from './pages/EditFood/EditFood.jsx'
import Home from './pages/Home/Home.jsx'
import AddCoupons from './pages/AddCoupons/AddCoupons.jsx'
import CouponsList from './pages/CouponsList/CouponsList.jsx'


const App = () => {

  return (
    <div> 

      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className='app-content'>

        <Sidebar/>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path='/add' element={<Add />} />
          <Route path='/list-food' element={<List />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/food-edit/:id' element={<EditFood />} />
          <Route path='/add-coupons' element={<AddCoupons />} />
          <Route path='/list-coupons' element={<CouponsList />} />
        </Routes>

      </div>
      
    </div>
  )
}

export default App
