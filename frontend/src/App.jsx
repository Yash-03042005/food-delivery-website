import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer"
import LoginPopup from "./components/LoginPopup/LoginPopup";
 import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import Contact from "./pages/Contact/Contact.jsx";
import About from "./pages/About/About.jsx";


const App = () => {

  const [showLogin,setShowLogin] = useState(false);
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin}/>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify/>} />
          <Route path="/myorders" element={<MyOrders/>} />
          <Route path="/contact-us" element={<Contact/>} />
          <Route path="/about" element={<About/>} />
        </Routes>
      </div>
      <Footer/>
    </>
  );
};

export default App;
