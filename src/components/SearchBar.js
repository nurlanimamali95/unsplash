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
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { fetchImages } from "./api";
import ImageGrid from "./ImageGrid";
import Tags from "./Tags";

const SearchBar = () => {
  const searchField = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderByPopularity, setOrderByPopularity] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [randomTags, setRandomTags] = useState([]);

  useEffect(() => {
    const allTags = images.flatMap((image) =>
      image.tags.map((tag) => tag.title)
    );

    const uniqueTags = Array.from(new Set(allTags));

    const shuffledTags = shuffleArray(uniqueTags);

    const selectedTags = shuffledTags.slice(
      0,
      Math.min(10, shuffledTags.length)
    );

    setRandomTags(selectedTags);
  }, [images]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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

  

  const handleTagClick = async (tag) => {
    try {
      const { images, totalPages } = await fetchImages(tag, 1, "latest");
      setImages(images);
      setTotalPages(totalPages);
      searchField.current.value = tag;
    } catch (error) {
      setErrorMessage(error.message);
    }
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
      <Box mt={4}>
        <Tags
          tags={randomTags}
          currentSearch={searchField.current ? searchField.current.value : ""}
          handleTagClick={handleTagClick}
          searchField={searchField}
        />
      </Box>
      <Box sx={{ width: "90%" }}>
        <ImageGrid images={images} handleImageClick={handleImageClick} />
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
