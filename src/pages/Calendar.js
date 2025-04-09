import React, { useEffect } from 'react';
import './Calendar.css';
import { progressApi } from "../api";

function Calendar() {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Create and load the main script
    const mainScript = document.createElement('script');
    mainScript.src = 'https://dist.eventscalendar.co/main.js';
    mainScript.async = true;

    // Create and load the embed script
    const embedScript = document.createElement('script');
    embedScript.src = 'https://dist.eventscalendar.co/embed.js';
    embedScript.async = true;

    // Append scripts to the body
    document.body.appendChild(mainScript);
    document.body.appendChild(embedScript);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.body.removeChild(mainScript);
      document.body.removeChild(embedScript);
    };
  }, []);

  useEffect(() => {
    const updateChecklist = async () => {
      try {
        await progressApi.updateChecklistStep("eventsCalendar");
      } catch (error) {
        console.error("Error updating checklist:", error);
      }
    };
    updateChecklist();
  }, []);

  return (
    <>
      <div
        id="hero-img-calendar"
        role="img"
        aria-label="Plants in a greenhouse"
      >
        <h1>Events Calendar</h1>
      </div>
      <div className="newClass">
        <div 
          data-events-calendar-app="true" 
          data-project-id="proj_3yttjF0R8J9XrnedNM5WF"
        ></div>
      </div>
    </>
  );
}

export default Calendar;
