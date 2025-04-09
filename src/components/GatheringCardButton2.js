import { Button, styled } from "@mui/material";

const CustomButton = styled(Button)({
    backgroundColor: "#FFF",
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: 1.5,
    textTransform: "none",
    width: "160px",
    borderRadius: "7px",
    boxShadow: "0 2px 2px rgba(0, 0, 0, 0.25)",
    "&:hover": {
      backgroundColor: "#f2f2f2",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.35)",
    },
    marginBottom: "10px",
    marginLeft: "5px",
    marginRight: "5px"
});

const GatheringCardButton2 = ({type, onClick, color, text = "text"}) => {
    return(
        <CustomButton
            type={type}
            onClick={onClick}
            sx={{
                color: color,
            }}
        >
        {text}
        </CustomButton>
    );
}

export default GatheringCardButton2;