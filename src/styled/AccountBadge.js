const { styled, Badge } = require("@mui/material");

const AccountBadge = styled(Badge)(({ theme, isHovered }) => ({
  "& .MuiBadge-badge": {
    top: 10,
    right: 7,
  },
}));

export default AccountBadge;
