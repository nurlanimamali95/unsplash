import React from "react";
import { ImageList, ImageListItem } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const ImageListComponent = ({ images, handleImageClick }) => {
  return (
    <AnimatePresence>
      <ImageList variant="woven" cols={3} gap={10}>
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ display: "inline-block", margin: "10px", cursor: "pointer" }}
            whileHover={{ scale: 1.1 }}
          >
            <ImageListItem
              key={image.id}
              onClick={() => handleImageClick(image.urls.full)}
            >
              <img
                src={image.urls.regular}
                alt={image.alt_description}
                
              />
            </ImageListItem>
          </motion.div>
        ))}
      </ImageList>
    </AnimatePresence>
  );
};

export default ImageListComponent;
