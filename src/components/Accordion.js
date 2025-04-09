import React, { useState } from "react";
import CardButton from "../components/CardButton.js";
import { useNavigate } from "react-router-dom";

const Accordion = ({ title, content, buttonText, link, isExternal }) => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  let hasLink = false;
  if (link) {
    hasLink = true;
    if (!buttonText) {
      buttonText = "Go to link";
    }
  }

  function keyEnterSpaceAction(event) {
    var key = 0;

    if (window.event) {
      key = window.event.keyCode;
    } else if (event) {
      key = event.keyCode;
    }
    // was the Enter or Space key pressed?
    if (key === 13 || key === 32) {
      event.preventDefault();
      setIsActive(!isActive);
    }

    return;
  }

  return (
    <div className="accordion-item">
      <div
        className="accordion-title"
        onClick={() => setIsActive(!isActive)}
        onKeyDown={keyEnterSpaceAction}
        tabIndex="0"
      >
        <div>{title}</div>
        <div>{isActive ? " -" : " +"}</div>
      </div>
      {isActive && (
        <div className="accordion-content">
          {"\n" + content}
          <br></br>
          <br></br>
          {hasLink && (
            <CardButton
              onClick={() => {
                if (isExternal) {
                  window.location.href = link;
                } else {
                  navigate(link);
                }
              }}
              text={buttonText}
              color="#b55b2c"
            ></CardButton>
          )}
        </div>
      )}
    </div>
  );
};

const Accordion2 = ({ title, content, buttonText, link, isExternal }) => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  let hasLink = false;
  if (link) {
    hasLink = true;
    if (!buttonText) {
      buttonText = "Go to link";
    }
  }

  function keyEnterSpaceAction(event) {
    var key = 0;

    if (window.event) {
      key = window.event.keyCode;
    } else if (event) {
      key = event.keyCode;
    }
    // was the Enter or Space key pressed?
    if (key === 13 || key === 32) {
      event.preventDefault();
      setIsActive(!isActive);
    }

    return;
  }

  return (
    <div className="accordion-item">
      <div
        className="accordion-title2"
        onClick={() => setIsActive(!isActive)}
        onKeyDown={keyEnterSpaceAction}
        tabIndex="0"
      >
        <div>{title}</div>
        <div>{isActive ? " -" : " +"}</div>
      </div>
      {isActive && (
        <div className="accordion-content2">
          {"\n" + content}
          <br></br>
          <br></br>
          {hasLink && (
            <CardButton
              onClick={() => {
                if (isExternal) {
                  window.location.href = link;
                } else {
                  navigate(link);
                }
              }}
              text={buttonText}
              color="#568571"
            ></CardButton>
          )}
        </div>
      )}
    </div>
  );
};

export { Accordion, Accordion2 };
