import './Contact.css';
import { assets } from '../../assets/assets';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add API integration
    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p className="contact-page-text">
        Have questions, feedback, or suggestions? Reach out to us and we’ll get back to you as soon as possible.
      </p>

      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="phone" 
            placeholder="Phone Number (optional)" 
            value={formData.phone} 
            onChange={handleChange} 
          />
          <select name="subject" value={formData.subject} onChange={handleChange} required>
            <option value="">Select Subject</option>
            <option value="Order Issue">Order Issue</option>
            <option value="Feedback">Feedback</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Partnership">Partnership</option>
          </select>
          <textarea 
            name="message" 
            placeholder="Your Message" 
            value={formData.message} 
            onChange={handleChange} 
            required 
          ></textarea>
          <button type="submit">Send Message</button>
        </form>

        <div className="contact-info">
          <h2>Get in touch</h2>
          <div className="contact-info-item">
            <img src={assets.phone_icon} alt="phone" />
            <p>+91-8208033512</p>
          </div>
          <div className="contact-info-item">
            <img src={assets.email_icon} alt="email" />
            <p>contact@tomato.com</p>
          </div>
          <div className="contact-info-item">
            <img src={assets.map_icon} alt="location" />
            <p>123 Food Street, Pune, Maharashtra</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
