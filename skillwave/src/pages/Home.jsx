import React, { useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import "../assets/css/Home.css";
import videoFile from "../assets/videos/video.mp4";
import Model from "../pages/Model";
import Signin from "../pages/Signin";
import Login from "../pages/Login";
import Toast from "../component/Toast"; // Import the Toast component

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleGetStartedClick = () => {
    setIsModalOpen(true);
    setIsLoginModal(false); // Show signup modal by default
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessfulRegistration = () => {
    setIsRegistered(true); // Set registration success
    setIsModalOpen(false); // Close the modal
  };

  const handleSuccessfulLogin = () => {
    setIsModalOpen(false); // Close the modal
    window.location.href = "/dashboard"; // Redirect to dashboard
  };

  const toggleLoginModal = () => {
    setIsLoginModal(!isLoginModal); // Toggle between login and signup
  };

  const closeToast = () => {
    setIsRegistered(false); // Close the toast
  };

  return (
    <div className="homepage">
      {/* Pass handleGetStartedClick to Header */}
      <Header onSignupClick={handleGetStartedClick} />

      {/* Show Toast Notification */}
      {isRegistered && (
        <Toast
          message="Registered Successfully! Please log in to continue."
          onClose={closeToast}
        />
      )}

      {/* Video Section */}
      <section className="video-section">
        <div className="video-overlay"></div>
        <video autoPlay muted loop className="video-background">
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-content">
          <h2>Learn Anytime, Anywhere</h2>
          <p>Explore our platform and take your skills to the next level.</p>
          <button className="cta-button" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
      </section>

      {/* Modal for Sign-In/Login */}
      <Model isOpen={isModalOpen} onClose={handleCloseModal}>
        {isLoginModal ? (
          <Login onSuccessfulLogin={handleSuccessfulLogin} />
        ) : (
          <Signin
            onSuccessfulRegistration={handleSuccessfulRegistration}
            toggleLoginModal={toggleLoginModal}
          />
        )}
      </Model>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-tagline">Revolutionize Your Learning Journey</h1>
          <p className="hero-subtitle">
            Unlock your potential with our cutting-edge educational tools.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-container">
          <div className="feature">
            <div className="feature-icon">📚</div>
            <h3>MCQ Generation</h3>
            <p>Create topic-specific multiple-choice questions in seconds.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🧠</div>
            <h3>Quizzes</h3>
            <p>Interactive quizzes to test and enhance your knowledge.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📝</div>
            <h3>Question Generator</h3>
            <p>Generate long and short answer questions for effective preparation.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <p>"This platform transformed my learning process!"</p>
            <span>- A Happy User</span>
          </div>
          <div className="testimonial">
            <p>"The mock interview feature gave me the confidence I needed."</p>
            <span>- Job Seeker</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;