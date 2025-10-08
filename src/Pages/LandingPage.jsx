import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onSignIn }) => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>BookMyBarber</h2>
          </div>
          <div className="nav-menu">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Book Your Perfect
              <span className="highlight"> Barber</span>
            </h1>
            <p className="hero-description">
              Connect with professional barbers in your area. 
              Book appointments, manage your schedule, and get the perfect cut every time.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={onSignIn}>
                <span className="btn-text">Get Started</span>
                <span className="btn-icon">→</span>
              </button>
              <button className="btn-secondary">
                <span className="btn-text">Learn More</span>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="barber-illustration">
              <div className="barber-chair"></div>
              <div className="barber-tools"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Why Choose BookMyBarber?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Booking</h3>
              <p>Book appointments with your favorite barbers in just a few clicks. No more waiting on hold.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Top Rated Barbers</h3>
              <p>Connect with highly skilled and rated barbers in your area. Quality guaranteed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Safe and secure payment processing. Pay online or in-person with confidence.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your appointments and manage bookings from anywhere, anytime.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Real-time Updates</h3>
              <p>Get instant notifications about your appointments and any changes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Experience</h3>
              <p>Save your preferences and get recommendations based on your style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account and set up your profile in minutes.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Find Barbers</h3>
              <p>Browse and discover barbers in your area with reviews and ratings.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book & Pay</h3>
              <p>Select your preferred time slot and complete your booking securely.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Your Cut</h3>
              <p>Show up for your appointment and enjoy your perfect haircut!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers who trust BookMyBarber for their grooming needs.</p>
            <button className="btn-primary large" onClick={onSignIn}>
              <span className="btn-text">Sign In Now</span>
              <span className="btn-icon">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>BookMyBarber</h3>
              <p>Connecting you with the best barbers in your area.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 BookMyBarber. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
