import { useState, useContext } from 'react'
import './loginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {
  const { url } = useContext(StoreContext)

  const [currState, setCurrState] = useState('Login')
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const OnChnageHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault();

    try {
      let newUrl = url;
      if (currState === "Login") {
        newUrl += "/api/user/login";
      } else {
        newUrl += "/api/user/register";
      }

      const response = await axios.post(newUrl, data, { withCredentials: true });

      console.log(response.data);

      if (response.data.success) {
        localStorage.setItem("food-del-user", JSON.stringify(response.data.user));
        console.log("User stored in localStorage:", response.data.user);
        setShowLogin(false);
        window.location.reload();
      } else {
        toast.error("Login/Register failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>
        <div className="login-popup-title"><h2>{currState}</h2><img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" /></div>
        <div className="login-popup-inputs">{currState === "Login" ? <></> : <input name='name' onChange={OnChnageHandler} value={data.name} type="text" placeholder='Your name' required />}<input name='email' onChange={OnChnageHandler} value={data.email} type="email" placeholder='Your email' required /><input name='password' onChange={OnChnageHandler} value={data.password} type="password" placeholder='Password ' required /></div>
        <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition"><input type="checkbox" required /><p>By continuing, i agree to theterms of use & privacy policy</p></div>
        {currState === "Login" ? <p style={{ fontSize: '15px' }}>create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p> : <p style={{ fontSize: '15px' }}>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>}
      </form>
    </div>
  )
}

export default LoginPopup
