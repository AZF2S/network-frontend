import React, { useEffect, useState } from "react";
import {
  Chip,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  styled,
} from "@mui/material";
import ".././config";
import { tagsApi } from '../api';

const CustomSelect = styled(Select)({
  "& .MuiInputLabel-root": {
    color: "#B55B2C",
    "&.Mui-focused": {
      color: "#B55B2C",
    },
  },
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: "2px",
      borderRadius: "8px",
    },
    "&:hover fieldset": {
      borderColor: "#B55B2C",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#B55B2C",
      color: "#B55B2C",
    },
  },
});

function TooltipMenuItem({ value, tooltipTitle, children, ...props }) {
  return (
    <Tooltip
      title={tooltipTitle}
      arrow
      placement="right"
      PopperProps={{
        popperOptions: {
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                altAxis: true,
                boundary: document.body,
              },
            },
          ],
        },
      }}
    >
      <MenuItem value={value} {...props}>
        {children}
      </MenuItem>
    </Tooltip>
  );
}

const CustomInputLabel = styled(InputLabel)({
  "&.Mui-focused": {
    color: "#B55B2C",
  },
});

export default function SelectMapTags({
  selectedTags,
  setSelectedTags,
  disabled,
}) {
  const [mapTags, setMapTags] = useState([]);

  useEffect(() => {
    const getMapTags = async () => {
      try {
        const { data: fetchedMapFilters } = await tagsApi.getLocationFilters();
        setMapTags(fetchedMapFilters.siteTags);
      } catch (error) {
        console.error('Error fetching map tags:', error);
      }
    };
    getMapTags();
  }, []);

  const handleMapTagsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <CustomInputLabel>Tags</CustomInputLabel>
      <CustomSelect
        multiple
        value={selectedTags}
        onChange={handleMapTagsChange}
        label="Tags"
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        disabled={disabled}
      >
        {mapTags?.map((tag) => (
          <TooltipMenuItem
            key={tag.tagName}
            value={tag.tagName}
            tooltipTitle={tag.description}
          >
            {tag.tagName}
          </TooltipMenuItem>
        ))}
      </CustomSelect>
    </FormControl>
  );
}
