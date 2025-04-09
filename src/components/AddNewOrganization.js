import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import foodEducator from "../assets/map/icon-food-education.png";
import gardenEducator from "../assets/map/icon-school-gardens.png";
import procurement from "../assets/map/icon-procurement.png";
import SelectMapTags from "../components/SelectMapTags";
import { useAuth } from "../contexts/AuthContext";
import { organizationApi } from "../api";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AddNewOrganization = ({
  showOrgForm,
  setShowOrgForm,
  addOrganization,
  setInputKey,
  orgTypes,
}) => {
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgCity, setOrgCity] = useState("");
  const [orgZip, setOrgZip] = useState("");
  const [orgInvolvements, setOrgInvolvements] = useState({
    foodEducation: false,
    gardenEducation: false,
    procurement: false,
  });
  const [orgTags, setOrgTags] = useState([]);
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgIsPublic, setOrgIsPublic] = useState(false);
  const [profilePosition, setProfilePosition] = useState();
  const [addingNewOrg, setAddingNewOrg] = useState(false);
useAuth();

  const isValid = () =>
    orgName && orgType && orgAddress && orgCity && orgZip && profilePosition;

  const handleAddOrganization = async () => {
    const newOrg = {
      name: orgName,
      type: orgType,
      address: orgAddress,
      city: orgCity,
      zip: orgZip,
      involvements: orgInvolvements,
      tags: orgTags,
      website: orgWebsite,
      isPublic: orgIsPublic,
      members: [],
    };

    setAddingNewOrg(true);

    const addedOrgId = await handleAddNewOrganization(newOrg);

    addOrganization({
      _id: addedOrgId,
      name: orgName,
      role: profilePosition,
    });

    setAddingNewOrg(false);

    setOrgName("");
    setOrgType("");
    setProfilePosition("");
    setOrgAddress("");
    setOrgCity("");
    setOrgZip("");
    setOrgInvolvements({}); // Replace with the default state of orgInvolvements if it's not an empty object
    setOrgWebsite("");
    setInputKey((prevKey) => prevKey + 1);
    setShowOrgForm(false);
  };

  const handleAddNewOrganization = async (newOrg) => {
    try {
      const response = await organizationApi.addOrganization(newOrg);
      return response.orgId;
    } catch (error) {
      console.error('Error adding organization:', error);
      throw error;
    }
  };

  return (
    <div
      className={`flex-col justify-center gap-y-5 ${
        showOrgForm ? "flex" : "hidden"
      }`}
    >
      <div className="text-4xl font-[Kindest] text-light-green text-center">
        About your organization
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-3xl w-full gap-y-5">
          <div className="flex flex-col gap-y-3">
            <div className="text-2xl">Organization Info</div>
            <div className="inline-flex gap-x-3">
              <TextField
                variant="outlined"
                label="Org. Name*"
                value={orgName}
                sx={{ width: "67%" }}
                onChange={(event) => setOrgName(event.target.value)}
                size="small"
              />
              <FormControl sx={{ width: "33%" }} size="small">
                <FormHelperText sx={{ fontWeight: 600 }}>
                  Type to add new
                </FormHelperText>
                <Autocomplete
                  noOptionsText={orgType ? "" : "No options"}
                  value={orgType}
                  size="small"
                  onChange={(e, newValue) => setOrgType(newValue)}
                  onInputChange={(e, newInputValue) =>
                    setOrgType(newInputValue)
                  }
                  options={orgTypes}
                  renderInput={(params) => (
                    <TextField {...params} label="Org. Type*" />
                  )}
                />
              </FormControl>
            </div>
            <TextField
              variant="outlined"
              label="Your Position/Title*"
              value={profilePosition}
              onChange={(event) => setProfilePosition(event.target.value)}
              size="small"
            />
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="text-2xl">Where are you located?</div>
            <div className="flex flex-col gap-y-3">
              <TextField
                variant="outlined"
                label="Organization Address*"
                value={orgAddress}
                onChange={(event) => setOrgAddress(event.target.value)}
                size="small"
              />
              <div className="inline-flex gap-x-3">
                <TextField
                  variant="outlined"
                  label="City*"
                  value={orgCity}
                  sx={{ width: "50%" }}
                  onChange={(event) => setOrgCity(event.target.value)}
                  size="small"
                />
                <TextField
                  variant="outlined"
                  label="Zipcode*"
                  value={orgZip}
                  sx={{ width: "50%" }}
                  onChange={(event) => setOrgZip(event.target.value)}
                  size="small"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="text-2xl">
              Do you participate in any of the following?
            </div>
            <div className="inline-flex gap-x-3 flex-wrap gap-y-3">
              <div
                className={`${
                  orgInvolvements.foodEducation
                    ? "border-eggplant"
                    : "border-eggplant/0 hover:border-eggplant/50"
                } transition-border-opacity duration-300 flex inline-flex gap-x-1 items-center cursor-pointer p-1 border-3 border-solid rounded-lg`}
                onClick={() =>
                  setOrgInvolvements({
                    ...orgInvolvements,
                    foodEducation: !orgInvolvements.foodEducation,
                  })
                }
              >
                <img src={foodEducator} className="w-10" />
                <div className="text-sm">Food Education</div>
              </div>
              <div
                className={`${
                  orgInvolvements.gardenEducation
                    ? "border-sage"
                    : "border-sage/0 hover:border-sage/50"
                } transition-border-opacity duration-300 flex inline-flex gap-x-1 items-center cursor-pointer p-1 border-3 border-solid rounded-lg`}
                onClick={() =>
                  setOrgInvolvements({
                    ...orgInvolvements,
                    gardenEducation: !orgInvolvements.gardenEducation,
                  })
                }
              >
                <img src={gardenEducator} className="w-10" />
                <div className="text-sm">Garden Education</div>
              </div>
              <div
                className={`${
                  orgInvolvements.procurement
                    ? "border-orange"
                    : "border-orange/0 hover:border-orange/50"
                } transition-border-opacity duration-300 flex inline-flex gap-x-1 items-center cursor-pointer p-1 border-3 border-solid rounded-lg`}
                onClick={() =>
                  setOrgInvolvements({
                    ...orgInvolvements,
                    procurement: !orgInvolvements.procurement,
                  })
                }
              >
                <img src={procurement} className="w-10" />
                <div className="text-sm">Procurement</div>
              </div>
              <SelectMapTags
                selectedTags={orgTags}
                setSelectedTags={setOrgTags}
                disabled={false}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="text-2xl">Organization Details</div>
            <TextField
              variant="outlined"
              label="Website"
              value={orgWebsite}
              onChange={(event) => setOrgWebsite(event.target.value)}
              size="small"
            />
            <div className="inline-flex items-center">
              <FormControlLabel
                control={<Checkbox />}
                label="Is this a public organization?"
                checked={orgIsPublic}
                onChange={() => setOrgIsPublic(!orgIsPublic)}
              />
              <Tooltip
                title="Should this organization be shown on the map?"
                arrow
                placement="right"
              >
                <InfoOutlinedIcon />
              </Tooltip>
            </div>
          </div>
          {addingNewOrg ? (
            <CircularProgress sx={{ marginLeft: "auto" }} />
          ) : (
            <Button
              color="primary"
              variant="outlined"
              disabled={!isValid()}
              onClick={handleAddOrganization}
              sx={{
                width: "fit-content",
                textTransform: "none",
                marginLeft: "auto",
              }}
            >
              Add Organization
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewOrganization;
