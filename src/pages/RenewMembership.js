import {
  Button,
  Checkbox,
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
import { cities, counties, userGroups } from "../utils/constants";
import SelectOrganization from "../components/SelectOrganization";
import SelectUserTags from "../components/SelectUserTags";
import SelectMemberGains from "../components/SelectMemberGains";
import SelectNutritionPrograms from "../components/SelectNutritionPrograms";
import SelectCOP from "../components/SelectCOP";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import dayjs from "dayjs";
import { accountApi } from "../api";

const RenewMembership = () => {
  const [roles, setRoles] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [completedOrgs, setCompletedOrgs] = useState([]);
  const [newOrgs, setNewOrgs] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [memberGains, setMemberGains] = useState([]);
  const [otherGains, setOtherGains] = useState([]);
  const [memberGainsError, setMemberGainsError] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [interestedPrograms, setInterestedPrograms] = useState([]);
  const [activePrograms, setActivePrograms] = useState([]);
  const [foodItemsActivelyBought, setFoodItemsActivelyBought] = useState("");
  const [foodItemsInterestedInBuying, setFoodItemsInterestedInBuying] =
    useState("");
  const [foodItemsActivelySelling, setFoodItemsActivelySelling] = useState("");
  const [foodItemsInterestedInSelling, setFoodItemsInterestedInSelling] =
    useState("");
  const [organizationError, setOrganizationError] = useState(false);
  const [userGroupError, setUserGroupError] = useState(false);
  const [otherRole, setOtherRole] = useState("");
  const [isOtherRoleChecked, setIsOtherRoleChecked] = useState(false);
  const [renewalGains, setRenewalGains] = useState("");
  const [renewalGainsError, setRenewalGainsError] = useState(false);
  const { user } = useAuth();
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
      setUserGroupError(false);
    } else {
      setRoles((prevRoles) => prevRoles.filter((r) => r !== role));
      setUserGroupError(roles.length === 1);
    }
  };

  const handleChangeOtherRole = (event) => {
    setOtherRole(event.target.value);
    setIsOtherRoleChecked(event.target.value !== "");
  };

  const addOrganization = (newOrg) => {
    setCompletedOrgs((prevState) => [...prevState, newOrg]);
    if (newOrg.organization.address) {
      setNewOrgs((prevState) => [...prevState, newOrg.organization]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        roles,
        selectedCounty,
        selectedCity,
        additionalComments,
        completedOrgs,
        newOrgs,
        userTags,
        memberGains,
        otherGains,
        communities,
        interestedPrograms,
        activePrograms,
        foodItemsActivelyBought,
        foodItemsInterestedInBuying,
        foodItemsActivelySelling,
        foodItemsInterestedInSelling,
        otherRole,
        isOtherRoleChecked,
      };

      const response = await accountApi.submitMembershipRenewal(formData);
      if (response.success) {
        navigate("/thank-you-membership");
      }
    } catch (error) {
      console.error("Error submitting membership renewal:", error);
    }
  };

  const submitForm = () => {
    if (roles.length === 0) {
      setUserGroupError(true);
      return;
    }
    if (memberGains.length === 0) {
      setMemberGainsError(true);
      return;
    }
    if (completedOrgs.length === 0) {
      setOrganizationError(true);
      return;
    }
    if (renewalGains === "") {
      setRenewalGainsError(true);
      return;
    }
    if (otherRole !== "" && isOtherRoleChecked) {
      setRoles((prevRoles) => [...prevRoles, otherRole]);
    }

    const orgNameAndPositions = completedOrgs.map((org) => {
      return {
        name: org.organization.name,
        position: org.position,
      };
    });

    const completedForm = {
      user: {
        groups: roles,
        tags: userTags,
        organizations: orgNameAndPositions,
        county: selectedCounty,
        city: selectedCity,
        communitiesofpractice: communities,
        hopetogain: memberGains,
        othergains: otherGains,
        gainedthisyear: renewalGains,
        additionalcomments: additionalComments,
      },
    };

    if (userTags.includes("Local Producer")) {
      completedForm.user.foodItemsInterestedInSelling =
        foodItemsInterestedInSelling;
      completedForm.user.foodItemsActivelySelling = foodItemsActivelySelling;
    } else if (userTags.includes("Food Buyer")) {
      completedForm.user.activePrograms = activePrograms;
      completedForm.user.interestedPrograms = interestedPrograms;
      completedForm.user.foodItemsActivelyBought = foodItemsActivelyBought;
      completedForm.user.foodItemsInterestedInBuying =
        foodItemsInterestedInBuying;
    }

    handleSubmit();
  };

  useEffect(() => {
    if (user) {
      if (dayjs(user.renewdate).diff(dayjs(), "day") > 14) {
        navigate("/");
      } else {
        setRoles(user.groups ? user.groups : []);
        setUserTags(user.tags ? user.tags : []);
        setCompletedOrgs(user.orgs ? user.orgs : []);
        setSelectedCity(user.city);
        setSelectedCounty(user.county);
        setCommunities(user.communitiesofpractice ? user.communitiesofpractice : []);
        setMemberGains(user.hopetogain ? user.hopetogain : []);
        setOtherGains(user.otherGains);
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col m-12 justify-center gap-y-7">
      <div className="flex flex-col justify-center gap-y-5">
        <div className="text-4xl font-[Kindest] text-light-green text-center">
          Membership Renewal
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex justify-center">
            <div className="flex flex-col max-w-3xl w-full gap-y-3">
              <div>
                <div>I am a(n)*</div>
                <Divider />
                <div className="flex">
                  <FormControl
                    error={userGroupError}
                    component="fieldset"
                    variant="standard"
                  >
                    <FormGroup sx={{ flexDirection: "row" }}>
                      {userGroups.map((userGroup) => (
                        <FormControlLabel
                          control={<Checkbox />}
                          label={userGroup}
                          checked={roles.includes(userGroup)}
                          onChange={handleChangeRoles(userGroup)}
                        />
                      ))}
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() =>
                              setIsOtherRoleChecked(!isOtherRoleChecked)
                            }
                          />
                        }
                        label={
                          <div className="flex items-center">
                            Other:
                            <TextField
                              variant="standard"
                              sx={{ marginLeft: "10px", marginBottom: "-2px" }}
                              onChange={handleChangeOtherRole}
                            />
                          </div>
                        }
                        checked={isOtherRoleChecked}
                        onChange={handleChangeRoles("Other")}
                        sx={{ marginTop: "1px" }}
                      />
                    </FormGroup>
                    {userGroupError && (
                      <FormHelperText sx={{ marginLeft: "14px" }}>
                        You must select a group
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
              </div>
              <div className="w-full max-w-3xl">
                <SelectUserTags
                  selectedTags={userTags}
                  setSelectedTags={setUserTags}
                />
              </div>
              {userTags.includes("School Food Buyer") && (
                <div className="w-full max-w-3xl flex flex-col gap-y-3">
                  <div>
                    <div>
                      What school nutrition programs are you{" "}
                      <div className="underline inline">
                        currently incorporating
                      </div>{" "}
                      local food into?
                    </div>
                    <Divider />
                  </div>
                  <SelectNutritionPrograms
                    selectedTags={interestedPrograms}
                    setSelectedTags={setInterestedPrograms}
                  />
                  <div>
                    <div>
                      What school nutrition programs would you{" "}
                      <div className="underline inline">
                        like to incorporate
                      </div>{" "}
                      local food into?
                    </div>
                    <Divider />
                  </div>
                  <SelectNutritionPrograms
                    selectedTags={activePrograms}
                    setSelectedTags={setActivePrograms}
                  />
                  <div>
                    <div>
                      Please share food items you are{" "}
                      <div className="underline inline">actively buying</div>{" "}
                      from local producers for school nutrition programs.
                    </div>
                    <Divider />
                  </div>
                  <TextField
                    label="Food Items"
                    multiline
                    rows={3}
                    fullWidth
                    helperText="Please use a comma separated list"
                    onChange={(e) => setFoodItemsActivelyBought(e.target.value)}
                  />
                  <div>
                    <div>
                      Please share food items you are{" "}
                      <div className="underline inline">
                        interested in buying
                      </div>{" "}
                      from local producers for school nutrition programs.
                    </div>
                    <Divider />
                  </div>
                  <TextField
                    label="Food Items"
                    multiline
                    rows={3}
                    fullWidth
                    helperText="Please use a comma separated list"
                    onChange={(e) =>
                      setFoodItemsInterestedInBuying(e.target.value)
                    }
                  />
                </div>
              )}
              {userTags.includes("Local Producer") && (
                <div className="w-full max-w-3xl flex flex-col gap-y-3">
                  <div>
                    <div>
                      Please share food items you are{" "}
                      <div className="underline inline">actively selling</div>{" "}
                      to school nutrition programs.
                    </div>
                    <Divider />
                  </div>
                  <TextField
                    label="Food Items"
                    multiline
                    rows={3}
                    fullWidth
                    helperText="Please use a comma separated list"
                    onChange={(e) =>
                      setFoodItemsActivelySelling(e.target.value)
                    }
                  />
                  <div>
                    <div>
                      Please share food items you are{" "}
                      <div className="underline inline">
                        interested in selling
                      </div>{" "}
                      to school nutrition programs.
                    </div>
                    <Divider />
                  </div>
                  <TextField
                    label="Food Items"
                    multiline
                    rows={3}
                    fullWidth
                    helperText="Please use a comma separated list"
                    onChange={(e) =>
                      setFoodItemsInterestedInSelling(e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <SelectOrganization
            addOrganization={addOrganization}
            setShowOrgForm={setShowOrgForm}
            setCompletedOrgs={setCompletedOrgs}
            completedOrgs={completedOrgs}
            showOrgForm={showOrgForm}
            organizationError={organizationError}
            setOrganizationError={setOrganizationError}
          />
          {!showOrgForm && (
            <>
              <div className="flex justify-center">
                <div className="w-full max-w-3xl flex flex-col gap-y-3">
                  <div>
                    <div>
                      What Communities of Practice(s) (CoP) are you interested
                      in participating in?
                    </div>
                    <Divider />
                  </div>
                  <SelectCOP
                    selectedTags={communities}
                    setSelectedTags={setCommunities}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-3xl flex flex-col gap-y-3">
                  <div>
                    <div>
                      What do you hope to gain from being a member of the
                      Arizona Farm to School Network?
                    </div>
                    <Divider />
                  </div>
                  <SelectMemberGains
                    selectedTags={memberGains}
                    setSelectedTags={setMemberGains}
                    setMemberGainsError={setMemberGainsError}
                    memberGainsError={memberGainsError}
                    setOtherGains={setOtherGains}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col gap-y-3 w-full max-w-3xl">
                  <div>
                    <div>
                      What did you gain from being a member of the Farm to
                      School Network this year?
                    </div>
                    <Divider />
                  </div>
                  <TextField
                    label="Please explain...*"
                    multiline
                    rows={6}
                    fullWidth
                    error={renewalGainsError}
                    helperText={renewalGainsError && "This field is required"}
                    onChange={(e) => setRenewalGains(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col w-full max-w-3xl gap-y-2">
                  <div>
                    <div>I am from</div>
                    <Divider />
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
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: "250px",
                              overflow: "auto",
                            },
                          },
                        }}
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
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: "250px",
                              overflow: "auto",
                            },
                          },
                        }}
                      >
                        {cities.map((city) => (
                          <MenuItem value={city}>{city}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex w-full max-w-3xl">
                    <TextField
                      label="Additional comments"
                      multiline
                      rows={6}
                      fullWidth
                      onChange={(e) => setAdditionalComments(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {!showOrgForm && (
        <div className="flex justify-center">
          <div className="flex max-w-3xl w-full">
            <Button
              color="primary"
              variant="contained"
              sx={{
                textTransform: "none",
                width: "fit-content",
                marginLeft: "auto",
              }}
              onClick={submitForm}
            >
              Submit Form
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenewMembership;
