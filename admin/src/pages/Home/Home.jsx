import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* ✅ Heading + Subheading */}
      <div className="home-header">
        <h2>Welcome to Admin Panel</h2>
        <p className="subheading">Manage your food items, coupons, and orders easily</p>
      </div>
    </div>
  );
};

export default Home;
