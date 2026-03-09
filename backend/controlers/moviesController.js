import mongoose from "mongoose";
import Movie from "../models/movieModal.js";
import path from "path";
import fs from "fs";

const API_BASE = "http://localhost:5000";

/* ---------------------- small helpers ---------------------- */

const getUploadUrl = (val) => {
  if (!val) return null;
  if (typeof val === "string" && /^(https?:\/\/)/.test(val)) return val;
  const cleaned = String(val).replace(/^uploads\//, "");
  if (!cleaned) return null;
  return `${API_BASE}/uploads/${cleaned}`;
};

const extractFilenameFromUrl = (u) => {
  if (!u || typeof u !== "string") return null;
  const parts = u.split("/uploads/");
  if (parts[1]) return parts[1];
  if (u.startsWith("uploads/")) return u.replace(/^uploads\//, "");
  return /^[^\/]+\.[a-zA-Z0-9]+$/.test(u) ? u : null;
};

const tryUnlinkUploadUrl = (urlOrFilename) => {
  const fn = extractFilenameFromUrl(urlOrFilename);
  if (!fn) return;
  const filepath = path.join(process.cwd(), "uploads", fn);
  fs.unlink(filepath, (err) => {
    if (err) console.warn("Failed to unlink file", filepath, err?.message);
  });
};

const safeParseJSON = (v) => {
  if (!v) return null;
  if (typeof v === "object") return v;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
};

const normalizeLatestPersonFilename = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    const fn = extractFilenameFromUrl(value);
    return fn || value;
  }

  if (typeof value === "object") {
    const candidate =
      value.filename ||
      value.path ||
      value.url ||
      value.file ||
      value.image ||
      value.preview ||
      null;

    return candidate ? normalizeLatestPersonFilename(candidate) : null;
  }

  return null;
};

const personToPreview = (p) => {
  if (!p) return { name: "", role: "", preview: null };

  const candidate = p.preview || p.file || p.image || p.url || null;

  return {
    name: p.name || "",
    role: p.role || "",
    preview: candidate ? getUploadUrl(candidate) : null,
  };
};

/* ---------------------- transformers ---------------------- */

const buildLatestTrailerPeople = (arr = []) =>
  (arr || []).map((p) => ({
    name: (p && p.name) || "",
    role: (p && p.role) || "",
    file: normalizeLatestPersonFilename(
      p && (p.file || p.preview || p.url || p.image)
    ),
  }));

const enrichLatestTrailerForOutput = (lt = {}) => {
  const copy = { ...lt };

  copy.thumbnail = copy.thumbnail ? getUploadUrl(copy.thumbnail) : null;

  const mapPerson = (p) => {
    const c = { ...(p || {}) };

    c.preview = c.file
      ? getUploadUrl(c.file)
      : c.preview
      ? getUploadUrl(c.preview)
      : null;

    return c;
  };

  copy.directors = (copy.directors || []).map(mapPerson);
  copy.producers = (copy.producers || []).map(mapPerson);
  copy.singers = (copy.singers || []).map(mapPerson);

  return copy;
};

const normalizeItemForOutput = (it = {}) => {
  const obj = { ...it };

  obj.thumbnail = it.latestTrailer?.thumbnail
    ? getUploadUrl(it.latestTrailer.thumbnail)
    : it.poster
    ? getUploadUrl(it.poster)
    : null;

  obj.trailerUrl =
    it.trailerUrl || it.latestTrailer?.url || it.latestTrailer?.videoId || null;

  obj.cast = (it.cast || []).map(personToPreview);
  obj.directors = (it.directors || []).map(personToPreview);
  obj.producers = (it.producers || []).map(personToPreview);

  if (it.latestTrailer)
    obj.latestTrailer = enrichLatestTrailerForOutput(it.latestTrailer);

  obj.auditorium = it.auditorium || null;

  return obj;
};

/* ---------------------- CREATE MOVIE ---------------------- */

export async function createMovie(req, res) {
  try {
    const body = req.body || {};

    const posterUrl = req.files?.poster?.[0]?.filename
      ? getUploadUrl(req.files.poster[0].filename)
      : body.poster || null;

    const categories =
      safeParseJSON(body.categories) ||
      (body.categories
        ? String(body.categories)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []);

    const cast = safeParseJSON(body.cast) || [];
    const directors = safeParseJSON(body.directors) || [];
    const producers = safeParseJSON(body.producers) || [];
    
    // Parse latestTrailer if provided
    let latestTrailer = null;
    if (body.latestTrailer) {
      const lt = safeParseJSON(body.latestTrailer);
      if (lt) {
        // Get thumbnail URL if file was uploaded
        let thumbnailUrl = null;
        if (req.files?.ltThumbnail?.[0]?.filename) {
          thumbnailUrl = getUploadUrl(req.files.ltThumbnail[0].filename);
        } else if (lt.thumbnail) {
          // Use existing thumbnail if provided
          thumbnailUrl = lt.thumbnail;
        }
        
        latestTrailer = {
          title: lt.title || "",
          genres: lt.genres || [],
          duration: lt.duration || { hours: 0, minutes: 0 },
          year: lt.year || new Date().getFullYear(),
          description: lt.description || "",
          thumbnail: thumbnailUrl,
          videoId: lt.videoId || "",
          directors: (lt.directors || []).map(d => ({
            name: d.name || "",
            role: d.role || "",
            file: d.file || null
          })),
          producers: (lt.producers || []).map(p => ({
            name: p.name || "",
            role: p.role || "",
            file: p.file || null
          })),
          singers: (lt.singers || []).map(s => ({
            name: s.name || "",
            role: s.role || "",
            file: s.file || null
          }))
        };
      }
    }

    const doc = new Movie({
      _id: new mongoose.Types.ObjectId(),
      type: body.type || "normal",
      movieName: body.movieName || "",
      categories,
      poster: posterUrl,
      rating: Number(body.rating) || 0,
      duration: Number(body.duration) || 0,
      cast,
      directors,
      producers,
      story: body.story || "",
      auditorium: body.auditorium || "Audi 1",
      latestTrailer,
      slots: safeParseJSON(body.slots) || [],
      seatPrices: safeParseJSON(body.seatPrices) || { standard: 0, recliner: 0 },
      trailerUrl: body.trailerUrl || "",
      videoUrl: body.videoUrl || ""
    });

    const saved = await doc.save();

    return res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: saved,
    });
  } catch (err) {
    console.error("createMovie error:", err);

    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
}

/* ---------------------- GET MOVIES ---------------------- */

export async function getMovies(req, res) {
  try {
    const {
      category,
      type,
      search,
      latestTrailers,
      page = 1,
      limit = 12,
    } = req.query;

    let filter = {};

    if (category && category.trim()) {
      filter.categories = { $in: [category.trim()] };
    }

    if (type && type.trim()) {
      filter.type = type.trim();
    }

    if (search && search.trim()) {
      const q = search.trim();

      filter.$or = [
        { movieName: { $regex: q, $options: "i" } },
        { "latestTrailer.title": { $regex: q, $options: "i" } },
        { story: { $regex: q, $options: "i" } },
      ];
    }

    if (latestTrailers && String(latestTrailers).toLowerCase() !== "false") {
      filter =
        Object.keys(filter).length === 0
          ? { type: "latestTrailers" }
          : { $and: [filter, { type: "latestTrailers" }] };
    }

    const pg = Math.max(1, parseInt(page));
    const lim = Math.min(200, parseInt(limit));
    const skip = (pg - 1) * lim;

    const total = await Movie.countDocuments(filter);

    const items = await Movie.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim)
      .lean();

    const normalized = (items || []).map(normalizeItemForOutput);

    const totalPages = Math.ceil(total / lim);

    return res.json({
      success: true,
      total,
      page: pg,
      limit: lim,
      totalPages,
      items: normalized,
    });
  } catch (err) {
    console.error("GetMovies error:", err);

    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
}

/* ---------------------- GET MOVIE BY ID ---------------------- */

export async function getMovieById(req, res) {
  try {
    const { id } = req.params;

    const item = await Movie.findById(id).lean();

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const obj = normalizeItemForOutput(item);

    return res.json({
      success: true,
      item: obj,
    });
  } catch (err) {
    console.error("GetMovieById Error:", err);

    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
}

/* ---------------------- DELETE MOVIE ---------------------- */

export async function deleteMovie(req, res) {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "movie not found",
      });
    }

    if (movie.poster) tryUnlinkUploadUrl(movie.poster);

    if (movie.latestTrailer?.thumbnail)
      tryUnlinkUploadUrl(movie.latestTrailer.thumbnail);

    await Movie.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (err) {
    console.error("DeleteMovie Error:", err);

    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
}

/* ---------------------- UPDATE MOVIE ---------------------- */

export async function updateMovie(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Update basic fields
    if (body.type) movie.type = body.type;
    if (body.movieName) movie.movieName = body.movieName;
    if (body.story !== undefined) movie.story = body.story;
    if (body.auditorium) movie.auditorium = body.auditorium;
    if (body.rating !== undefined) movie.rating = Number(body.rating) || 0;
    if (body.duration !== undefined) movie.duration = Number(body.duration) || 0;
    if (body.trailerUrl !== undefined) movie.trailerUrl = body.trailerUrl;
    if (body.videoUrl !== undefined) movie.videoUrl = body.videoUrl;

    // Update categories
    if (body.categories) {
      movie.categories = safeParseJSON(body.categories) || 
        (String(body.categories).split(",").map(s => s.trim()).filter(Boolean));
    }

    // Update poster if new file uploaded
    if (req.files?.poster?.[0]?.filename) {
      // Delete old poster
      if (movie.poster) tryUnlinkUploadUrl(movie.poster);
      movie.poster = getUploadUrl(req.files.poster[0].filename);
    } else if (body.poster !== undefined) {
      movie.poster = body.poster || null;
    }

    // Update cast, directors, producers
    if (body.cast) movie.cast = safeParseJSON(body.cast) || [];
    if (body.directors) movie.directors = safeParseJSON(body.directors) || [];
    if (body.producers) movie.producers = safeParseJSON(body.producers) || [];

    // Update slots and seat prices
    if (body.slots) movie.slots = safeParseJSON(body.slots) || [];
    if (body.seatPrices) movie.seatPrices = safeParseJSON(body.seatPrices) || { standard: 0, recliner: 0 };

    // Update latestTrailer if provided
    if (body.latestTrailer) {
      const lt = safeParseJSON(body.latestTrailer);
      if (lt) {
        // Get thumbnail URL if new file was uploaded
        let thumbnailUrl = movie.latestTrailer?.thumbnail || null;
        if (req.files?.ltThumbnail?.[0]?.filename) {
          // Delete old thumbnail
          if (movie.latestTrailer?.thumbnail) tryUnlinkUploadUrl(movie.latestTrailer.thumbnail);
          thumbnailUrl = getUploadUrl(req.files.ltThumbnail[0].filename);
        } else if (lt.thumbnail) {
          thumbnailUrl = lt.thumbnail;
        }

        movie.latestTrailer = {
          title: lt.title || movie.latestTrailer?.title || "",
          genres: lt.genres || movie.latestTrailer?.genres || [],
          duration: lt.duration || movie.latestTrailer?.duration || { hours: 0, minutes: 0 },
          year: lt.year || movie.latestTrailer?.year || new Date().getFullYear(),
          description: lt.description || movie.latestTrailer?.description || "",
          thumbnail: thumbnailUrl,
          videoId: lt.videoId || movie.latestTrailer?.videoId || "",
          directors: (lt.directors || []).map(d => ({
            name: d.name || "",
            role: d.role || "",
            file: d.file || null
          })),
          producers: (lt.producers || []).map(p => ({
            name: p.name || "",
            role: p.role || "",
            file: p.file || null
          })),
          singers: (lt.singers || []).map(s => ({
            name: s.name || "",
            role: s.role || "",
            file: s.file || null
          }))
        };
      }
    }

    const saved = await movie.save();

    return res.json({
      success: true,
      message: "Movie updated successfully",
      data: saved,
    });
  } catch (err) {
    console.error("updateMovie error:", err);

    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
}

export default {
  createMovie,
  getMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
};
