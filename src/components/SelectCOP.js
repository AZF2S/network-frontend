import React, { useEffect, useState } from "react";
import {
  Chip,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  styled,
} from "@mui/material";
import '.././config';
import { copApi } from '../api';

styled(Select)({
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
styled(InputLabel)({
  "&.Mui-focused": {
    color: "#B55B2C",
  },
});

export default function SelectCOP({ selectedTags, setSelectedTags }) {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data: fetchedCommunities } = await copApi.getCommunities();
        setCommunities(fetchedCommunities);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  const handleCOPChange = (event) => {
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
        onChange={handleCOPChange}
        label="Select all that apply"
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {communities.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
