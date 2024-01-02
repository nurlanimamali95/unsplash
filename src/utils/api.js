// api.js

import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const apiKey = process.env.REACT_APP_UNSPLASH_API_KEY;
const IMAGES_PER_PAGE = 10;

const fetchImages = async (query, page, orderBy = "latest") => {
  try {
    const { data } = await axios.get(
      `${API_URL}?query=${query}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${apiKey}&order_by=${orderBy}`
    );
    const imagesWithColors = data.results.map((image) => ({
      ...image,
      color: image.color,
    }));
    return {
      images: imagesWithColors,
      totalPages: data.total_pages,
    };
  } catch (error) {
    throw new Error("Unable to load images. Please try again at a later time.");
  }
};

export { fetchImages };
