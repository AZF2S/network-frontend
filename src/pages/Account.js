import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import profile_06 from "../assets/profile/default/profile-06.jpg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { accountApi, forumApi } from "../api";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { sendMessage, sendNewMessage } from "../utils/messaging";
import { htmlToText } from "html-to-text";
import SettingsDialog from "../components/Dialogs/SettingsDialog";
import MembershipDialog from "../components/Dialogs/MembershipDialog";
import config from '../config';

const Account = () => {
  const [setIsSettingsOpen] = useState(false);
  const [ setIsProfileOpen] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [roles, setRoles] = useState([]);
  const [previousMessages, setPreviousMessages] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [profileOrg, setProfileOrg] = useState("");
  const [profilePosition, setProfilePosition] = useState("");
  const [isDisplayingLocation] = useState(false);
  const [isDisplayingEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userTopics, setUserTopics] = useState();
  const [userAboutMe, setUserAboutMe] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState();
  const [setUserPicturePreview] = useState();
  const [userMessages, setUserMessages] = useState();
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageReceiver, setMessageReceiver] = useState();
  const [message, setMessage] = useState("");
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState();
  const [profileUsername, setProfileUsername] = useState("");
  const { setIsAuthenticated, user } = useAuth();
  const he = require("he");
  const navigate = useNavigate();

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };
  const handleNewMessage = () => {
    setIsNewMessageOpen(true);
  };

  const handleNewMessageClose = () => {
    setIsNewMessageOpen(false);
  };

  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleSendNewMessage = () => {
    sendNewMessage(messageReceiver, message);
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (message !== "") {
      await sendMessage(message, selectedRoomId);
      setPreviousMessages((prevMessages) => [
        ...prevMessages,
        {
          content: message,
          timestampISO: new Date().toISOString(),
          fromUser: {
            // You'll need to provide the sender's user data here
            username: profileUsername,
            picture: user?.picture,
          },
        },
      ]);
      setMessage("");
    }
  };

  const handleOpenProfile = () => {
    setIsProfileOpen(true);
  };
  const handleOpenMessage = () => {
    setIsMessageOpen(true);
  };

  const handleCloseMessage = () => {
    setIsMessageOpen(false);
  };

  const handleCloseDeleteMessage = () => {
    setIsDeletingMessage(false);
  };

  const handleOpenDeleteMessage = () => {
    setIsDeletingMessage(true);
  };
  const handleUpdateAboutMe = (event) => {
    setUserAboutMe(event.target.value);
  };

  const handleChangeMessageReceiver = (event) => {
    setMessageReceiver(event.target.value);
  };

  const handleLeaveChat = async () => {
    try {
      await forumApi.leaveChatRoom(selectedRoomId, { uid: user.uid });
      setUserMessages((prevMessages) =>
        prevMessages.filter((message) => message.roomId !== selectedRoomId)
      );
    } catch (error) {
      console.error("Error leaving chat room:", error);
    }
  };

  const goToTopicPost = (topicslug) => {
    navigate(`/forum?topic=${topicslug}`);
  };

  const handleSaveAboutMe = async () => {
    try {
      const response = await accountApi.updateUser({ aboutme: userAboutMe });
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUserChats = async () => {
    try {
      const chats = await accountApi.getUserChats();
      if (chats?.rooms) {
        setUserMessages(chats.rooms);
      }
    } catch (error) {
      console.error("Error fetching user chats:", error);
      return null;
    }
  };

  const fetchUserTopics = async (userslug) => {
    try {
      const topics = await accountApi.getUserTopics(userslug);
      return topics;
    } catch (error) {
      console.error("Error fetching user topics:", error);
      return null;
    }
  };

  const getUserProfilePicture = async (userslug) => {
    try {
      const user = await accountApi.getUserProfile(userslug);
      return user.picture;
    } catch (error) {
      console.error(`Error fetching user profile picture: ${error}`);
    }
  };

  const handleLogout = async () => {
    try {
      await accountApi.logout();
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchPreviousMessages = async () => {
    try {
      const messages = await accountApi.getChatMessages(selectedRoomId);
      setPreviousMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      setUserEmail(user.email);
      setUserAboutMe(user.aboutme);
      setProfileName(user.fullname);
      setRoles(user.roles);
      setProfileOrg(user.org);
      setProfilePosition(user.position);
      setSelectedCounty(user.county);
      setSelectedCity(user.city);
      setProfileUsername(user.username);
      const fetchAndSetUserTopics = async () => {
        const topics = await fetchUserTopics(user.userslug);
        setUserTopics(topics);
      };
      const getAndSetUserProfilePicture = async () => {
        const userPicture = await getUserProfilePicture(user.userslug);
        setUserProfilePicture(`${config.NODEBB_URL}${userPicture}`);
        setUserPicturePreview(`${config.NODEBB_URL}${userPicture}`);
      };
      fetchAndSetUserTopics();
      getAndSetUserProfilePicture();
      fetchUserChats();
    }
  }, [setUserPicturePreview, user]);

  useEffect(() => {
    if (selectedRoomId) {
      fetchPreviousMessages();
    }
  }, [fetchPreviousMessages, selectedRoomId]);

  const CustomButton = styled(Button)({
    color: "#000",
    border: "1px solid #808080",
    "&:hover": {
      border: "1px solid #000",
      backgroundColor: "#f2f2f2",
    },
  });

  return (
    <div className="flex justify-center bg-light-gray sm:h-[calc(100vh-78px)] h-full">
      <div className="w-full my-10">
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap sm:flex-nowrap w-full justify-center gap-x-5 mx-5 gap-y-5">
            <div className="flex flex-col gap-y-5">
              <div className="flex h-fit w-fit rounded-xl bg-white shadow-sm">
                <div className="m-5">
                  <div className="flex flex-col justify-center items-center gap-y-2">
                    <img
                      src={userProfilePicture ? userProfilePicture : profile_06}
                      className="rounded-full border-3 border-solid border-light-green w-[170px] h-[170px] object-cover"
                     alt={"User Profile"}/>
                    <div className="text-lg text-center font-semibold">
                      {profileName}
                    </div>
                    <div className="text-md text-center">
                      {user ? "@" + profileUsername : "Loading..."}
                    </div>
                    <div className="flex gap-x-2">
                      {roles.map((role) => (
                        <div
                          className={`flex w-fit rounded-lg ${
                            user ? "bg-light-green" : "bg-none"
                          }`}
                        >
                          <div className="mx-2 my-1 text-white font-bold text-sm">
                            {role}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-72 text-center">
                      {profilePosition && profileOrg
                        ? profilePosition + " at " + profileOrg
                        : profilePosition + "" + profileOrg}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 my-8">
                    <div className="inline-flex gap-x-2">
                      {isDisplayingLocation ? (
                        <>
                          <LocationOnIcon />
                          <div>
                            {selectedCity
                              ? selectedCounty + ", " + selectedCity
                              : selectedCounty}
                          </div>
                        </>
                      ) : null}
                    </div>
                    {isDisplayingEmail ? (
                      <div className="underline">{userEmail}</div>
                    ) : null}
                  </div>
                  <div>
                    <hr />
                    <div
                      className="m-2 hover:cursor-pointer"
                      onClick={handleOpenProfile}
                    >
                      <div className="inline-flex w-full justify-between">
                        <div>Edit Profile</div>
                        <EditIcon />
                      </div>
                    </div>
                    <MembershipDialog />
                    <hr />
                    <div
                      className="m-2 hover:cursor-pointer"
                      onClick={handleOpenSettings}
                    >
                      <div className="inline-flex w-full justify-between">
                        <div>Settings</div>
                        <SettingsIcon />
                      </div>
                    </div>
                    <SettingsDialog />
                    <hr />
                  </div>
                </div>
              </div>
              <Button
                variant="contained"
                color="purple"
                style={{
                  textTransform: "none",
                  color: "#FFF",
                  fontWeight: "600",
                }}
                onClick={handleLogout}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="text-center w-full">Log out</div>
                  <LogoutIcon />
                </div>
              </Button>
            </div>

            <div className="w-full max-w-[600px]">
              <Stack spacing={2.5}>
                <div className="h-fit rounded-xl bg-white shadow-sm">
                  <div className="m-5">
                    <div className="mb-5">
                      <div className="inline-flex w-full justify-between">
                        <div className="font-[Kindest] text-4xl text-light-green">
                          About
                        </div>
                        <Button
                          variant={"outlined"}
                          sx={{ textTransform: "none", fontWeight: "bold" }}
                          onClick={handleSaveAboutMe}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                    <TextField
                      id="about-text-field"
                      label="A little about yourself..."
                      multiline
                      rows={8}
                      fullWidth
                      value={userAboutMe}
                      onChange={handleUpdateAboutMe}
                    ></TextField>
                  </div>
                </div>
                <div className="h-fit rounded-xl bg-white shadow-sm">
                  <div className="flex h-fit rounded-xl bg-white shadow-sm">
                    <div className="flex flex-col gap-y-5 m-5 w-full">
                      <div className="inline-flex w-full justify-between">
                        <div className="font-[Kindest] text-4xl text-light-green">
                          Inbox
                        </div>
                        <Button
                          variant={"outlined"}
                          sx={{ textTransform: "none", fontWeight: "bold" }}
                          onClick={handleNewMessage}
                        >
                          New Message
                        </Button>
                        <Dialog
                          open={isNewMessageOpen}
                          onClose={handleNewMessageClose}
                          maxWidth="sm"
                          fullWidth
                        >
                          <DialogTitle
                            sx={{ fontFamily: "Kindest", fontSize: "2.25rem" }}
                            className="text-light-green"
                          >
                            New Message
                          </DialogTitle>
                          <DialogContent>
                            <div className="">
                              <div className="flex flex-col gap-y-3 w-full">
                                <div className="flex flex-col gap-y-1">
                                  <div className="text-2xl">To:</div>
                                </div>
                                <TextField
                                  variant="outlined"
                                  label="Username"
                                  fullWidth
                                  value={messageReceiver}
                                  onChange={handleChangeMessageReceiver}
                                />
                                <div className="flex flex-col gap-y-1">
                                  <div className="text-2xl">Message:</div>
                                </div>
                                <TextField
                                  variant="outlined"
                                  label="Body"
                                  multiline
                                  rows={8}
                                  fullWidth
                                  value={message}
                                  onChange={handleChangeMessage}
                                />
                              </div>
                            </div>
                          </DialogContent>
                          <DialogActions className="mr-4 my-2">
                            <CustomButton
                              onClick={handleNewMessageClose}
                              variant="outlined"
                              sx={{
                                color: "#000",
                                fontWeight: 600,
                                textTransform: "none",
                              }}
                            >
                              Cancel
                            </CustomButton>
                            <Button
                              onClick={() => {
                                handleNewMessageClose();
                                handleSendNewMessage();
                              }}
                              variant="contained"
                              sx={{
                                fontWeight: 600,
                                textTransform: "none",
                              }}
                            >
                              Send
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                      {userMessages && userMessages.length > 0 ? null : (
                        <div className="justify-center text-2xl text-gray">
                          No Messages
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {userMessages && userMessages.length > 0
                  ? userMessages.map((room, index) => (
                      <div
                        className="group flex h-fit rounded-xl bg-white shadow-sm cursor-pointer"
                        onClick={(e) => {
                          setSelectedRoomId(room.roomId);
                          handleOpenMessage();
                        }}
                      >
                        <div className="flex flex-col gap-y-2 m-5 w-full">
                          <div className="inline-flex justify-between items-center">
                            <div
                              key={index}
                              className="group-hover:underline font-[Gothic] text-2xl text-dark-green"
                            >
                            </div>
                            <IconButton
                              color={"darkGreen"}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDeleteMessage();
                              }}
                              size="small"
                              sx={{ "z-index": 100 }}
                            >
                              <RemoveCircleIcon
                                color={"darkGreen"}
                                sx={{ fontSize: "30px" }}
                              />
                            </IconButton>
                          </div>
                          <div className="inline-flex gap-x-3 items-cetner">
                            <div className="justify-center text-lg text-gray">
                              {room.teaser?.content
                                ? he.decode(room.teaser.content)
                                : ""}
                            </div>
                          </div>
                          <div className="justify-center text-lg text-gray">
                            {room.teaser?.user.username +
                              " - " +
                              dayjs(room.teaser?.timestamp).format(
                                "ddd, MMM D @ h:mmA"
                              )}
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
                <Dialog
                  open={isMessageOpen}
                  onClose={handleCloseMessage}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle
                    sx={{ fontFamily: "Kindest", fontSize: "2.25rem" }}
                    className="text-light-green"
                  >
                    Chat History
                  </DialogTitle>
                  <DialogContent>
                    <List>
                      {previousMessages
                        .filter(
                          (message) =>
                            !message.system &&
                            message.content !==
                              "[[modules:chat.message-deleted]]"
                        )
                        .map((message) => (
                          <ListItem key={message.messageId}>
                            <ListItemAvatar>
                              <Avatar
                                src={
                                  `${config.NODEBB_URL}${message.fromUser.picture}`
                                }
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={message.fromUser.username}
                              secondary={
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {message.content
                                      ? htmlToText(message.content, {
                                          wordwrap: false,
                                          ignoreHref: true,
                                        })
                                      : ""}
                                  </Typography>
                                  {" - " +
                                    dayjs(message.timestampISO).format(
                                      "MM/DD/YYYY h:mm A"
                                    )}
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                    </List>
                    <div className="flex flex-col gap-y-3">
                      <div className="text-2xl">Message:</div>
                      <TextField
                        variant="outlined"
                        label="Body"
                        multiline
                        rows={8}
                        fullWidth
                        value={message}
                        onChange={handleChangeMessage}
                      />
                    </div>
                  </DialogContent>
                  <DialogActions className="mr-4 my-2">
                    <CustomButton
                      onClick={handleCloseMessage}
                      variant="outlined"
                      sx={{
                        color: "#000",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      Cancel
                    </CustomButton>
                    <Button
                      onClick={() => {
                        handleSendMessage();
                      }}
                      variant="contained"
                      sx={{
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      Send
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={isDeletingMessage}
                  onClose={handleCloseDeleteMessage}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle
                    sx={{
                      fontFamily: "Gothic",
                      fontSize: "2.25rem",
                    }}
                    className="text-dark-green"
                  >
                    <div>
                      Are you sure you want to delete this message board?
                    </div>
                    <div>You will not be able to come back to it again.</div>
                  </DialogTitle>

                  <DialogActions className="mr-4 my-2">
                    <CustomButton
                      onClick={handleCloseDeleteMessage}
                      variant="outlined"
                      sx={{
                        color: "#000",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      Cancel
                    </CustomButton>
                    <Button
                      onClick={() => {
                        handleCloseDeleteMessage();
                        handleLeaveChat();
                      }}
                      variant="contained"
                      color="red"
                      sx={{
                        fontWeight: 600,
                        textTransform: "none",
                        color: "#fff",
                      }}
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
                <div className="flex h-fit rounded-xl bg-white shadow-sm">
                  <div className="flex flex-col gap-y-5 m-5">
                    <div className="inline-flex w-full justify-between">
                      <div className="font-[Kindest] text-4xl text-light-green">
                        Posts
                      </div>
                    </div>
                    {userTopics && userTopics.length > 0 ? null : (
                      <div className="justify-center text-2xl text-gray">
                        No Posts
                      </div>
                    )}
                  </div>
                </div>
                {userTopics && userTopics.length > 0
                  ? userTopics.map((topic, index) => (
                      <div
                        className="group flex h-fit rounded-xl bg-white shadow-sm cursor-pointer"
                        onClick={() => {
                          goToTopicPost(topic.slug);
                        }}
                      >
                        <div className="flex flex-col gap-y-2 m-5 w-full">
                          <div className="inline-flex justify-between items-center">
                            <div
                              key={index}
                              className="group-hover:underline font-[Gothic] text-2xl text-dark-green"
                            >
                              {topic.title}
                            </div>
                            <OpenInNewIcon sx={{ fontSize: "30px" }} />
                          </div>
                          <div className="inline-flex gap-x-3 items-cetner">
                            <div className="justify-center text-lg text-gray">
                              {topic.category.name}
                            </div>
                            <div className="justify-center text-lg text-gray">
                              |
                            </div>
                            <div className="justify-center text-lg text-gray">
                              {dayjs(topic.timestamp).format(
                                "ddd, MMM D @ h:mA"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Account;
