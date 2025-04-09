import React, { useState } from 'react'; // Import useState
import "./BecomeMember.css";
import ftsLogoGreen from "./img/fts-logo-green.png";
import MembershipInfoDialog from '../components/Dialogs/MembershipInfoDialog';
import { useAuth } from "../contexts/AuthContext";

function BecomeMember() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="ty-body">
        <div className="ty-box">
          <h1 className="ty-title">One last step...</h1>
          <img className="ty-img" src={ftsLogoGreen} alt="Green Farm to School Logo" />
          <div className="ty-p">Thanks for creating your account! Please&nbsp;check your inbox for a verification email.</div>
          <div className="ty-p">Once your email address is verified, click&nbsp;the&nbsp;button below to become an official member of the Arizona Farm&nbsp;to&nbsp;School Network!</div>
          <br />

          <button className="custom-button" onClick={() => setIsDialogOpen(true)}> {/* Update onClick */}
            <b>Go To Membership Form</b>
          </button>
          
          <MembershipInfoDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            user={user}
          />

          <a href="/" className="bottom-link">
            Complete later
          </a>
        </div>
      </div>
    </>
  );
}

export default BecomeMember;
