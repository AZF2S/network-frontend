import React, { useState } from "react";
import { organizationApi } from "../../api";
import {
  Card,
  CardContent,
  Box,
  Button,
  Pagination,
} from "@mui/material";
import OrganizationInfo from "./OrganizationInfo";

const PendingOrganizations = ({
  pendingOrgs,
  fetchPendingOrgs,
  loadingOrgs,
  setLoadingOrgs,
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handleAccept = async (organizationId) => {
    try {
      setLoadingOrgs(true);
      await organizationApi.acceptOrganization(organizationId);
      await fetchPendingOrgs();
    } catch (error) {
      console.error("Error accepting organization:", error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleDeny = async (organizationId) => {
    try {
      setLoadingOrgs(true);
      await organizationApi.denyOrganization(organizationId);
      await fetchPendingOrgs();
    } catch (error) {
      console.error("Error denying organization:", error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const organizationsOnPage = pendingOrgs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="flex flex-col m-auto gap-y-5">
      {loadingOrgs ? (
        <div className="text-3xl font-[Kindest] text-light-green text-center">
          Loading...
        </div>
      ) : pendingOrgs.length > 0 ? (
        organizationsOnPage?.map((org) => (
          <div className="flex justify-center w-full">
            <Card sx={{ maxWidth: 800, width: "100%" }} key={org._id}>
              <CardContent>
                <OrganizationInfo org={org} />
                <Box display="flex" justifyContent="end" marginTop={2}>
                  <div className="flex gap-x-3">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeny(org._id)}
                      sx={{ textTransform: "none" }}
                    >
                      Deny
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAccept(org._id)}
                      sx={{ textTransform: "none" }}
                    >
                      Accept
                    </Button>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <div className="text-3xl font-[Kindest] text-light-green text-center">
          No pending organizations
        </div>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={Math.ceil(pendingOrgs.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{ justifyContent: "center" }}
        />
      </Box>
    </div>
  );
};

export default PendingOrganizations;
