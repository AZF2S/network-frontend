import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { SecondaryButton } from "../SecondaryButton";
import { counties, cities } from "../../utils/constants";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { userGroups } from "../../utils/constants";
import "../.././config";
import { accountApi } from "../../api";

const MembershipDialog = ({ open, onClose, user, profilePicture }) => {
  const [roles, setRoles] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [profileOrgs, setProfileOrgs] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [membershipDate, setMembershipDate] = useState("");
  const [userTags, setUserTags] = useState([]);
  const [renewDate, setRenewDate] = useState("");
  const navigate = useNavigate();

  const handleChangeCity = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleChangeCounty = (event) => {
    setSelectedCounty(event.target.value);
  };

  const handleChangeRoles = (role) => (event) => {
    if (event.target.checked) {
      setRoles((prevRoles) => [...prevRoles, role]);
    } else {
      setRoles((prevRoles) => prevRoles.filter((r) => r !== role));
    }
  };

  const goToPicture = (userSlug) => {
    navigate(`/forum?picture=${userSlug}`);
  };

  const handleUpdateProfile = async () => {
    try {
      const updateData = {
        fullname: profileName,
        county: selectedCounty,
        city: selectedCity,
      };

      await accountApi.updateUser(updateData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileName(user.fullname);
      setRoles(user.groups);
      setProfileOrgs(user.organizations);
      setSelectedCounty(user.county);
      setSelectedCity(user.city);
      setMembershipDate(user.membershipdate);
      setRenewDate(user.renewdate);
      setUserTags(user.tags);
    }
  }, [user]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle
        sx={{ fontFamily: "Kindest", fontSize: "2.25rem" }}
        className="text-light-green"
      >
        Membership
      </DialogTitle>
      <DialogContent sx={{ marginLeft: 3, marginRight: 3 }}>
        <div className="gap-y-5 flex flex-col justify-center">
          <div className="flex flex-col gap-x-0 sm:inline-flex sm:flex-row sm:gap-x-10 gap-y-5">
            <div className="flex flex-col items-center gap-y-5">
              <img
                src={profilePicture}
                alt="ProfileImage"
                className="rounded-full border-3 border-solid border-light-green w-[170px] h-[170px] object-cover"
              />
              <div
                className="underline cursor-pointer"
                onClick={() => {
                  goToPicture(user.userslug);
                  onClose();
                }}
              >
                Change photo
              </div>
              <div className="flex flex-col gap-y-2 justify-center">
                <div className="text-light-green">Member Since</div>
                <div className="text-center">
                  {dayjs(membershipDate).format("M/DD/YYYY")}
                </div>
              </div>
              <div className="flex flex-col gap-y-2 justify-center">
                {dayjs(renewDate).diff(dayjs(), "day") > 14 ? (
                  <>
                    <div className="text-light-green">Membership ends in</div>
                    <div className="text-center">
                      {dayjs(renewDate).diff(dayjs(), "day") + " days"}
                    </div>
                  </>
                ) : dayjs(renewDate).diff(dayjs(), "day") > 0 ? (
                  <>
                    <div className="text-red-600">Membership ends in</div>
                    <div className="text-center text-red-600">
                      {dayjs(renewDate).diff(dayjs(), "day") + " days"}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-red-600">Membership Expired</div>
                  </>
                )}
              </div>
              {dayjs(renewDate).diff(dayjs(), "day") <= 14 ? (
                <Button
                  color="primary"
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  onClick={() => navigate("/renew-membership")}
                >
                  Renew Membership
                </Button>
              ) : (
                <div className="flex flex-col gap-y-2">
                  <div
                    className="inline-flex gap-x-2 text-light-green hover:underline cursor-pointer w-full justify-center"
                    onClick={() => {
                      navigate("/membership-form");
                      onClose();
                    }}
                  >
                    Update Information
                    <OpenInNewIcon />
                  </div>
                  <FormHelperText
                    sx={{ width: "100%", justifyContent: "center" }}
                  >
                    You will have to be verified again
                  </FormHelperText>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-4 w-72">
              <TextField
                margin="dense"
                id="name"
                label="Name"
                fullWidth
                variant="outlined"
                size="small"
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
              />
              <div className="flex flex-col gap-y-2">
                <div>Role(s)</div>
                <Divider />
                <div className="flex">
                  <FormGroup>
                    {userGroups
                      ?.slice(0, Math.ceil(userGroups.length / 2))
                      .map((group) => (
                        <FormControlLabel
                          control={<Checkbox />}
                          label={group}
                          checked={roles?.includes(group)}
                          onChange={handleChangeRoles(group)}
                          disabled
                        />
                      ))}
                  </FormGroup>
                  <FormGroup sx={{ marginLeft: "auto" }}>
                    {userGroups
                      ?.slice(Math.ceil(userGroups.length / 2))
                      .map((group) => (
                        <FormControlLabel
                          control={<Checkbox />}
                          label={group}
                          checked={roles?.includes(group)}
                          onChange={handleChangeRoles(group)}
                          disabled
                        />
                      ))}
                  </FormGroup>
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <div>My tag(s)</div>
                <Divider />
                {userTags?.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </div>
              <div className="flex flex-col gap-y-2">
                <div>My organization(s)</div>
                <Divider />
                {profileOrgs?.map((org, index) => (
                  <Chip
                    key={index}
                    label={`${org.name}${org.role ? ` - ${org.role}` : ""}
                `}
                    size="small"
                  />
                ))}
              </div>
              <div className="inline-flex gap-x-2">
                <FormControl
                  size="small"
                  sx={{
                    width: "50%",
                    marginTop: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <InputLabel>County</InputLabel>
                  <Select
                    margin="dense"
                    id="county"
                    label="County"
                    variant="outlined"
                    value={selectedCounty}
                    onChange={handleChangeCounty}
                  >
                    {counties.map((county) => (
                      <MenuItem value={county}>{county}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  size="small"
                  sx={{
                    width: "50%",
                    marginTop: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <InputLabel>City</InputLabel>
                  <Select
                    id="city"
                    label="City"
                    variant="outlined"
                    value={selectedCity}
                    onChange={handleChangeCity}
                  >
                    {cities.map((city) => (
                      <MenuItem value={city}>{city}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
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
            handleUpdateProfile();
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

export default MembershipDialog;
