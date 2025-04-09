import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Cancel } from "@mui/icons-material";
import AddNewOrganization from "./AddNewOrganization";
import { organizationApi } from "../api";
import ".././config";

export default function SelectOrganization({
  addOrganization,
  setShowOrgForm,
  completedOrgs,
  setCompletedOrgs,
  previousOrgs,
  showOrgForm,
  organizationError,
  setOrganizationError,
}) {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [profilePosition, setProfilePosition] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const [orgTypes, setOrgTypes] = useState([]);

  useEffect(() => {
    const getOrganizations = async () => {
      try {
        const organizations = await organizationApi.getVerifiedOrganizations();
        const orgTypes = [
          ...new Set(organizations.map((org) => org.type)),
        ];
        setOrgTypes(orgTypes);
        setOrganizations(organizations);
      } catch (error) {
        console.error(error);
      }
    };
    console.log(completedOrgs);
    getOrganizations();
  }, [completedOrgs]);

  const handleAddOrganization = () => {
    if (isValid) {
      addOrganization({
        organization:
          typeof selectedOrganization === "string"
            ? {
                name: selectedOrganization,
              }
            : selectedOrganization,
        role: profilePosition,
      });
      setSelectedOrganization(null);
      setInputKey((prevKey) => prevKey + 1);
      setProfilePosition("");
      setShowOrgForm(false);
      setOrganizationError(false);
    }
  };

  const removeOrganization = async (org) => {
    const matchingOrg = previousOrgs.find(
      (previousOrg) => previousOrg?._id === org._id
    );
    try {
      if (matchingOrg) {
        console.log(matchingOrg);
        setCompletedOrgs((prevState) =>
          prevState.filter((previousOrg) => previousOrg._id !== org._id)
        );
        await organizationApi.removeMember(matchingOrg._id);
      } else {
        console.log(org);
        setCompletedOrgs((prevState) =>
          prevState.filter(
            (previousOrg) =>
              previousOrg._id !== org._id &&
              previousOrg.name !== "Independent Contractor"
          )
        );
      }
    } catch (error) {
      console.error("Error removing organization:", error);
    }
  };

  const handleOrgChange = (event, newValue) => {
    setSelectedOrganization(newValue);
    setShowOrgForm(newValue === "Not listed (Add new)");
    setOrganizationError(false);
  };

  const isValid = () =>
    (selectedOrganization && profilePosition) ||
    selectedOrganization === "Independent Contractor";

  return (
    <>
      <div className="flex justify-center">
        <div className="max-w-3xl w-full flex flex-col gap-y-3">
          <div>
            <div>My organization(s)</div>
            <Divider />
          </div>
          <FormControl
            sx={{ width: "100%" }}
            size="small"
            error={organizationError}
          >
            <div className="flex flex-col gap-y-3">
              <Autocomplete
                key={inputKey}
                options={[
                  "Independent Contractor",
                  "Not listed (Add new)",
                  ...organizations,
                ]}
                size="small"
                onChange={handleOrgChange}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option?.name
                }
                getOptionDisabled={(option) =>
                  typeof option === "string"
                    ? false
                    : completedOrgs.find((org) => org._id === option._id) !==
                      undefined
                }
                renderOption={(props, option, { selected }) => (
                  <>
                    <li {...props}>
                      {typeof option === "string" ? option : option.name}
                    </li>
                    {option === "Not listed (Add new)" && <Divider />}
                  </>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="School/Organization*"
                    error={organizationError}
                  />
                )}
              />

              {!showOrgForm && (
                <>
                  {selectedOrganization !== "Independent Contractor" && (
                    <TextField
                      margin="none"
                      id="position"
                      label="Position/Title*"
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={profilePosition}
                      error={organizationError}
                      onChange={(event) =>
                        setProfilePosition(event.target.value)
                      }
                    />
                  )}

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
                </>
              )}
            </div>
            {organizationError && (
              <FormHelperText sx={{ color: "red" }}>
                You must add an organization
              </FormHelperText>
            )}
          </FormControl>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              gap: 1,
              mt: 1,
            }}
          >
            {completedOrgs.map((org, index) => (
              <Chip
                key={index}
                label={`${
                  org.organization?.name ? org.organization.name : org.name
                }${org.role ? ` - ${org.role}` : ""}
                `}
                size="small"
                deleteIcon={<Cancel />}
                onDelete={() => removeOrganization(org)}
              />
            ))}
          </Box>
        </div>
      </div>
      <AddNewOrganization
        setShowOrgForm={setShowOrgForm}
        showOrgForm={showOrgForm}
        addOrganization={addOrganization}
        setInputKey={setInputKey}
        orgTypes={orgTypes}
      />
    </>
  );
}
