import { Box, Button, Card, CardContent, Pagination } from "@mui/material";
import { useState } from "react";
import { accountApi } from "../../api";
import MemberInfo from "./MemberInfo";
import '../.././config';

export default function PendingMembersList({
  pendingMembers,
  fetchPendingMembers,
  loadingMembers,
  setLoadingMembers,
}) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handleAccept = async (uid) => {
    try {
      setLoadingMembers(true);
      await accountApi.acceptMembership(uid);
      fetchPendingMembers();
    } catch (error) {
      console.error("Error accepting membership:", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleDeny = async (uid) => {
    try {
      setLoadingMembers(true);
      await accountApi.denyMembership(uid);
      fetchPendingMembers();
    } catch (error) {
      console.error("Error denying membership:", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const membersOnPage = pendingMembers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="flex flex-col m-auto gap-y-5">
      {loadingMembers ? (
        <div className="text-3xl font-[Kindest] text-light-green text-center">
          Loading...
        </div>
      ) : pendingMembers.length > 0 ? (
        membersOnPage.map((member) => (
          <div className="flex justify-center w-full">
            <Card sx={{ maxWidth: 800, width: "100%" }} key={member.uid}>
              <CardContent>
                <MemberInfo member={member} />
                <Box display="flex" justifyContent="end" marginTop={2}>
                  <div className="flex gap-x-3">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeny(member.uid)}
                      sx={{ textTransform: "none" }}
                    >
                      Deny
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAccept(member.uid)}
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
          No pending members
        </div>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={Math.ceil(pendingMembers.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{ justifyContent: "center" }}
        />
      </Box>
    </div>
  );
}
