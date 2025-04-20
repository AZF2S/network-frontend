import { useNavigate } from "react-router-dom";
import "./ContactUs.css";
import { useEffect, useState } from "react";
import CardButton from "../components/CardButton.js";
import { contactApi } from "../api";

function ContactUs() {
  const [fullName, set_fullName] = useState("");
  const [email, set_email] = useState("");
  const [comments, set_comments] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const sendEmail = async () => {
    if (fullName.length > 0 && email.length > 0 && comments.length > 0) {
      try {
        const { status } = await contactApi.submitContactForm({
          fullName,
          email,
          comments
        });

        if (status === 200) {
          // Email sent successfully
          console.log("Email sent successfully");
          navigate("/thank-you-contact-us");
        } else {
          // Handle error response
          console.log("Error: Unexpected status code", status);
        }
      } catch (error) {
        // Handle network or other errors
        console.log("Error:", error.message);
      }
    }
  };

  return (
    <>
      <div className="contact-us-hero-img">
        <h1>Contact Us</h1>
      </div>
      <br/>
      <div className="form-section">
        <div className="form-section-left"></div>
        <div className="form-section-right">
          <div className="form-questions">
          <div className="form-item">
              <label htmlFor="full-name">Full Name</label>
              <input
                aria-required="true"
                aria-invalid="true"
                type="text"
                placeholder=""
                id="full-name"
                name="full_name"
                autoComplete="on"
                required
                minLength={1}
                value={fullName}
                onChange={(e) => {
                  set_fullName(e.target.value);
                }}
              />
            </div>
            <div className="form-item">
              <label htmlFor="email">Email</label>
              <input
                aria-required="true"
                aria-invalid="true"
                type="email"
                placeholder=""
                id="email"
                name="email"
                autoComplete="on"
                required
                minLength={1}
                value={email}
                onChange={(e) => {
                  set_email(e.target.value);
                }}
              />
            </div>
            <div className="form-item">
              <label htmlFor="questions">Questions &amp; Comments</label>
              <textarea
                aria-required="true"
                aria-invalid="true"
                id="questions"
                name="questions"
                required
                minLength={1}
                value={comments}
                onChange={(e) => {
                  set_comments(e.target.value);
                }}
              />
            </div>
          </div>
          <CardButton
            type="submit"
            color="#A1762B"
            text="Submit"
            onClick={() => {
              sendEmail();
            }}
          ></CardButton>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
