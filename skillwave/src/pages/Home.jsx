import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import "../assets/css/Home.css";
import styled from 'styled-components';

const Home = () => {
  return (
    <div className="homepage">
      <Header />

      {/* Hero Section */}
  
      <section className="hero-section">
        <h1 className="hero-tagline">
          Revolutionize Your Learning Journey
        </h1>
        <button className="btn-new">
  <span class="text">Get started</span>
</button>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-container">
          <div className="feature">
            <h3>MCQ Generation</h3>
            <p>Create topic-specific multiple-choice questions in seconds.</p>
          </div>
          <div className="feature">
            <h3>Quizzes</h3>
            <p>Interactive quizzes to test and enhance your knowledge.</p>
          </div>
          <div className="feature">
            <h3>Mock Interviews</h3>
            <p>Prepare for interviews with real-time feedback and insights.</p>
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
