import React, { useState } from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Pagination,
  Tooltip,
} from "@mui/material";
import SelectMapTags from "../SelectMapTags";
import foodEducator from "../../assets/map/icon-food-education.png";
import gardenEducator from "../../assets/map/icon-school-gardens.png";
import procurement from "../../assets/map/icon-procurement.png";
import { useEffect } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const orgTypes = ["School", "Farm", "Non-profit"];

const EditOrganizationDialog = ({
  open,
  onClose,
  organizations,
  onUpdate,
  isAdmin,
}) => {
  const [orgName, setOrgName] = useState();
  const [orgType, setOrgType] = useState();
  const [orgAddress, setOrgAddress] = useState();
  const [orgCity, setOrgCity] = useState();
  const [orgZip, setOrgZip] = useState();
  const [orgInvolvements, setOrgInvolvements] = useState({
    foodEducation: false,
    gardenEducation: false,
    procurement: false,
  });
  const [orgWebsite, setOrgWebsite] = useState();
  const [orgIsPublic, setOrgIsPublic] = useState();
  const [orgTags, setOrgTags] = useState([]);
  const [orgId, setOrgId] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (organizations?.length > 0) {
      setOrgName(organizations[currentIndex].name);
      setOrgType(organizations[currentIndex].type);
      setOrgAddress(organizations[currentIndex].address);
      setOrgCity(organizations[currentIndex].city);
      setOrgZip(organizations[currentIndex].zip);
      setOrgInvolvements(organizations[currentIndex].involvements || {});
      setOrgWebsite(organizations[currentIndex].website);
      setOrgIsPublic(organizations[currentIndex].isPublic);
      setOrgTags(organizations[currentIndex].tags || []);
      setOrgId(organizations[currentIndex]._id);
    }
  }, [organizations, currentIndex]);

  const handleSubmit = () => {
    onUpdate({
      _id: orgId,
      name: orgName,
      type: orgType,
      address: orgAddress,
      city: orgCity,
      zip: orgZip,
      involvements: orgInvolvements,
      website: orgWebsite,
      isPublic: orgIsPublic,
      tags: orgTags,
    });
    onClose();
  };

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle
        sx={{ fontFamily: "Kindest", fontSize: "2rem" }}
        className="text-light-green"
      >
        {orgName ? orgName : "No Organizations"}
      </DialogTitle>
      {organizations?.length > 0 && (
        <DialogContent>
          <div className="">
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-3">
                <div className="text-2xl">Information</div>
                <div className="inline-flex gap-x-3">
                  <TextField
                    variant="outlined"
                    label="Name"
                    sx={{ width: "67%" }}
                    onChange={(event) => setOrgName(event.target.value)}
                    size="small"
                    value={orgName}
                    disabled={!isAdmin}
                  />
                  <FormControl sx={{ width: "33%" }}>
                    <Autocomplete
                      value={orgType}
                      onChange={(e, newValue) => setOrgType(newValue)}
                      onInputChange={(e, newInputValue) =>
                        setOrgType(newInputValue)
                      }
                      options={orgTypes}
                      renderInput={(params) => (
                        <TextField {...params} label="Org. Type*" />
                      )}
                      size="small"
                      disabled={!isAdmin}
                    />
                    {isAdmin && (
                      <FormHelperText>Type to add new</FormHelperText>
                    )}
                  </FormControl>
                </div>
              </div>
              <div className="flex flex-col gap-y-3">
                <div className="text-2xl">Location</div>
                <div className="flex flex-col gap-y-3">
                  <TextField
                    variant="outlined"
                    label="Organization Address"
                    onChange={(event) => setOrgAddress(event.target.value)}
                    size="small"
                    value={orgAddress}
                    disabled={!isAdmin}
                  />
                  <div className="inline-flex gap-x-3">
                    <TextField
                      variant="outlined"
                      label="City"
                      sx={{ width: "50%" }}
                      onChange={(event) => setOrgCity(event.target.value)}
                      size="small"
                      value={orgCity}
                      disabled={!isAdmin}
                    />
                    <TextField
                      variant="outlined"
                      label="Zipcode"
                      sx={{ width: "50%" }}
                      onChange={(event) => setOrgZip(event.target.value)}
                      size="small"
                      value={orgZip}
                      disabled={!isAdmin}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-3">
                <div className="text-2xl">Involvements</div>
                <div className="inline-flex gap-x-5 flex-wrap gapy-y-2">
                  <div
                    className={`${
                      orgInvolvements.foodEducation
                        ? "border-eggplant"
                        : "border-eggplant/0 hover:border-eggplant/50"
                    } transition-border-opacity duration-300 inline-flex gap-x-1 items-center cursor-pointer p-1 border-3 border-solid rounded-lg`}
                    onClick={
                      isAdmin
                        ? () =>
                            setOrgInvolvements({
                              ...orgInvolvements,
                              foodEducation: !orgInvolvements.foodEducation,
                            })
                        : () => {}
                    }
                  >
                    <img src={foodEducator} className="w-10" alt="Food educator"/>
                    <div className="text-sm">Food Education</div>
                  </div>
                  <div
                    className={`${
                      orgInvolvements.gardenEducation
                        ? "border-sage"
                        : "border-sage/0 hover:border-sage/50"
                    } transition-border-opacity duration-300 inline-flex gap-x-1 items-center cursor-pointer p-1 border-3 border-solid rounded-lg`}
                    onClick={
                      isAdmin
                        ? () =>
                            setOrgInvolvements({
                              ...orgInvolvements,
                              gardenEducation: !orgInvolvements.gardenEducation,
                            })
                        : () => {}
                    }
                  >
                    <img src={gardenEducator} className="w-10" alt="Garden educator"/>
                    <div className="text-sm">Garden Education</div>
                  </div>
                  <div
                    className={`${
                      orgInvolvements.procurement
                        ? "border-orange"
                        : "border-orange/0 hover:border-orange/50"
                    } transition-border-opacity duration-300 inline-flex gap-x-1 items-center cursor-pointer p-1 border-3 border-solid rounded-lg`}
                    onClick={
                      isAdmin
                        ? () =>
                            setOrgInvolvements({
                              ...orgInvolvements,
                              procurement: !orgInvolvements.procurement,
                            })
                        : () => {}
                    }
                  >
                    <img src={procurement} className="w-10" alt="Procurement"/>
                    <div className="text-sm">Procurement</div>
                  </div>
                </div>
                <div className="mt-2">
                  <SelectMapTags
                    selectedTags={orgTags}
                    setSelectedTags={setOrgTags}
                    disabled={!isAdmin}
                  />
                </div>
                <TextField
                  margin="dense"
                  id="website"
                  label="Website"
                  type="url"
                  size="small"
                  fullWidth
                  value={orgWebsite}
                  onChange={(event) => setOrgWebsite(event.target.value)}
                  disabled={!isAdmin}
                />
                <div className="inline-flex items-center">
                  <FormControlLabel
                    control={<Checkbox disabled={!isAdmin} />}
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
              {organizations?.length > 1 && (
                <Pagination
                  count={organizations?.length}
                  page={currentIndex + 1}
                  onChange={(event, page) => setCurrentIndex(page - 1)}
                  color="primary"
                  shape="rounded"
                  sx={{
                    justifyContent: "center",
                    display: "flex",
                  }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      )}
      <DialogActions>
        <Button
          variant={isAdmin ? "outlined" : "contained"}
          onClick={() => onClose()}
          sx={{ textTransform: "none" }}
        >
          Close
        </Button>
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => {
              handleSubmit();
              onClose();
            }}
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditOrganizationDialog;
