import React, { useState, useEffect, useMemo } from "react";
import { organizationApi } from "../../api";
import {
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Pagination,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import OrganizationInfo from "./OrganizationInfo";
import EditOrganizationDialog from "../Dialogs/EditOrganizationDialog";
import "../.././config";

const ManageOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoadingOrgs(true);
      const response = await organizationApi.getVerifiedOrganizations();
      setOrganizations(response.data.orgs);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
    } finally {
      setLoadingOrgs(false);
    }
  };

  useEffect(() => {
    const filtered = organizations.filter((org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCurrentPage(1); // Reset to page 1 after searching
    setOrganizations(filtered);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedOrg) {
      console.log(selectedOrg);
      setOpen(true);
    }
  }, [selectedOrg]);

  const handleOpen = (org) => {
    setSelectedOrg(org);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrg(null);
  };

  const handleUpdate = async (updatedOrganization) => {
    try {
      setLoadingOrgs(true);
      const { _id, ...otherFields } = updatedOrganization;
      await organizationApi.editOrganization(_id, otherFields);
      fetchOrganizations();
    } catch (error) {
      console.error("Error updating organization:", error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleRemove = async (organizationId) => {
    try {
      setLoadingOrgs(true);
      await organizationApi.denyOrganization(organizationId);
      fetchOrganizations();
    } catch (error) {
      console.error("Error removing organization:", error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const paginatedOrganizations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return organizations.slice(start, start + itemsPerPage);
  }, [organizations, currentPage]);

  const numPages = Math.ceil(organizations.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-y-5">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Search />
        <TextField
          label="Search Organizations"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginLeft: 1, flexGrow: 1 }}
        />
      </Box>
      {loadingOrgs ? (
        <div className="text-3xl font-[Kindest] text-light-green text-center">
          Loading...
        </div>
      ) : organizations.length > 0 ? (
        paginatedOrganizations.map((org) => (
          <div className="flex justify-center w-full">
            <Card sx={{ maxWidth: 800, width: "100%" }} key={org._id}>
              <CardContent>
                <OrganizationInfo org={org} />
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                  <div className="flex gap-x-3">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemove(org._id)}
                      sx={{ textTransform: "none" }}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpen(org)}
                      sx={{ textTransform: "none" }}
                    >
                      Edit
                    </Button>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <div className="text-3xl font-[Kindest] text-light-green text-center">
          No organizations
        </div>
      )}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={numPages}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
        />
      </Box>
      <EditOrganizationDialog
        open={open}
        onClose={handleClose}
        organization={[selectedOrg]}
        onUpdate={handleUpdate}
        sx={{ justifyContent: "center" }}
      />
    </div>
  );
};

export default ManageOrganizations;
