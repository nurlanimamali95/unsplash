import { useRef, useEffect, useState, useCallback } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { fetchImages, handleFetchImages } from "../utils/api";
import ImageGrid from "./ImageGrid";
import Tags from "./Tags";
import { getRandomTags } from "../utils/getRandomTags";
import Checkbox from "./Checkbox";
import ImageModal from "./ImageModal";
import SearchField from "./SearchField";
import { handleImageClick, handleCloseModal } from "../handlers/imageHandlers";
import {
  handleNextPage,
  handlePreviousPage,
} from "../handlers/paginationHandlers";

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
    setRandomTags(getRandomTags(images));
  }, [images]);

  const fetchImagesCallback = useCallback(async () => {
    await handleFetchImages(
      searchField.current.value,
      page,
      orderByPopularity,
      searchField,
      setImages,
      setTotalPages,
      setErrorMessage
    );
  }, [page, orderByPopularity, searchField]);

  useEffect(() => {
    fetchImagesCallback();
  }, [fetchImagesCallback]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchImagesCallback();
  };

  const onNextPage = () => {
    handleNextPage(page, setPage);
  };

  const onPreviousPage = () => {
    handlePreviousPage(page, setPage);
  };

  const onImageClick = (imageUrl) => {
    handleImageClick(imageUrl, setSelectedImage, setOpenModal);
  };

  const onCloseModal = () => {
    handleCloseModal(setOpenModal, setSelectedImage);
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
        <Box>
          {errorMessage && <Typography variant="p">{errorMessage}</Typography>}
        </Box>
        <SearchField searchField={searchField} handleSearch={handleSearch} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {images.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Checkbox
              onChange={(checked) => setOrderByPopularity(checked)}
              checked={orderByPopularity}
            />
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
        <ImageGrid images={images} handleImageClick={onImageClick} />
      </Box>
      <ImageModal
        openModal={openModal}
        handleCloseModal={onCloseModal}
        selectedImage={selectedImage}
      />
      <Box>
        {page > 1 && <Button onClick={onPreviousPage}>Previous</Button>}
        {page < totalPages && <Button onClick={onNextPage}>Next</Button>}
      </Box>
    </Container>
  );
};

export default SearchBar;
