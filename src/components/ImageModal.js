import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, CircularProgress } from "@mui/material";

const ImageModal = ({ openModal, handleCloseModal, selectedImage, handleImageLoad, loading }) => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    setLoading(!!selectedImage);
  }, [selectedImage]);

  const handleLoad = () => {
    setLoading(false);
    if (handleImageLoad) {
      handleImageLoad();
    }
  };

  return (
    <Dialog maxWidth="lg" open={openModal} onClose={handleCloseModal}>
      <DialogContent>
        {isLoading && <CircularProgress />}
        <img
          src={selectedImage}
          alt="Full Size"
          style={{ width: "100%", display: isLoading ? "none" : "block" }}
          onLoad={handleLoad}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
