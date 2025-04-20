import React from "react";
import {
  Chip,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

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
