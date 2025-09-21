import './About.css';
import { assets } from '../../assets/assets';

const About = () => {
  return (
    <div className="about-page">
      <h1>About Us</h1>
      <p className="about-intro">
        <span className="highlight">Tomato</span> brings you a handpicked menu of flavors you love. Freshly prepared, swiftly delivered – because you deserve the best.
      </p>

      <div className="about-container">

        {/* Our Story */}
        <div className="about-section">
          <img src={assets.story_img} alt="Our Story" />
          <div className="value-card about-text-card">
            <h2>Our Story</h2>
            <p>
              Tomato was created to make food ordering hassle-free. Instead of browsing through endless restaurant lists, we directly present a handpicked selection of food items that you can order instantly. It’s a simple yet powerful approach to food delivery.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="about-section reverse">
          <img src={assets.mission_img} alt="Our Mission" />
          <div className="value-card about-text-card">
            <h2>Our Mission</h2>
            <p>
              We aim to deliver meals that are fresh, delicious, and easy to order. With Tomato, you can enjoy a smooth ordering process that focuses on great food and convenience. Your satisfaction is what drives us forward.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="about-values">
          <h2>Why Choose Tomato?</h2>
          <div className="values-grid">
            <div className="value-card">
              <img src={assets.fresh_icon} alt="Simple" />
              <h3>Diverse Menu</h3>
              <p>Explore a variety of dishes crafted with care and flavor.</p>
            </div>
            <div className="value-card">
              <img src={assets.delivery_icon} alt="Fast" />
              <h3>Quick Delivery</h3>
              <p>Fast and reliable service that brings meals to your doorstep.</p>
            </div>
            <div className="value-card">
              <img src={assets.price_icon} alt="Affordable" />
              <h3>Easy Ordering</h3>
              <p>A clean and intuitive design for a smooth ordering experience.</p>
            </div>
            <div className="value-card">
              <img src={assets.support_icon} alt="Support" />
              <h3>Customer Focused</h3>
              <p>Built to satisfy your cravings and provide a delightful experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
