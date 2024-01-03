import { useRef, useEffect, useState, useCallback } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { fetchImages } from "../utils/api";
import ImageGrid from "./ImageGrid";
import Tags from "./Tags";
import { getRandomTags } from "../utils/getRandomTags";
import ImageModal from "./ImageModal";
import SearchField from "./SearchField";
import { handleImageClick, handleCloseModal } from "../utils/imageHandlers";
import InfiniteScroll from "react-infinite-scroll-component";
import sortImagesByColor from "../utils/colorSort";

const SearchBar = () => {
  const searchField = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [randomTags, setRandomTags] = useState([]);

  useEffect(() => {
    setRandomTags(getRandomTags(images));
  }, [images]);

  const fetchImagesCallback = useCallback(async () => {
    try {
      const { images: newImages, totalPages: newTotalPages } =
        await fetchImages(searchField.current.value, page);
      if (page === 1) {
        setImages(newImages);
      } else {
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
      setTotalPages(newTotalPages);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [page]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    const searchTerm = searchField.current.value;
    if (searchTerm.trim() === "") {
      setImages([]);
    } else {
      fetchImagesCallback();
    }
  };

  useEffect(() => {
    fetchImagesCallback();
  }, [fetchImagesCallback]);

  const loadMoreImages = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onImageClick = (imageUrl) => {
    handleImageClick(imageUrl, setSelectedImage, setOpenModal);
  };

  const onCloseModal = () => {
    handleCloseModal(setOpenModal, setSelectedImage);
  };

  const handleSortByColor = () => {
    const sortedImages = sortImagesByColor(images);
    setImages(sortedImages);
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
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: "3em", marginTop: "1em" }}
        >
          Discover Visuals
        </Typography>
        <Box>
          {errorMessage && <Typography variant="p">{errorMessage}</Typography>}
        </Box>
        <SearchField searchField={searchField} handleSearch={handleSearch} />
      </Box>
      {images.length > 0 && (
        <Box>
          <Button onClick={handleSortByColor}>Sort by Color</Button>
        </Box>
      )}
      <Box mt={4}>
        <Tags
          tags={randomTags}
          currentSearch={searchField.current ? searchField.current.value : ""}
          handleTagClick={handleTagClick}
          searchField={searchField}
        />
      </Box>
      {images.length > 0 && (
        <InfiniteScroll
          dataLength={images.length}
          next={loadMoreImages}
          hasMore={page < totalPages}
          loader={<h4>Loading...</h4>}
        >
          <Box sx={{ width: "90%" }}>
            <ImageGrid
              images={images}
              handleImageClick={onImageClick}
              keyExtractor={(image) => image.id}
            />
          </Box>
        </InfiniteScroll>
      )}
      <ImageModal
        openModal={openModal}
        handleCloseModal={onCloseModal}
        selectedImage={selectedImage}
      />
    </Container>
  );
};

export default SearchBar;
