import React, { useState, useEffect } from "react";
import { moviesStyles } from "../assests/dummyStyles";
import { Link } from "react-router-dom";
import { Tickets } from "lucide-react";

const API_BASE = "http://localhost:5000";

const PLACEHOLDER = "https://via.placeholder.com/400x600?text=No+Poster";

const getUploadUrl = (maybe) => {
  if (!maybe) return null;
  if (typeof maybe !== "string") return null;
  if (maybe.startsWith("http://") || maybe.startsWith("https://"))
    return maybe;
  return `${API_BASE}/uploads/${String(maybe).replace(/^uploads\//, "")}`;
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    async function loadFeaturedMovies() {
      try {
        const url = `${API_BASE}/api/movies?type=featured&limit=6`;

        const res = await fetch(url, { signal: ac.signal });

        if (!res.ok) throw new Error(`fetch error: ${res.status}`);

        const json = await res.json();

        const items = json.items ?? [];

        setMovies(items.slice(0, 6));
        setLoading(false);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Movies load error", err);
        setError("failed to load movies");
        setLoading(false);
      }
    }

    loadFeaturedMovies();

    return () => ac.abort();
  }, []);

  return (
    <section className={moviesStyles.container}>
      <h2
        className={moviesStyles.title}
        style={{ fontFamily: "'Dancing Script',cursive" }}
      >
        Featured Movies
      </h2>

      {loading ? (
        <div className="text-gray-300 py-12 text-center">
          Loading movies...
        </div>
      ) : movies.length === 0 ? (
        <div className="text-gray-400 py-12 text-center">
          No featured movies found.
        </div>
      ) : (
        <div className={moviesStyles.grid}>
          {movies.map((m) => {
            const rawImg =
              m.poster || m.latestTrailer?.thumbnail || m.thumbnail;

            const imgSrc = getUploadUrl(rawImg) || PLACEHOLDER;

            const title = m.movieName || m.title || "Untitled";

            const category =
              (Array.isArray(m.categories) && m.categories[0]) ||
              "General";

            const movieId = m._id || m.id;

            return (
              <article key={movieId} className={moviesStyles.movieArticle}>
                <Link
                  to={`/movies/${movieId}`}
                  className={moviesStyles.movieLink}
                >
                  <img
                    src={imgSrc}
                    alt={title}
                    loading="lazy"
                    className={moviesStyles.movieImage}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                </Link>

                <div className={moviesStyles.movieInfo}>
                  <div className={moviesStyles.titleContainer}>
                    <Tickets className={moviesStyles.ticketIcon} />

                    <span
                      id={`movie-title-${movieId}`}
                      className={moviesStyles.movieTitle}
                      style={{ fontFamily: "'Pacifico',cursive" }}
                    >
                      {title}
                    </span>
                  </div>

                  <div className={moviesStyles.categoryContainer}>
                    <span className={moviesStyles.categoryText}>
                      {category}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Movies;