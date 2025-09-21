import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className='footer' id='footer'>

      <div className="footer-content">

        {/* Left Section */}
        <div className="footer-content-left">
          <img src={assets.logo} alt="Tomato Logo" className='footer-logo' />
          <p>Delicious food, fast delivery. Making your meal times happier every day!</p>
          <div className="footer-social-icons">
            <a ><img src={assets.facebook_icon} alt="Facebook" /></a>
            <a><img src={assets.twitter_icon} alt="Twitter" /></a>
            <a ><img src={assets.linkedin_icon} alt="LinkedIn" /></a>
          </div>
        </div>

        {/* Center Section */}
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>Menu</li>
            <li>About Us</li>
            <li>Contact-Us</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-content-right">
          <h2>Get In Touch</h2>
          <ul>
            <li>+91 82082 74542</li>
            <li>contact@tomato.com</li>
            <li>123 Food Street, Pune, Maharashtra</li>
          </ul>
        </div>

      </div>

      <hr />
      <p className='footer-copyright'>
        &copy; 2024 Tomato.com - All Rights Reserved.
      </p>

    </div>
  )
}

export default Footer;
