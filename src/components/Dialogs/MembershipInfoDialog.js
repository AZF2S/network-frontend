import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router";
import { SecondaryButton } from "../SecondaryButton";

const MembershipInfoDialog = ({ open, onClose, user }) => {
  const navigate = useNavigate();
  const isEmailConfirmed = user ? user["email:confirmed"] : false;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle
        sx={{ fontFamily: "Kindest", fontSize: "2.25rem" }}
        className="text-light-green"
      >
        Becoming a Member
      </DialogTitle>
      <DialogContent sx={{ marginLeft: 3, marginRight: 3 }}>
        <div className="flex flex-col gap-y-5">
          <div>
            To become a member of the Arizona Farm to School Network you must
            fill out a membership form. This form helps us verify that you are a
            valid member of the program. This will establish your connection to
            the Arizona Farm to School Network for the next year.
            <div className="font-semibold">Annual completion is required.</div>
          </div>
          <div>
            Forms will be sent to a site administrator where your information
            will be looked over and verified before you are added to the
            network.
          </div>
          <div className="flex flex-col gap-y-2">
            <div>
              Verified members will gain access to more features of the site
              including:
            </div>
            <div>{"• Promotion of your organization on the network map."}</div>
            <div>{"• Promotion of yourself on the contact list."}</div>
            <div>
              {"• Ongoing network member support and community recognition"}
            </div>
          </div>
          <div>
          This form will collect information that will help our network increase 
          access to farm to school programming across the state. We will use this 
          information to inform decisions and design supportive programming and 
          resources for network members. This information will also keep our network 
          map and contact list up-to-date to make it easier for network members to 
          see where “the work” is happening and connect with each other. Our goal is 
          to grow and strengthen farm to school programs across Arizona by increasing 
          access to information and encouraging knowledge sharing, mentorship, and 
          collaboration.
          </div>
        </div>
      </DialogContent>
      <Divider fullWidth />
      <DialogActions className="mr-4 my-2">
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-2">
            <SecondaryButton
              onClick={onClose}
              variant="outlined"
              sx={{
                color: "#000",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Cancel
            </SecondaryButton>
            <Button
              onClick={() => {
                navigate("/membership-form");
                onClose();
              }}
              variant="contained"
              sx={{
                fontWeight: 600,
                textTransform: "none",
              }}
              disabled={!isEmailConfirmed} 
            >
              Go to form
            </Button>
          </div>
          {!isEmailConfirmed && (
            <div className="flex justify-end mr-4">
              <FormHelperText>You must verify your email first.</FormHelperText>
            </div>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default MembershipInfoDialog;
