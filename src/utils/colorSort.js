const sortImagesByColor = (images) => {
  const sortedImages = [...images];
  sortedImages.sort((a, b) => {
    const colorA = a.color.toLowerCase();
    const colorB = b.color.toLowerCase();
    if (colorA < colorB) return -1;
    if (colorA > colorB) return 1;
    return 0;
  });
  return sortedImages;
};

export default sortImagesByColor;
