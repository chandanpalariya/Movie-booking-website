import express from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {createMovie, deleteMovie, getMovieById,getMovies, updateMovie} from "../controlers/moviesController.js"

const movieRouter = express.Router();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "movie-booking",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"],
  },
});

const upload = multer({ storage }).fields([
  { name: "poster", maxCount: 1 },
  { name: "trailerUrl", maxCount: 1 },
  { name: "videoUrl", maxCount: 1 },
  { name: "ltThumbnail", maxCount: 1 },
  { name: "castFiles", maxCount: 20 },
  { name: "directorFiles", maxCount: 20 },
  { name: "producerFiles", maxCount: 20 },
  { name: "ltDirectorFiles", maxCount: 20 },
  { name: "ltProducerFiles", maxCount: 20 },
  { name: "ltSingerFiles", maxCount: 20 },
])

movieRouter.post('/', upload, createMovie)
movieRouter.get('/', getMovies)
movieRouter.get('/:id', getMovieById)
movieRouter.put('/:id', upload, updateMovie)
movieRouter.delete('/:id', deleteMovie)

export default movieRouter;
