import api from "../api";
import '.././config';
import config from "../config";

const sendNewMessage = async (recipientUsername, message) => {
  try {
    // Get the csrf token
    const configResponse = await api.get(
      `${config.NODEBB_URL}/api/config`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const csrfToken = configResponse.data.csrf_token;

    // Get the recipient's uid
    const userResponse = await api.get(
      `${config.NODEBB_URL}/api/user/username/${recipientUsername}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const recipientUid = userResponse.data.uid;

    // Create chat room in NodeBB
    const chatRoomResponse = await api.post(
      `${config.NODEBB_URL}/api/v3/chats`,
      {
        uids: [recipientUid],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
      }
    );

    console.log(chatRoomResponse);

    // Extract chat room id from the response
    const chatRoomId = chatRoomResponse.data.response.roomId;

    // Send a message to the chat room
    const sendMessageResponse = await api.post(
      `${config.NODEBB_URL}/api/v3/chats/${chatRoomId}`,
      {
        message: JSON.stringify({ ops: [{ insert: message }] }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
      }
    );

    return {
      message: "Chat room created and message sent successfully",
      chatRoom: chatRoomResponse.data,
      messageResponse: sendMessageResponse.data,
    };
  } catch (error) {
    console.error("Error creating chat room or sending message", error);
    return {
      error:
        "An error occurred while creating the chat room or sending the message",
    };
  }
};

const sendMessage = async (message, roomId) => {
  try {
    // Get the csrf token
    const configResponse = await api.get(
      `${config.NODEBB_URL}/api/config`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const csrfToken = configResponse.data.csrf_token;

    const response = await api.post(
      `${config.NODEBB_URL}/api/v3/chats/${roomId}`,
      {
        message: JSON.stringify({ ops: [{ insert: message }] }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
      }
    );

    console.log("Message sent successfully", response.data);
  } catch (error) {
    console.error("Error sending message", error);
  }
};

export { sendMessage, sendNewMessage };
