import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { accountApi } from "../../api";
import { useEffect } from "react";
import { useState } from "react";
import { SecondaryButton } from "../SecondaryButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LabelWithBadge from "../LabelWithBadge";
import { useNavigate } from "react-router-dom";

const SettingsDialog = ({ open, onClose, user }) => {
  const [isDisplayingLocation, setIsDisplayingLocation] = useState(false);
  const [isDisplayingEmail, setIsDisplayingEmail] = useState(true);
  const [isDisplayingName, setIsDisplayingName] = useState(true);
  const [isShownOnMap, setIsShownOnMap] = useState(false);
  const [isShownAsContact, setIsShownAsContact] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(false);
  const [userSettings, setUserSettings] = useState(null);
  const [isDeleteingAccount, setIsDeletingAccount] = useState(false);
  const [isDeleteingMembership, setIsDeletingMembership] = useState(false);
  const navigate = useNavigate();

  const openDeletePrompt = () => {
    setIsDeletingAccount(true);
  };

  const closeDeletePrompt = () => {
    setIsDeletingAccount(false);
  };

  const openDeleteMembership = () => {
    setIsDeletingMembership(true);
  };

  const closeDeleteMembership = () => {
    setIsDeletingMembership(false);
  };

  const handleNewsletterChange = (event) => {
    setNewsletterChecked(event.target.checked);
  };

  const handleDisplayLocation = (event) => {
    setIsDisplayingLocation(event.target.checked);
  };

  const handleDisplayEmail = (event) => {
    setIsDisplayingEmail(event.target.checked);
  };

  const handleDisplayName = (event) => {
    setIsDisplayingName(event.target.checked);
  };

  const handleShowOnMap = (event) => {
    setIsShownOnMap(event.target.checked);
  };

  const handleShowAsContact = (event) => {
    setIsShownAsContact(event.target.checked);
  };

  const handleDeleteMembership = async () => {
    try {
      await accountApi.deleteMembership();
      closeDeleteMembership();
      navigate("/");
    } catch (error) {
      console.error("Error deleting membership:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await accountApi.deleteAccount();
      closeDeletePrompt();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleUpdateUserSettings = async () => {
    try {
      await accountApi.updateUserSettings({
        isDisplayingLocation,
        isDisplayingEmail,
        isDisplayingName,
        isShownOnMap,
        isShownAsContact,
        newsletterChecked,
      });
      onClose();
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  const goToSettings = (userSlug) => {
    navigate(`/forum?settings=${userSlug}`);
  };

  useEffect(() => {
    const getUserSettings = async () => {
      if (user["email:confirmed"]) {
        try {
          const settings = await accountApi.getUserSettings();
          setUserSettings(settings);
        } catch (error) {
          console.error("Error fetching user settings:", error);
        }
      }
    };
    getUserSettings();
  }, [user]);

  useEffect(() => {
    if (userSettings) {
      setIsDisplayingEmail(userSettings.showemail === "1");
      setIsDisplayingName(userSettings.showfullname === "1");
    }
    if (user) {
      setIsShownAsContact(user.appearoncontactlist);
      setIsShownOnMap(user.appearonmap);
      setNewsletterChecked(user.receivenewsletter);
      setIsDisplayingLocation(user.showlocation);
    }
  }, [userSettings, user]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle
        sx={{ fontFamily: "Kindest", fontSize: "2.25rem" }}
        className="text-light-green"
      >
        Settings
      </DialogTitle>
      <DialogContent>
        <div className="">
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-1">
              <div className="text-2xl">Notifications</div>
              <div className="flex flex-col">
                <div className="flex flex-inline items-center">
                  <OpenInNewIcon sx={{ margin: "9px" }} />
                  <div
                    className="hover:underline cursor-pointer"
                    onClick={() => {
                      goToSettings(user.userslug);
                      onClose();
                    }}
                  >
                    Receive email notifications for community forum activities
                    like messages, replies, and mentions.
                  </div>
                </div>
                <div className="flex flex-inline items-center">
                  <Checkbox
                    checked={newsletterChecked}
                    onChange={handleNewsletterChange}
                  />
                  <div className="">
                    Receive email notifications for AZ Farm-to-School Network
                    monthly newsletters.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="text-2xl">Privacy</div>
              <div className="flex flex-col ml-3">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Display full name on profile"
                    checked={isDisplayingName}
                    onChange={handleDisplayName}
                    disabled={!user["email:confirmed"]}
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Display contact email on profile"
                    checked={isDisplayingEmail}
                    onChange={handleDisplayEmail}
                    disabled={!user["email:confirmed"]}
                  />
                  {user?.memberstatus === "verified" && (
                    <>
                      <LabelWithBadge
                        label="Display location on profile"
                        checked={isDisplayingLocation}
                        onChange={handleDisplayLocation}
                      />
                      <LabelWithBadge
                        label="Show myself on the map"
                        checked={isShownOnMap}
                        onChange={handleShowOnMap}
                      />
                      <LabelWithBadge
                        label="Show myself on the contact list"
                        checked={isShownAsContact}
                        onChange={handleShowAsContact}
                      />
                    </>
                  )}
                </FormGroup>
                {!user["email:confirmed"] && (
                  <FormHelperText sx={{ color: "red" }}>
                    You must verify your email.
                  </FormHelperText>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="text-2xl">Advanced Settings</div>
              <div
                className="inline-flex gap-x-2 text-light-green hover:underline cursor-pointer w-fit"
                onClick={() => {
                  goToSettings(user.userslug);
                  onClose();
                }}
              >
                See advanced settings
                <OpenInNewIcon />
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              {user?.memberstatus === "verified" ? (
                <>
                  <div className="text-2xl">Delete Membership/Account</div>
                  <div className="w-full">
                    Deleting your account will remove your account and
                    everything associated with it. Deleting your membership will
                    remove you from the network member list and delete any
                    relevant member data.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl">Delete Account</div>
                  <div className="w-full">
                    Deleting your account will remove your account and
                    everything associated with it.
                  </div>
                </>
              )}
              <div className="w-full text-red-600 font-bold">
                Warning: This action is permanent and not reversible.
              </div>
              <div className="inline-flex gap-x-2">
                <Button
                  variant="outlined"
                  color="red"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    marginTop: "0.5rem",
                  }}
                  className="w-40"
                  onClick={openDeletePrompt}
                >
                  Delete Account
                </Button>
                {user?.memberstatus === "verified" && (
                  <Button
                    variant="outlined"
                    color="red"
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                    }}
                    className="w-fit"
                    onClick={openDeleteMembership}
                  >
                    Delete Membership
                  </Button>
                )}
              </div>
              <Dialog
                open={isDeleteingAccount}
                onClose={closeDeletePrompt}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{
                    fontFamily: "Kindest",
                    fontSize: "2.25rem",
                  }}
                  className="text-light-green"
                >
                  Are you sure you want to delete your account?
                </DialogTitle>

                <DialogActions className="mr-4 my-2">
                  <SecondaryButton
                    onClick={closeDeletePrompt}
                    variant="outlined"
                    sx={{
                      color: "#000",
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </SecondaryButton>
                  <Button
                    onClick={() => {
                      closeDeletePrompt();
                      handleDeleteAccount();
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
              <Dialog
                open={isDeleteingMembership}
                onClose={closeDeleteMembership}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{
                    fontFamily: "Kindest",
                    fontSize: "2.25rem",
                  }}
                  className="text-light-green"
                >
                  Are you sure you want to delete your membership?
                </DialogTitle>

                <DialogActions className="mr-4 my-2">
                  <SecondaryButton
                    onClick={closeDeleteMembership}
                    variant="outlined"
                    sx={{
                      color: "#000",
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </SecondaryButton>
                  <Button
                    onClick={() => {
                      closeDeleteMembership();
                      handleDeleteMembership();
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
            </div>
          </div>
        </div>
      </DialogContent>
      <Divider fullWidth />
      <DialogActions className="mr-4 my-2">
        <SecondaryButton
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "#000",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Cancel
        </SecondaryButton>
        <Button
          onClick={() => {
            onClose();
            handleUpdateUserSettings();
          }}
          variant="contained"
          sx={{
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
