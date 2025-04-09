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

export default function SelectNutritionPrograms({
  selectedTags,
  setSelectedTags,
}) {
  const nutritionPrograms = [
    "National School Lunch Program (NSLP)",
    "School Breakfast Program (SBP)",
    "Child and Adult Care Food Program (CACFP)",
    "Summer Food Service Program (SFSP)",
    "Fresh Fruit and Vegetable Program (FFVP)",
    "Special Milk Program (SMP)",
    "USDA Foods Programs",
  ];

  const handleNutritionProgramsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <InputLabel>Select all that apply</InputLabel>
      <Select
        multiple
        value={selectedTags}
        onChange={handleNutritionProgramsChange}
        label="Select all that apply"
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {nutritionPrograms.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
