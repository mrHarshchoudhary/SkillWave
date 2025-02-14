import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const Form = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate(); 

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Send login request to the server
      const response = await axios.post("http://localhost:5000/login", formData);

      // If login is successful, redirect to the dashboard
      if (response.data.message === "Login successful!") {
        navigate("/dashboard"); // Redirect to the dashboard
      }
    } catch (error) {
      // Handle errors (e.g., invalid credentials)
      setErrorMessage(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <span className="input-span">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </span>
        <span className="input-span">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </span>
        <span className="span">
          <a href="#">Forgot password?</a>
        </span>
        <input className="submit" type="submit" value="Log in" />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <span className="span">
          Don't have an account? <a href="#signin">Sign up</a>
        </span>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form {
    --bg-light: #efefef;
    --bg-dark: #707070;
    --clr: #58bc82;
    --clr-alpha: #9c9c9c60;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }

  .form .input-span {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form input[type="email"],
  .form input[type="password"] {
    border-radius: 0.5rem;
    padding: 1rem 0.75rem;
    width: 100%;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--clr-alpha);
    outline: 2px solid var(--bg-dark);
  }

  .form input[type="email"]:focus,
  .form input[type="password"]:focus {
    outline: 2px solid var(--clr);
  }

  .label {
    align-self: flex-start;
    color: var(--clr);
    font-weight: 600;
  }

  .form .submit {
    padding: 1rem 0.75rem;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 3rem;
    background-color: var(--bg-dark);
    color: var(--bg-light);
    border: none;
    cursor: pointer;
    transition: all 300ms;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .form .submit:hover {
    background-color: var(--clr);
    color: var(--bg-dark);
  }

  .span {
    text-decoration: none;
    color: var(--bg-dark);
  }

  .span a {
    color: var(--clr);
  }

  .error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: -0.5rem;
    margin-bottom: 0.5rem;
  }
`;

export default Form;