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
import '.././config';
import { tagsApi } from '../api';

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

export default function SelectUserTags({ selectedTags, setSelectedTags }) {
  const [userTags, setUserTags] = useState([]);

  useEffect(() => {
    const getUserTags = async () => {
      try {
        const { data: fetchedMapFilters } = await tagsApi.getLocationFilters();
        setUserTags(fetchedMapFilters.userTags);
      } catch (error) {
        console.error('Error fetching user tags:', error);
      }
    };
    getUserTags();
  }, []);

  const handleUserTagsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <InputLabel>Tags</InputLabel>
      <Select
        multiple
        value={selectedTags}
        onChange={handleUserTagsChange}
        label="Tags"
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {userTags?.map((tag) => (
          <TooltipMenuItem
            key={tag.tagName}
            value={tag.tagName}
            tooltipTitle={tag.description}
          >
            {tag.tagName}
          </TooltipMenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
