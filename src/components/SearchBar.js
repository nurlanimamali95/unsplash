import { useRef, useEffect, useState, useCallback } from "react";
import { Container, Typography, TextField, Box, Button } from "@mui/material";
import axios from "axios";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const API_URL = "https://api.unsplash.com/search/photos";
const apiKey = process.env.REACT_APP_UNSPLASH_API_KEY;
const IMAGES_PER_PAGE = 20;

const SearchBar = () => {
  const searchField = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchImages = useCallback(async () => {
    try {
      if (searchField.current.value) {
        setErrorMessage("");
        const { data } = await axios.get(
          `${API_URL}?query=${searchField.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${apiKey}`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrorMessage(
        "Unable to load images. Please try again at a later time."
      );
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
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
        {errorMessage && <Typography variant="p">{errorMessage}</Typography>}
        <TextField
          id="outlined-basic"
          label="Type something..."
          variant="outlined"
          inputRef={searchField}
          sx={{ width: "400px", my: 2 }}
        />
      </Box>
      <Box sx={{ width: "90%", height: 450, overflowY: "scroll" }}>
        <ImageList variant="masonry" cols={3} gap={8}>
          {images.map((image) => (
            <ImageListItem>
              <img
                src={image.urls.thumb}
                alt={image.alt_description}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <Box>
        {page > 1 && (
          <Button onClick={() => setPage(page - 1)}>Previous</Button>
        )}
      </Box>
      <Box>
        {page < totalPages && (
          <Button onClick={() => setPage(page + 1)}>Next</Button>
        )}
      </Box>
    </Container>
  );
};

export default SearchBar;
