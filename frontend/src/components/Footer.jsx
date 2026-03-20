import React from "react";
import { Phone, Mail, LinkedIn, GitHub} from "@mui/icons-material";
import "../componentStyles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section 1 */}
        <div className="footer-section contact">
          <h3> Contact </h3>

          <p>
            <Phone fontSize = 'small' />
            Phone : +91 9876543210
          </p>
          <p>
            <Mail fontSize = 'small' /> Email : aakash270306@gmail.com
          </p>
        </div>

        {/* Section2 */}
        <div className="footer-section social">
          <h3>Follow me</h3>
          <div className="social-links">
            <a href="" target="_blank">
              <GitHub className="social-icon" />
            </a>
             <a href="" target="_blank"> {/*target -> redirected to new tab */}
              <LinkedIn className="social-icon" />
            </a>

          </div>
        </div>
        <div className="footer-section about">
            <h3> Easy Shopping</h3>
        </div>
      </div>
      <div className = "footer-bottom">
        <p> &copy; 2025 ShoppyMart</p>
      </div>
    </footer>
  );
}

export default Footer;
