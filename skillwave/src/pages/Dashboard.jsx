import React, { useState, useEffect } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import "../assets/css/Dashboard.css";
import { FaUserCircle } from "react-icons/fa"; // Import a profile icon from react-icons

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate user logged in
  const [userDetails, setUserDetails] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleProfileClick = () => {
    if (!showProfileDropdown) {
      fetchUserData();
    }
    setShowProfileDropdown(!showProfileDropdown);
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
  
    try {
      const response = await fetch("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const data = await response.json();
      console.log("User data fetched:", data);
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token"); // Remove the token from localStorage
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Welcome to Your Learning Dashboard</h1>
        <p className="dashboard-description">
          Explore, learn, and grow with our interactive tools and resources.
        </p>
        <div className="dashboard-cards">
          <div className="card card-mcq">
            <h2>MCQ Generation</h2>
            <p>Generate topic-specific multiple-choice questions to test your knowledge.</p>
            <button className="card-button" onClick={() => window.location.href = "/learning-modules/mcq-generator"}>Start MCQs</button>
          </div>
          <div className="card card-quiz">
            <h2>Quiz Generation</h2>
            <p>Create personalized quizzes to evaluate your learning progress.</p>
            <button className="card-button" onClick={() => window.location.href = "/learning-modules/quiz-generator"}>Start Quiz</button>
          </div>
          <div className="card card-interview">
            <h2>Questions Generation</h2>
            <p>Generate topic-specific Long-short questions to test your knowledge.</p>
            <button className="card-button" onClick={() => window.location.href = "/learning-modules/long-short-answer"}>Start Long Short</button>
          </div>
        </div>
      </div>
      {/* Profile Icon and Dropdown */}
      {isLoggedIn ? (
        <div className="profile-container">
          <div className="profile-icon" onClick={handleProfileClick}>
            <FaUserCircle size={32} />
          </div>
          {showProfileDropdown && userDetails && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-item">
                <strong>Name:</strong> {userDetails.name}
              </div>
              <div className="profile-dropdown-item">
                <strong>Email:</strong> {userDetails.email}
              </div>
              <button className="logout-button" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="signin-button" onClick={() => window.location.href = "/"}>
          Sign In
        </button>
      )}
      <Footer />
    </div>
  );
};

export default Dashboard;