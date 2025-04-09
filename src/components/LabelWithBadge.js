import React, { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Badge from "@mui/material/Badge";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const LabelWithBadge = ({ label, checked, onChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.recentlyverified) {
      setIsHovered(true);
    }
  }, [user]);

  return (
    <div
      className="flex items-center w-fit"
      onMouseEnter={() => setIsHovered(true)}
    >
      <FormControlLabel
        control={<Checkbox />}
        label={label}
        checked={checked}
        onChange={onChange}
      />
      {!isHovered && (
        <Badge
          badgeContent={"!"}
          color="primary"
          sx={{ width: "fit-content", marginLeft: 1 }}
        />
      )}
    </div>
  );
};

export default LabelWithBadge;
