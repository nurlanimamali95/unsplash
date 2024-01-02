import { useRef, useEffect, useState, useCallback } from "react";
import { Container, Typography, Box } from "@mui/material";
import { fetchImages } from "../utils/api";
import ImageGrid from "./ImageGrid";
import Tags from "./Tags";
import { getRandomTags } from "../utils/getRandomTags";
import Checkbox from "./Checkbox";
import ImageModal from "./ImageModal";
import SearchField from "./SearchField";
import { handleImageClick, handleCloseModal } from "../handlers/imageHandlers";
import InfiniteScroll from "react-infinite-scroll-component";

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
    try {
      const { images: newImages, totalPages: newTotalPages } =
        await fetchImages(searchField.current.value, page, orderByPopularity);

      setImages((prevImages) => [...prevImages, ...newImages]);
      setTotalPages(newTotalPages);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [page, orderByPopularity]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchImagesCallback();
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
      <ImageModal
        openModal={openModal}
        handleCloseModal={onCloseModal}
        selectedImage={selectedImage}
      />
    </Container>
  );
};

export default SearchBar;
