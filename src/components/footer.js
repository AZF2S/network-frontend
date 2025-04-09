import "./footer.css";
import f2s_logo from "./f2s_logo_large.png";
import { useNavigate } from "react-router-dom";

const Footer = (props) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="footer">
        <div className="footer-top">
          <div className="footer-left">
            <img src={f2s_logo} alt="Farm To School Logo" />
          </div>
          <div className="footer-right">
            <div className="footer-row">
              <h2 className="footer-title">About Us</h2>
              <div className="subtitle">
                <p
                  className="footer-text"
                  onClick={(e) => {
                    navigate("/contact-us");
                  }}
                >
                  Contact Us
                </p>
                <div className="divider" />
                <p
                  className="footer-text"
                  onClick={(e) => {
                    navigate("/about");
                  }}
                >
                  Who We Are
                </p>
                <div className="divider hide-mobile" />
              </div>
            </div>
            <div className="vert-line-large" />
            <div className="footer-row">
              <h2 className="footer-title">Resources</h2>
              <div className="subtitle">
                <p
                  className="footer-text"
                  onClick={(e) => {
                    navigate("/resources");
                  }}
                >
                  Resource Library
                </p>
                <div className="divider" />
                <p
                  className="footer-text"
                  onClick={(e) => {
                    navigate("/faq");
                  }}
                >
                  FAQs
                </p>
                <div className="divider" />
                <p
                  className="footer-text"
                  onClick={(e) => {
                    navigate("/map");
                  }}
                >
                  Network Map
                </p>
              </div>
            </div>
            <div className="vert-line-large" />
            <div className="footer-row">
              <h2 className="footer-title">Connect</h2>
              <div className="subtitle">
                <p
                  className="footer-text"
                  onClick={(e) => {
                    navigate("/forum");
                  }}
                >
                  Community Forums
                </p>
                <div className="divider" />
                <p
                  className="footer-text"
                  onClick={(e) => {
                    navigate("/contact-list");
                  }}
                >
                  Contact List
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hz-line" />
        <div className="footer-bottom">
          <h5>&#169; 2025 AZ Farm-To-School Network</h5>
          <div className="link-row">
            <h5
              onClick={(e) => {
                navigate("/contact-us");
              }}
            >
              Contact Us
            </h5>
            <div className="vert-line-small" />
            <h5
              onClick={(e) => {
                navigate("/privacy-policy");
              }}
            >
              Privacy Policy
            </h5>
            <div className="vert-line-small" />
            <h5
              onClick={(e) => {
                navigate("/terms-of-service");
              }}
            >
              Terms of Service
            </h5>
            <div className="vert-line-small" />
            <h5
              onClick={(e) => {
                navigate("/accessibility");
              }}
            >
              Accessibility
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;