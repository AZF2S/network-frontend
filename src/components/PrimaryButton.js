import { Brightness1 } from "@mui/icons-material";
import { Button, styled } from "@mui/material";

const CustomButton = styled(Button)({
  color: "#FFF",
  fontSize: "16px",
  fontWeight: 600,
  textTransform: "none",
  width: "160px",
  borderRadius: "7px",
  boxShadow: "0 2px 2px rgba(0, 0, 0, 0.25)",
});

const CardButton = ({
  type,
  onClick,
  fontSize,
  minWidth,
  backgroundColor,
  text = "text",
}) => {
  const darkerBg = newShade(backgroundColor, -10);
  return (
    <CustomButton
      type={type}
      onClick={onClick}
      sx={{
        fontSize: fontSize,
        minWidth: minWidth,
        backgroundColor: backgroundColor,
        "&:hover": {
          backgroundColor: darkerBg,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.35)",
        },
      }}
    >
      {text}
    </CustomButton>
  );
};

const newShade = (hexColor, magnitude) => {
  // console.log(hexColor);
  hexColor = hexColor.replace(`#`, ``);
  if (hexColor.length === 6) {
    const decimalColor = parseInt(hexColor, 16);
    let r = (decimalColor >> 16) + magnitude;
    r > 255 && (r = 255);
    r < 0 && (r = 0);
    let g = (decimalColor & 0x0000ff) + magnitude;
    g > 255 && (g = 255);
    g < 0 && (g = 0);
    let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
    b > 255 && (b = 255);
    b < 0 && (b = 0);
    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  } else {
    return hexColor;
  }
};

export default CardButton;
