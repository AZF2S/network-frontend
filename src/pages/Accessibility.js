import "./PolicyPages.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Accessibility() 
{
  useEffect(() => 
  {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div className="policy-hero-img acc-img">
        <h1>Accessibility Statement</h1>
      </div>
      <div className="body">
        <h2>Last Updated: March 10th, 2023</h2>
        <p className="policy-page">
          &emsp;The Arizona Farm to School Network is committed to provide equal
          participation and access to information on the web for everyone. Our
          team continually aims to improve the accessibility of our site.
          <br />
          <br />
          &emsp;If you would like to report an accessibility concern regarding
          the website, please contact us using{" "}
          <a
            onClick={(e) => {
              navigate("/contact-us");
            }}
          >
            this
          </a>{" "}
          form and one of our team members will respond to you as soon as
          possible.
        </p>
      </div>
    </>
  );
}

export default Accessibility;
