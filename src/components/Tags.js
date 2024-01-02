import React from "react";
import { Chip, Box } from "@mui/material";

const Tags = ({ tags, currentSearch, handleTagClick }) => {
  return (
    <Box display="flex" justifyContent="center" mt={2} flexWrap="wrap">
      {tags
        .filter((tag) => tag !== currentSearch)
        .map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onClick={() => handleTagClick(tag)}
            variant="outlined"
            sx={{ margin: "0 5px 5px 0" }}
            clickable
          />
        ))}
    </Box>
  );
};

export default Tags;
