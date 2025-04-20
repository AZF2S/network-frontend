import { Badge, Box, Tab, Tabs, Typography } from "@mui/material";
import PendingMembersList from "../components/AdminPanel/PendingMembersList";
import ManageMemberships from "../components/AdminPanel/ManageMemberships";
import PendingOrganizations from "../components/AdminPanel/PendingOrganizations";
import ManageOrganizations from "../components/AdminPanel/ManageOrganizations";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import '.././config';
import config from "../config";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [value, setValue] = useState(0);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [pendingOrgs, setPendingOrgs] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchPendingMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await api.get(
        `/pending-members`
      );
      setPendingMembers(response.data.members);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // console.error("No pending members found");
        setPendingMembers([]);
      } else {
        console.error("An unexpected error occurred: ", error);
      }
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchPendingOrgs = async () => {
    try {
      setLoadingOrgs(true);
      const response = await api.get(
        `/pending-organizations`
      );
      setPendingOrgs(response.data.orgs);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // console.error("No pending organizations found");
        setPendingOrgs([]);
      } else {
        console.error("An unexpected error occurred: ", error);
      }
    } finally {
      setLoadingOrgs(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    } else {
      fetchPendingMembers();
      fetchPendingOrgs();
    }
  }, [isAdmin, navigate]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab
            label={
              <Badge badgeContent={pendingMembers.length} color="primary">
                Pending Members
              </Badge>
            }
            sx={{ textTransform: "none" }}
          />
          <Tab label="Manage Memberships" sx={{ textTransform: "none" }} />
          <Tab
            label={
              <Badge badgeContent={pendingOrgs.length} color="primary">
                Pending Organizations
              </Badge>
            }
            sx={{ textTransform: "none" }}
          />
          <Tab label="Manage Organizations" sx={{ textTransform: "none" }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PendingMembersList
          pendingMembers={pendingMembers}
          fetchPendingMembers={fetchPendingMembers}
          loadingMembers={loadingMembers}
          setLoadingMembers={setLoadingMembers}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ManageMemberships />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PendingOrganizations
          pendingOrgs={pendingOrgs}
          fetchPendingOrgs={fetchPendingOrgs}
          loadingOrgs={loadingOrgs}
          setLoadingOrgs={setLoadingOrgs}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ManageOrganizations />
      </TabPanel>
    </Box>
  );
}
