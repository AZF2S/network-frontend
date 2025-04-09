const { styled, Badge } = require("@mui/material");

const MemberButtonBadge = styled(Badge)(({ theme, isHovered }) => ({
  "& .MuiBadge-badge": {
    top: 7,
    right: 16,
    fontWeight: 700,
  },
}));

export default MemberButtonBadge;
