import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite


const Signup = ({ onSuccessfulRegistration, toggleLoginModal }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      
      console.log("Sending request to:", `${API_BASE_URL}/register`);
      console.log("Request payload:", formData);
  
      const response = await axios.post(`${API_BASE_URL}/register`, formData);
      console.log("Backend response:", response.data);
  
      setResponseMessage(response.data.message);
      onSuccessfulRegistration();
    } catch (error) {
      console.error("Error during registration:", error);
      console.error("Error response:", error.response); // Log full response
  
      setResponseMessage(
        error.response?.data?.error || "Something went wrong, please try again!"
      );
    }
  };
  

  return (
    <StyledWrapper>
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">Sign up</span>
          <span className="subtitle">Create a free account with your email.</span>
          <div className="form-container">
            <input
              type="text"
              className="input"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              className="input"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              className="input"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Sign up</button>
        </form>
        <div className="form-section">
          <p>Have an account? <a href="#login" onClick={toggleLoginModal}>Log in</a></p>
        </div>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Styling remains the same */
  .form-box {
    max-width: 300px;
    background: #f1f7fe;
    overflow: hidden;
    border-radius: 16px;
    color: #010101;
  }
  .form {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 32px 24px 24px;
    gap: 16px;
    text-align: center;
  }
  .title {
    font-weight: bold;
    font-size: 1.6rem;
  }
  .subtitle {
    font-size: 1rem;
    color: #666;
  }
  .form-container {
    overflow: hidden;
    border-radius: 8px;
    background-color: #fff;
    margin: 1rem 0 0.5rem;
    width: 100%;
  }
  .input {
    background: none;
    border: 0;
    outline: 0;
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #eee;
    font-size: 0.9rem;
    padding: 8px 15px;
  }
  .form-section {
    padding: 16px;
    font-size: 0.85rem;
    background-color: #e0ecfb;
    box-shadow: rgb(0 0 0 / 8%) 0 -1px;
  }
  .form-section a {
    font-weight: bold;
    color: #0066ff;
    transition: color 0.3s ease;
  }
  .form-section a:hover {
    color: #005ce6;
    text-decoration: underline;
  }
  .form button {
    background-color: #0066ff;
    color: #fff;
    border: 0;
    border-radius: 24px;
    padding: 10px 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .form button:hover {
    background-color: #005ce6;
  }
  .response-message {
    margin-top: 10px;
    color: #333;
    font-size: 0.9rem;
  }
`;

export default Signup;