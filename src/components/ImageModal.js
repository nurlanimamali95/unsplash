import React from "react";
import { Dialog, DialogContent } from "@mui/material";

const ImageModal = ({ openModal, handleCloseModal, selectedImage }) => {
  return (
    <Dialog open={openModal} onClose={handleCloseModal}>
      <DialogContent>
        {selectedImage && (
          <img src={selectedImage} alt="Full Size" style={{ width: "100%" }} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
