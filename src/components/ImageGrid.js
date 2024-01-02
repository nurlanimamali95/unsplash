import React from "react";
import { ImageList, ImageListItem } from "@mui/material";

const ImageListComponent = ({ images, handleImageClick }) => {
  return (
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
  );
};

export default ImageListComponent;
