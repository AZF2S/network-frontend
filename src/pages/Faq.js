//import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Accordion, Accordion2 } from "../components/Accordion";
import "./Faq.css";
import '.././config';
import { faqApi } from '../api';

function Faq() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [faqData, setFaqData] = useState();

  useEffect(() => {
    const getFaqData = async () => {
      try {
        const { data } = await faqApi.getFaqData();
        setFaqData(data.slice(1));
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      }
    };
    getFaqData();
  }, []);

  const GeneralQuestions = () => 
  {
    // TODO: Set up a logging service for critical errors like this.
    if (!faqData) return <div>Loading...</div>;

    let questions = [];

    for (let i = 0; i < faqData.length; i++) 
    {
      if (faqData[i].category === "general") 
      {
        questions.push(
          <Accordion
            key={i}
            title={faqData[i].question}
            content={faqData[i].answer}
            buttonText={faqData[i].buttonText}
            link={faqData[i].link}
            isExternal={faqData[i].isExternal}
          />
        );
      }
    }

    return <div>{questions}</div>;
  };

  const CollaboratorQuestions = () => 
  {
    if (!faqData) return <div>Loading...</div>;

    let questions = [];

    for (let i = 0; i < faqData.length; i++) {
      if (faqData[i].category === "collaborator") {
        questions.push(
          <Accordion2
            key={i}
            title={faqData[i].question}
            content={faqData[i].answer}
            buttonText={faqData[i].buttonText}
            link={faqData[i].link}
            isExternal={faqData[i].isExternal}
          />
        );
      }
    }

    return <div>{questions}</div>;
  };

  return (
    <>
      <div className="faq-hero-img">
        <h1>FAQs</h1>
      </div>

      <div className="accordion">
        <h2 className="h2green">General Questions</h2>
        <GeneralQuestions></GeneralQuestions>
      </div>

      <div className="accordion">
        <h2 className="h2purple">For Collaborators</h2>
        <CollaboratorQuestions></CollaboratorQuestions>
      </div>
    </>
  );
}

export default Faq;
