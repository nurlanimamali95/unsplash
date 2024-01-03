import React from "react";
import { ImageListItem, Grid, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const ImageListComponent = ({ images, handleImageClick }) => {
  return (
    <AnimatePresence>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid key={image.id} item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                display: "inline-block",
                margin: "10px",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.1 }}
            >
              <ImageListItem
                component={Paper}
                sx={{
                  cursor: "pointer",
                  aspectRatio: "1",
                }}
                key={image.id}
                onClick={() => handleImageClick(image.urls.full)}
              >
                <img
                  src={image.urls.regular}
                  alt={image.alt_description}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </ImageListItem>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </AnimatePresence>
  );
};

export default ImageListComponent;
