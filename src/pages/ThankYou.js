import "./ThankYou.css";
import { useNavigate } from "react-router-dom";
import CardButton from "../components/CardButton.js";
import ftsLogoGreen from "./img/fts-logo-green.png";

function ThankYou() {
  const navigate = useNavigate();

  return (
    <>
      <div className="ty-body">
        <div className="ty-box">
          <h1 className="ty-title">Thank You!</h1>
          <img src={ftsLogoGreen} alt="Green Farm to School Logo" />
          <p>Thanks for your interest in becoming a member!</p>
          <p>Our team will verify your membership within 48 hours.</p>
          <br />
          <CardButton
            color="#669c3c"
            text="Return Home"
            onClick={(e) => {
              navigate("/");
            }}
          ></CardButton>
        </div>
      </div>
    </>
  );
}

export default ThankYou;
