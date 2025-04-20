import "./ContactList.css";
import "../components/ContactCard.css";
import ContactCard from "./../components/ContactCard";
import { useEffect, useState } from "react";
import api from "../api";
import Masonry from "react-masonry-css";
import { useAuth } from "../contexts/AuthContext";
import SelectUserTags from "../components/SelectUserTags";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ListItemText,
  Checkbox,
  Box,
} from "@mui/material";
import { userGroups } from "../utils/constants";

function ContactList() {
  const [contactList, set_contactList] = useState([]);
  const [masterList, setMasterList] = useState([]);
  const [role, set_role] = useState([]);
  const [city, set_city] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [organizationSearchParam, setOrganizationSearchParam] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const { user } = useAuth();
  const [breakpointColumnsObj, setBreakpointColumnsObj] = useState({
    default: 6, // default number of columns
    1800: 5,
    1550: 4,
    1300: 3,
    1025: 2,
    500: 1,
  });
  const [groupColors, setGroupColors] = useState();

  useEffect(() => {
    window.scroll(0, 0);

    api.post("/contact-list-users", {}).then((response) => {
      set_contactList(JSON.parse(response.data.response));
      setMasterList(JSON.parse(response.data.response));
    });
  }, []);

  useEffect(() => {
    updateSearch();
  }, [role, organizationSearchParam, city, nameSearch, selectedTags]);

  useEffect(() => {
    const fetchGroupColors = async () => {
      try {
        const response = await api.get("/group-colors", {
          withCredentials: false,
        });

        setGroupColors(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroupColors();
  }, [user]);

  const updateSearch = () => {
    let localList = Array.from(masterList);
    let cardCount = 0;

    // Filter list
    for (let i = localList.length - 1; i >= 0; i--) {
      const myUser = localList[i];
      //console.log(myUser);

      // Role by dropdown
      let groupList = myUser.groups || [];

      if (role.length !== 0 && !role.every((r) => groupList.includes(r))) {
        delete localList[i];
        continue;
      }

      // Name by string
      if (
        nameSearch !== "" &&
        !myUser.fullname?.toLowerCase()?.includes(nameSearch.toLowerCase()) &&
        !myUser.username
          ?.toLowerCase()
          ?.includes(nameSearch.toLocaleLowerCase())
      ) {
        delete localList[i];
        continue;
      }

      // Location by string
      if (
        city !== "" &&
        !myUser.city?.toLowerCase()?.includes(city.toLowerCase()) &&
        !myUser.county?.toLowerCase()?.includes(city.toLowerCase())
      ) {
        delete localList[i];
        continue;
      }

      // Organization by string
      const myOrgs = myUser.organizations;
      var totalOrganizationString = "";
      var totalPositionString = "";

      for (let i = 0; i < myOrgs.length; i++) {
        totalOrganizationString += myOrgs[i].name;
        totalPositionString += myOrgs[i].role;
      }

      if (
        organizationSearchParam !== "" &&
        !totalOrganizationString
          .toLowerCase()
          .includes(organizationSearchParam.toLowerCase()) &&
        !totalPositionString
          .toLowerCase()
          .includes(organizationSearchParam.toLowerCase())
      ) {
        delete localList[i];
        continue;
      }

      // Tags filtering
      if (selectedTags.length > 0 && myUser.tags) {
        const hasSelectedTags = selectedTags.every((tag) =>
          myUser.tags.includes(tag)
        );
        if (!hasSelectedTags) {
          delete localList[i];
          continue;
        }
      }

      cardCount++;
    }

    // Fix card count of 0 for first load
    if (cardCount === 0) {
      cardCount = 420;
    }

    // Adjust masonry breakpoints - fix bug where numColumns > cardCount
    const newBreakpoints = {
      default: Math.min(cardCount, 4),
      1580: Math.min(cardCount, 4),
      1330: Math.min(cardCount, 3),
      1055: Math.min(cardCount, 2),
      500: Math.min(cardCount, 1),
    };

    set_contactList(localList);
    setBreakpointColumnsObj(newBreakpoints);
  };

  // TODO: Improve readability and reduce number of lines.
  return (
    <>
      <div className="contact-list-hero-img">
        <h1>Contact List</h1>
      </div>
      <div className="contact-list-body">
        <div className="contact-list-left">
          <label className="mb-2">Filter your search:</label>
          <Box marginBottom={2} display="flex" flexDirection="column">
            <TextField
              id="name-search"
              label="Name || Username"
              size="small"
              onChange={(e) => setNameSearch(e.target.value)}
              value={nameSearch}
            />
          </Box>

          <Box marginBottom={2} display="flex" flexDirection="column">
            <TextField
              id="location-search"
              label="City || County"
              size="small"
              onChange={(e) => set_city(e.target.value)}
              value={city}
            />
          </Box>

          <Box marginBottom={2} display="flex" flexDirection="column">
            <TextField
              id="org-search"
              label="Organization || Position"
              size="small"
              onChange={(e) => setOrganizationSearchParam(e.target.value)}
              value={organizationSearchParam}
            />
          </Box>

          <Box marginBottom={2} display="flex" flexDirection="column">
            <FormControl sx={{ width: "100%" }} size="small">
              <InputLabel>Group(s)</InputLabel>
              <Select
                id="role-select"
                labelId="role-label"
                multiple
                size="small"
                label="Group(s)"
                value={role}
                onChange={(e) => set_role(e.target.value)}
                renderValue={(selected) => {
                  if (selected.length <= 2) return selected.join(", ");
                  return `${selected.slice(0, 2).join(", ")} + ${
                    selected.length - 2
                  } more`;
                }}
              >
                {userGroups.map((userGroup) => (
                  <MenuItem key={userGroup} value={userGroup}>
                    <Checkbox checked={role.indexOf(userGroup) > -1} />
                    <ListItemText primary={userGroup} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box marginBottom={2} display="flex" flexDirection="column">
            <SelectUserTags
              id="tags-select"
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </Box>
        </div>

        <div className="contact-list-right">
          <Masonry
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            breakpointCols={breakpointColumnsObj}
          >
            {groupColors &&
              contactList.map((contact, index) => (
                <ContactCard
                  key={index}
                  user={contact}
                  groupColors={groupColors}
                />
              ))}
          </Masonry>
        </div>
      </div>
    </>
  );
}

export default ContactList;
