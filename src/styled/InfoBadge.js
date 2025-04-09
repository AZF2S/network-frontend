const { styled, Badge } = require("@mui/material");

const StyledBadge = styled(Badge)(({ theme, isHovered }) => ({
  "& .MuiBadge-badge": {
    top: 20,
    right: -15,
    fontWeight: 700,
    display: isHovered ? "none" : "flex",
  },
}));

const InfoBadge = ({ children, isHovered }) => {
  return (
    <StyledBadge badgeContent="!" color="primary" isHovered={isHovered}>
      {children}
    </StyledBadge>
  );
};

export default InfoBadge;
