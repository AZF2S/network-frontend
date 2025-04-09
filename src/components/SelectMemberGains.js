import React, { useEffect, useState } from "react";
import {
  Chip,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Tooltip,
  styled,
  FormHelperText,
  TextField,
} from "@mui/material";

const CustomSelect = styled(Select)({
  "& .MuiInputLabel-root": {
    color: "#B55B2C",
    "&.Mui-focused": {
      color: "#B55B2C",
    },
  },
  "&.MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#B55B2C",
      color: "#B55B2C",
    },
  },
});

const CustomInputLabel = styled(InputLabel)({
  "&.Mui-focused": {
    color: "#B55B2C",
  },
});

export default function SelectMemberGains({
  selectedTags,
  setSelectedTags,
  memberGainsError,
  setMemberGainsError,
  setOtherGains,
}) {
  const memberGains = [
    "Model Program Examples",
    "Forum/Discussions",
    "Knowledge - School Gardens",
    "Knowledge - Food Education",
    "Knowledge - Local Food Procurement",
    "Knowledge - Farm to ECE",
    "Mentorship",
    "Leadership Experience",
    "Networking",
    "Policy Advocacy",
    "Professional Development/Training",
    "Technical Assistance",
    "Funding Opportunities",
    "Resources",
    "Research",
    "Program Promotion & Spotlights",
    "Event Notifications",
    "Newsletters",
    "Connect with School Food Buyers",
    "Connect with Local Producers",
    "Other",
  ];

  const handleMemberGainsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(typeof value === "string" ? value.split(",") : value);
    setMemberGainsError(value.length === 0);
  };

  return (
    <FormControl sx={{ width: "100%" }} size="small" error={memberGainsError}>
      <InputLabel>Select all that apply*</InputLabel>
      <div className="flex flex-col gap-y-3">
        <div>
          <Select
            multiple
            fullWidth
            error={memberGainsError}
            value={selectedTags}
            onChange={handleMemberGainsChange}
            label="Select all that apply*"
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {memberGains.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {memberGainsError && (
            <FormHelperText sx={{ color: "red" }}>
              This field is required
            </FormHelperText>
          )}
        </div>
        {selectedTags.includes("Other") && (
          <TextField
            label="Other*"
            multiline
            rows={4}
            fullWidth
            onChange={(e) => setOtherGains(e.target.value)}
          />
        )}
      </div>
    </FormControl>
  );
}
