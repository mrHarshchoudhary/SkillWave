import React, { useEffect } from "react";
import styled from "styled-components";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close the toast after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [onClose]);

  return (
    <ToastContainer>
      <p>{message}</p>
    </ToastContainer>
  );
};

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50; /* Green background */
  color: white;
  padding: 15px 30px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.5s ease-out;

  @keyframes slideIn {
    from {
      top: -50px;
      opacity: 0;
    }
    to {
      top: 20px;
      opacity: 1;
    }
  }
`;

export default Toast;