import "./ThankYou.css";
import { useNavigate } from "react-router-dom";
import CardButton from "../components/CardButton.js";
import ftsLogoGreen from "./img/fts-logo-green.png";

function ThankYouContactUs() {
  const navigate = useNavigate();

  return (
    <>
      <div className="ty-body">
        <div className="ty-box">
          <h1 className="ty-title">Thank You!</h1>
          <img src={ftsLogoGreen} alt="Green Farm to School Logo" />
          <p>We got your message! A team member will be in touch soon.</p>
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

export default ThankYouContactUs;
