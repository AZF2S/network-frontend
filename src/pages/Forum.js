import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./forum.css";
import ".././config";
import { progressApi } from "../api";
import config from "../config";

const forumApiRoot = `${config.PROTOCOL}forum.${config.DOMAIN_NO_HTTPS}`;

function Forum() {
  const [searchParams] = useSearchParams();
  const forumRef = useRef(null);
  const topicUrl = searchParams.get("topic");
  const userUrl = searchParams.get("user");
  const messagesUrl = searchParams.get("messages");
  const settingsUrl = searchParams.get("settings");
  const pictureUrl = searchParams.get("picture");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const updateChecklistStep = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        await progressApi.updateChecklistStep("communityForum");
        console.log("Checklist step updated successfully");
      } catch (error) {
        console.error("Error updating checklist step:", error);
      }
    };
  
    updateChecklistStep();
  }, []);

  useEffect(() => {
    const iframe = document.getElementById("myIframe");
    if (topicUrl) {
      iframe.src = `${forumApiRoot}/topic/${topicUrl}`;
    } else if (userUrl) {
      iframe.src = `${forumApiRoot}/user/${userUrl}`;
    } else if (messagesUrl) {
      iframe.src = `${forumApiRoot}/user/${messagesUrl}/chats`;
    } else if (settingsUrl) {
      iframe.src = `${forumApiRoot}/user/${settingsUrl}/settings`;
    } else if (pictureUrl) {
      iframe.src = `${forumApiRoot}/user/${pictureUrl}/edit`;
    }
  }, [topicUrl, userUrl, messagesUrl, settingsUrl, pictureUrl]);

  return (
    <iframe
      width="100%"
      src={`${config.PROTOCOL}forum.${config.DOMAIN_NO_HTTPS}/categories`}
      title="AZF2S Forum"
      id="myIframe"
      style={{ height: "calc(100vh - 76px)", border: 0 }}
      ref={forumRef}
    ></iframe>
  );
}

export default Forum;
