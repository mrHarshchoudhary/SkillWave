import React from "react";
import "../assets/css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 Skillwave. All rights reserved.</p>
      <div className="footer-links">
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
