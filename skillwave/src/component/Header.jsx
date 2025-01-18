import React, { useState } from "react";
import "../assets/css/Header.css";
import SignIn from "../pages/Signin"; // Import the SignIn component

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="header">
      <div className="logo">Skillwave</div>
      <button className="sign-in-button" onClick={openModal}>
        Sign In
      </button>

      {/* Modal for SignIn */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <SignIn closeModal={closeModal} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
