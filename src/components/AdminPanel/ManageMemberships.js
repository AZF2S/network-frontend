import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Pagination,
} from "@mui/material";
import { accountApi } from "../../api";
import { useMemo } from "react";
import { Search } from "@mui/icons-material";
import MemberInfo from "./MemberInfo";
import "../.././config";

function ManageMemberships() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMethod ] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const members = await accountApi.getVerifiedMembers();
      setMembers(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    let filtered = members;

    filtered = filtered.filter(
      (member) =>
        member.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCurrentPage(1); // Reset to page 1 after sorting or searching
    setMembers(filtered);
  }, [searchTerm, sortMethod, members]);

  const handleRevoke = async (userId) => {
    try {
      setLoadingMembers(true);
      await accountApi.denyMembership(userId);
      fetchMembers(); // Refresh members list after revoking
    } catch (error) {
      console.error("Error revoking membership:", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return members.slice(start, start + itemsPerPage);
  }, [members, currentPage]);

  const numPages = Math.ceil(members.length / itemsPerPage);

  return (
    <div className="flex flex-col max-w-screen-md m-auto gap-y-5">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Search />
        <TextField
          label="Search Members"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginLeft: 1, flexGrow: 1 }}
        />
      </Box>
      {/* <div className="flex justify-left gap-x-5 mb-4 ml-8">
        <Button
          variant="contained"
          onClick={() => setSortMethod("alphabetical")}
          sx={{ textTransform: "none" }}
        >
          Sort Alphabetically
        </Button>
        <Button
          variant="contained"
          onClick={() => setSortMethod("membershipDate")}
          sx={{ textTransform: "none" }}
        >
          Sort by Membership Date
        </Button>
      </div> */}
      {loadingMembers ? (
        <div className="text-3xl font-[Kindest] text-light-green text-center">
          Loading...
        </div>
      ) : members.length > 0 ? (
        paginatedMembers.map((member) => (
          <div className="flex justify-center w-full">
            <Card sx={{ maxWidth: 800, width: "100%" }} key={member.uid}>
              <CardContent>
                <MemberInfo member={member} />
                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRevoke(member.uid)}
                    sx={{ textTransform: "none" }}
                  >
                    Revoke Membership
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <div className="text-3xl font-[Kindest] text-light-green text-center">
          No members
        </div>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={numPages}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
          sx={{ justifyContent: "center" }}
        />
      </Box>
    </div>
  );
}

export default ManageMemberships;
