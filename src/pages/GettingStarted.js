import React, { useEffect, useState } from 'react';
import './GettingStarted.css';
import api from '../api';
import { useAuth } from "../contexts/AuthContext";
import { useDialog } from '../utils/DialogProvider';
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import Confetti from "react-confetti";
import CardButton from "../components/CardButton";
import config from "../config";

function GettingStartedPage() {
  const { user, isAuthenticated } = useAuth();
  const { requestDialog } = useDialog();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const debug = false;

  // Initialize state for checklist steps
  const [checklistSteps, setChecklistSteps] = useState({
    ...(debug && {
      emailValidation: true,
      membershipForm: true,
      exploreContactList: true,
      exploreNetworkMap: true,
      communityForum: true,
      resourceLibrary: true,
      eventsCalendar: true,
      contactUs: true,
    }),
  });

  // Fetch checklist data from the server
  useEffect(() => {
    const fetchChecklistData = async () => {
      try {
        const response = await api.get(`/user-checklist`, {
          withCredentials: true,
        });
        const userChecklistSteps = response.data || {};
        // Set default values for missing steps
        const defaultSteps = {
          emailValidation: user?.["email:confirmed"] === 1,
          membershipForm: false,
          exploreContactList: false,
          exploreNetworkMap: false,
          communityForum: false,
          resourceLibrary: false,
          eventsCalendar: false,
          contactUs: false,
        };
        const mergedSteps = { ...defaultSteps, ...userChecklistSteps };
        setChecklistSteps(mergedSteps);
      } catch (error) {
        console.error("Error fetching checklist data", error);
      }
    };

    fetchChecklistData();

    const interval = setInterval(() => {
      fetchChecklistData();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  const updateChecklistStep = async (step) => {
    try {
      await api.put(`/update-checklist-step`, { step }, { withCredentials: true });
    } catch (error) {
      console.error("Error updating checklist step:", error);
    }
  };

  const onClickHandler = (step, pathname) => {
    if (!isAuthenticated) {
      requestDialog(
        'Account Required',
        'You must be logged in to access this page.',
        "Sign up",
        () => { navigate('/sign-up'); },
        "Log in",
        () => { navigate('/login'); }
      );
      return;
    } else if (!checklistSteps.emailValidation) {
      requestDialog(
        'Email Validation Required',
        'Please validate your email before accessing this page.',
        'OK',
        () => { }
      );
      return;
    }
    updateChecklistStep(step);
    navigate(pathname);
  };

  const onProtectedClickHandler = (step, pathname) => {
    if (!isAuthenticated) {
      requestDialog(
        'Account Required',
        'You must be logged in to access this page.',
        "Sign up",
        () => { navigate('/sign-up'); },
        "Log in",
        () => { navigate('/login'); }
      );
    } else if (!checklistSteps.emailValidation) {
      requestDialog(
        'Email Validation Required',
        'Please validate your email before accessing this page.',
        'OK',
        () => { }
      );
      return;
    } else if (user.memberstatus !== "verified") {
      requestDialog(
        'Membership Required',
        'You must be a verified member to access this page.',
        "Become a Member",
        () => { navigate('/membership-form'); },
      );
    } else {
      updateChecklistStep(step);
      navigate(pathname);
    }
  };

  // Get the checkbox steps excluding the membershipForm field
  const checkboxSteps = Object.entries(checklistSteps)
    .filter(([step]) => step !== 'membershipForm')
    .reduce((steps, [step, value]) => ({ ...steps, [step]: value }), {});

  const handleConfettiButtonClick = useCallback(() => {
    setShowConfetti(true);
    setIsButtonDisabled(true);
    setTimeout(() => {
      setShowConfetti(false);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }, 3000);
  }, []);

  return (
    <div className="page-container">
      <header className="page-title">Getting Started: Member&nbsp;Checklist</header>
      <main>
        <section className="page-description">
          <h2 className="kindest-reality">Welcome Message & Orientation&nbsp;Video</h2>
          <p>
            Welcome to the Arizona Farm to School Network! We're thrilled to have you join us in our mission to connect schools
            with local farmers and bring fresh, healthy foods into cafeterias while educating students about the importance of
            nutrition and agriculture.
            <br /><br />
            As a member of the Farm to School Network, you'll gain access to a vibrant community of educators, farmers, food service
            professionals, and community members dedicated to supporting farm to school initiatives nationwide. Whether you're a
            school administrator, teacher, farmer, or community organizer, there's a place for you in our network.
            <br /><br />
            We've created this page to help you get started and orient you to the member resources and tools embedded in our website.
            Follow the steps below to complete your onboarding process.
          </p>
          {/* Embed orientation video here */}
        </section>

        <section className="section-container">
          <h2 className="kindest-reality">
            Getting Started with the Farm to School Network:<br/> Your Guide to Website Tools and Resources
          </h2>
          <div className="step-container">
            <div className="step-header">
              <h3>
                <span onClick={(e) => { }}>
                  I. Confirm Your Email
                </span>
              </h3>
              <input type="checkbox" className="step-checkbox" checked={checklistSteps.emailValidation} readOnly />
            </div>
            <p>
              Please check your email &#40;and your spam box!&#41; for a link to validate your account.
            </p>
            {}
          </div>
          <div className="step-container">
            <div className="step-header">
              <h3>
                <a href="#" onClick={(e) => { e.preventDefault(); onClickHandler("membershipForm", "/membership-form"); }}>
                  II. Complete Your Membership&nbsp;Form
                </a>
              </h3>
              <input type="checkbox" className="step-checkbox" checked={user?.memberstatus === "verified" || (debug && checklistSteps.membershipForm)} readOnly />
            </div>
            <p>
              The membership form helps you to populate your profile to help other members get to know you and your program. The
              information collected in the membership form informs Arizona Farm to School Network programming by helping us better
              understand the demographics, needs, and interests of the network.
            </p>
            <p>
              Note: Please allow up to 48 hours for your submission to be approved. Once it is approved, the remaining steps will
              all become available to you!
            </p>
            {/* Embed Video #1 */}
          </div>
          <div className="step-container">
            <div className="step-header">
              <h3>
                <a href="#" onClick={(e) => { e.preventDefault(); onProtectedClickHandler("exploreContactList", "/contact-list"); }}>
                  III. Explore the Contact&nbsp;List
                </a>
              </h3>
              <input type="checkbox" className="step-checkbox" checked={checklistSteps.exploreContactList} readOnly />
            </div>
            <p>
              The contact list is a live directory of Arizona Farm to School Network members designed to spark local, regional, and
              statewide connections. You can search names, cities, counties, organizations, positions, and filter groups and tags.
            </p>
            <p>
              Note: You can control what information is shared on your profile by changing your privacy settings in the user menu.
            </p>
            {/* Embed Video #2 */}
          </div>
          <div className="step-container">
            <div className="step-header">
              <h3>
                <a href="#" onClick={(e) => { e.preventDefault(); onClickHandler("exploreNetworkMap", "/map"); }}>
                  IV. Explore the Network&nbsp;Map
                </a>
              </h3>
              <input type="checkbox" className="step-checkbox" checked={checklistSteps.exploreNetworkMap} readOnly />
            </div>
            <p>
              This map is a visual of the organizations across Arizona. Use this tool to discover who is "doing the work" in your
              community and see what members are working there.
            </p>
            {/* Embed Video #4 */}
          </div>
          <div className="step-container">
            <div className="step-header">
              <h3>
                <a href="#" onClick={(e) => { e.preventDefault(); onProtectedClickHandler("communityForum", "/forum"); }}>
                  V. Community Forum
                </a>
              </h3>
              <input type="checkbox" className="step-checkbox" checked={checklistSteps.communityForum} readOnly />
            </div>
            <p>
              Stay in touch with farm to school network members by participating in our community forum. This forum is a space to
              ask questions, share news, promote events, and more!
            </p>
            {/* Embed Video #5 */}
          </div>
          <div className="step-container">
            <div className="step-header">
              <h3>
                <a href="#" onClick={(e) => { e.preventDefault(); onClickHandler("resourceLibrary", "/resources"); }}>
                  VI. Resource Library / Webinar&nbsp;Archive
                </a>
              </h3>
              <input type="checkbox" className="step-checkbox" checked={checklistSteps.resourceLibrary} readOnly />
            </div>
            <p>
              Expand your knowledge by accessing resources and webinars in one place. You can filter by role, topic, and age group.
            </p>
            {/* Embed Video #6 */}
          </div>
          <div className="step-container">
            <div className="step-header">
              <h3>
                <a href="#" onClick={(e) => { e.preventDefault(); onProtectedClickHandler("eventsCalendar", "/calendar"); }}>
                  VII. Events Calendar
                </a>
              </h3>
              <input type="checkbox" className="step-checkbox" checked={checklistSteps.eventsCalendar} readOnly />
            </div>
            <p>
              Use the events calendar to view farm to school network meetings and other community events...
            </p>
            {/* Event Submission Form mention */}
            {/* Embed Video #7 */}
          </div>
          <div className="step-container">
            <div className="step-header">
              <h3>
                <a href="#" onClick={(e) => { e.preventDefault(); onClickHandler("contactUs", "/contact-us"); }}>
                  VIII. Contact Us
                </a>
              </h3>
              <input type="checkbox" className="step-checkbox" checked={checklistSteps.contactUs} readOnly />
            </div>
            <p>
              Need to get in touch? Fill out our contact us form to share your questions, ideas, and feedback.
            </p>
            {/* Consider if Video #8 is necessary */}
          </div>

          {(debug ? Object.values(checkboxSteps).every(Boolean) : (Object.values(checkboxSteps).every(Boolean) && user?.memberstatus === "verified")) && (
            <footer className="completion-message">
              <h3 className='kindest-reality'>
                Congratulations! You have officially onboarded onto the Arizona Farm to School Network. If you have any questions
                about how to utilize this platform, <a href='/contact-us' className="contact-us-link">contact&nbsp;us</a>.
              </h3>
              <div className="button-container">
                <CardButton
                  onClick={handleConfettiButtonClick}
                  disabled={isButtonDisabled}
                  color="#B55B2C"
                  textColor="#FFFFFF"
                  text="Celebrate!"
                />
              </div>
              <br />
            </footer>
          )}

          {showConfetti && (
            <div className="confetti-container">
              <Confetti numberOfPieces={1000} recycle={false} />
            </div>
          )}

        </section>
      </main>
    </div>
  );
}

export default GettingStartedPage;
