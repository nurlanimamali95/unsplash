export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomTags = (images) => {
  const allTags = images.flatMap((image) => image.tags.map((tag) => tag.title));

  const uniqueTags = Array.from(new Set(allTags));

  const shuffledTags = shuffleArray(uniqueTags);

  return shuffledTags.slice(0, Math.min(10, shuffledTags.length));
};
