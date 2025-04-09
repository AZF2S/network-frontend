import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router";
import { SecondaryButton } from "../SecondaryButton";
import Confetti from "react-confetti";
import { useEffect } from "react";
import { useState } from "react";
import ReactDOM from "react-dom";

const MembershipAcceptanceDialog = ({ open, onClose }) => {
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    setDomReady(true);
    const portalDiv = document.getElementById("portal");
    portalDiv.style.position = "absolute";
    portalDiv.style.zIndex = 1301;
    portalDiv.style.top = 500;
    portalDiv.style.left = 0;
    portalDiv.style.right = 0;
    portalDiv.style.bottom = 0;
    portalDiv.style.pointerEvents = "none"; // Add this line
  }, []);

  return (
    <>
      {open &&
        domReady &&
        ReactDOM.createPortal(
          <Confetti
            gravity={0.02}
            numberOfPieces={800}
            colors={[
              "#8ECF53",
              "#2D5F40",
              "#F1E6BF",
              "#B4558D",
              "#82B197",
              "#8C8FB2",
              "#D39447",
              "#D9D47A",
              "#E56F3C",
            ]}
            initialVelocityY={20}
            tweenDuration={1000}
            recycle={true}
          />,
          document.getElementById("portal")
        )}
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <DialogTitle
          sx={{ fontFamily: "Kindest", fontSize: "2.25rem" }}
          className="text-light-green"
        >
          Congratulations!
        </DialogTitle>
        <DialogContent sx={{ marginLeft: 3, marginRight: 3 }}>
          <div className="flex flex-col gap-y-3">
            <div>You are now an Arizona Farm to School Network Member!</div>
            <div>
              Thank you for your contribution! Please enjoy your subscription to
              the site!
            </div>
          </div>
        </DialogContent>
        <Divider fullWidth />
        <DialogActions className="mr-4 my-2">
          <Button
            onClick={() => {
              onClose();
            }}
            variant="contained"
            sx={{
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MembershipAcceptanceDialog;
