export const handleImageClick = (imageUrl, setSelectedImage, setOpenModal) => {
  setSelectedImage(imageUrl);
  setOpenModal(true);
};

export const handleCloseModal = (setOpenModal, setSelectedImage) => {
  setOpenModal(false);
  setSelectedImage(null);
};
