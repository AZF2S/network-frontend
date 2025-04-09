import "./PolicyPages.css";
import { useEffect } from "react";

function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="policy-hero-img tos-img">
        <h1>Terms Of Service</h1>
      </div>
      <div className="body" style={{ color: 'black' }}>
        <h2>Last Updated: March 10th, 2023</h2>
        <p>
          &emsp;The Arizona Farm to School Network uses these terms of service
          to ensure the safety of its users. Accounts found breaking one or more
          of the following rules may be deleted and/or banned.
        </p>
        <ul>
          <li>
            The AZ F2S Network does not allow positng of offensive content in
            any category of the forums. Posts violating this rule will be
            deleted and the associated account banned.
          </li>
          <li>
            The AZ F2S Network will not allow offensive or threatening content
            in messages between users. Any user found violating this rule will
            have their account banned/deleted.
          </li>
          <li>
            The AZ F2S Network does not allow "spamming" or abuse of the contact
            list provided on the site. Users found violating this rule may have
            their account banned.
          </li>
        </ul>
        <p>
          &emsp; The Arizona Farm to School Network also reserves the right to
          delete any user-created content or user accounts even when not
          specifically breaking any of rules stated above.
          <br />
          <br />
          &emsp;Unauthorized use of the Arizona Farm to School Network logo,
          content, or any images on the site that are owned by the AZ F2S
          Network constitutes copyright infringement. User created content does
          not fall under this category.
          <br />
          <br />
          &emsp;The Arizona Farm to School Network is not held liable for the
          accuracy of user created content and is not held responsible for the
          user of this content. This agreement is governed by Arizona state law
          as well as United States Law.
        </p>
      </div>
    </>
  );
}

export default TermsOfService;
