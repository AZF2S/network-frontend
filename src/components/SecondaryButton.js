import { Button, styled } from "@mui/material";

export const SecondaryButton = styled(Button)({
  color: "#000",
  border: "1px solid #808080",
  "&:hover": {
    border: "1px solid #000",
    backgroundColor: "#f2f2f2",
  },
});
