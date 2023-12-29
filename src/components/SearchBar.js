import { useRef, useEffect } from "react";
import { Container, Typography, TextField, Box, Button } from "@mui/material";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const apiKey = process.env.REACT_APP_UNSPLASH_API_KEY;
const IMAGES_PER_PAGE = 20;

const SearchBar = () => {
  console.log("api key", apiKey);

  const fetchImages = async () => {
    try {
      const result = await axios.get(
        `${API_URL}?query=${searchField.current.value}&page=1&per_page=${IMAGES_PER_PAGE}&client_id=${apiKey}`
      );
      console.log("result", result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(searchField.current.value);
    fetchImages();
  };
  const searchField = useRef(null);

  const handleSelection = (selection) => {
    searchField.current.value = selection;
    fetchImages();
  };

  return (
    <Container
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box textAlign="center" my="auto">
        <Typography variant="h1" component="h1" sx={{ fontSize: "3em" }}>
          Explore Images
        </Typography>
        <TextField
          id="outlined-basic"
          label="Type something..."
          variant="outlined"
          inputRef={searchField}
          sx={{ width: "400px", my: 2 }}
        />
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            sx={{ mx: 1 }}
            onClick={() => handleSelection("nature")}
          >
            nature
          </Button>
          <Button
            variant="contained"
            sx={{ mx: 1 }}
            onClick={() => handleSelection("cats")}
          >
            cats
          </Button>
          <Button
            variant="contained"
            sx={{ mx: 1 }}
            onClick={() => handleSelection("winter")}
          >
            winter
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SearchBar;
