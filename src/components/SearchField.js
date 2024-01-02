import React from "react";
import { TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchField = ({ searchField, handleSearch }) => {
  return (
    <TextField
      id="outlined-basic"
      label="Type something..."
      variant="outlined"
      inputRef={searchField}
      sx={{ width: "400px", my: 2 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchField;
