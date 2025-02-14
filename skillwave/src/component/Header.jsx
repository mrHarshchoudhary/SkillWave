import React, { useState } from "react";
import "../assets/css/Header.css";
import SignIn from "../pages/Signin";

const Header = ({ onSignupClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-text">Skillwave</span>
        <span className="logo-highlight"></span>
      </div>
      <button className="sign-in-button" onClick={onSignupClick}>
        <span>Sign Up</span>
        <span className="button-hover-effect"></span>
      </button>

      {/* {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <SignIn closeModal={closeModal} />
          </div>
        </div>
      )} */}
    </header>
  );
};

export default Header;