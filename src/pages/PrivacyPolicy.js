import "./PolicyPages.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div className="policy-hero-img priv-img">
        <h1>Privacy Policy</h1>
      </div>
      <div className="body">
        <h2>Last Updated: March 10th, 2023</h2>
        <p className="policy-page">
          &emsp;The Arizona Farm to School Network aims to use this website as a
          way for F2S members and others to be able to share resources,
          information, and experience when it comes to food education in the
          classroom. The purpose of this privacy policy is to inform our users
          of the information the Arizona Farm to School team collects in order
          to provide certain services in this website.
          <br />
          <br />
          &emsp;The data we collect comes from when the user registers an
          account on the website. This data includes the user's name, date of
          birth, job title, county of residence, password, and email address.
          Private information such as your password, date of birth, and email
          address will not be shared with other users by the Arizona Farm to
          School Network Additionally, it is optional for user's to upload a
          picture to serve as their profile picture when other users view their
          account.
          <br />
          <br />
          &emsp;The data described above, personal messages, and forum posts are
          stored in the Arizona Farm to School Network's database. Personal
          messages and forum posts will not be used to generate statistics.
          <br />
          <br />
          &emsp;The Arizona Farm to School Network may use some of this
          information to provide certain services to users. For example, if the
          user chooses to opt-in to monthly newsletter emails or forum
          notification emails, the provided email address associated with the
          given user will be used to send these notifications. Other user data
          or information may be collected to generate statistics on the Arizona
          Farm to School Network user base.
          <br />
          <br />
          &emsp;To remove all data the Arizona Farm to School Network has
          collected, you will need to delete your account which can be done
          through the account settings page. If you have any additional
          questions about how your data is used on this website, please use the{" "}
          <a
            onClick={(e) => {
              navigate("/contact-us");
            }}
          >
            Contact Us
          </a>{" "}
          form to get in touch with someone from our team.
        </p>
      </div>
    </>
  );
}

export default PrivacyPolicy;
