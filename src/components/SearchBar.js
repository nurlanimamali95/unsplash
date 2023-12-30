import { useRef, useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { fetchImages } from "./api";

const SearchBar = () => {
  const searchField = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderByPopularity, setOrderByPopularity] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFetchImages = useCallback(async () => {
    try {
      if (searchField.current.value) {
        setErrorMessage("");
        const { images, totalPages } = await fetchImages(
          searchField.current.value,
          page,
          orderByPopularity ? "popular" : "latest"
        );
        setImages(images);
        setTotalPages(totalPages);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [page, orderByPopularity]);

  useEffect(() => {
    handleFetchImages();
  }, [page, orderByPopularity, handleFetchImages]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    handleFetchImages();
  };

  const handleCheckboxChange = (event) => {
    setOrderByPopularity(event.target.checked);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
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
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {images.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <label>
              <input
                type="checkbox"
                onChange={handleCheckboxChange}
                checked={orderByPopularity}
              />
              Popular
            </label>
          </Box>
        )}
      </Box>
      <Box sx={{ width: "90%" }}>
        <ImageList variant="masonry" cols={3} gap={8}>
          {images.map((image) => (
            <ImageListItem
              key={image.id}
              onClick={() => handleImageClick(image.urls.full)}
            >
              <img
                src={image.urls.small}
                alt={image.alt_description}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full Size"
              style={{ width: "100%" }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Box>
        {page > 1 && <Button onClick={handlePreviousPage}>Previous</Button>}
        {page < totalPages && <Button onClick={handleNextPage}>Next</Button>}
      </Box>
    </Container>
  );
};

export default SearchBar;
