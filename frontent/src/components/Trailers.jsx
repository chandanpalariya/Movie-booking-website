import React, { useEffect, useRef, useState } from "react";
import { trailersCSS, trailersStyles } from "../assests/dummyStyles";
import { trailersData } from "../assests/trailerdata";
import {
  Calendar,
  ChevronsLeft,
  ChevronsRight,
  Clapperboard,
  Play,
  Clock,
  X
} from "lucide-react";

const API_BASE = "http://localhost:5000";



const PLACEHOLDER_THUMB =
  "https://dummyimage.com/800x450/1f2937/ffffff&text=No+Thumbnail";
const getUploadUrl = (input) => {
  if (!input) return null;

  // Case 1: already a full URL
  if (typeof input === "string") {
    if (input.startsWith("http://") || input.startsWith("https://"))
      return input;
    // filename only (like "abc.jpg")
    return `${API_BASE}/uploads/${input}`;
  }

  // Case 2: input is an object (multer-like)
  if (typeof input === "object") {
    const possible =
      input.url ||
      input.path ||
      input.filename ||
      input.file ||
      input.image ||
      "";

    if (possible) return getUploadUrl(possible);
  }

  return null;
};

const formatDuration = (dur) => {
  if (!dur) return "";
  if (typeof dur === "string") return dur;
  if (typeof dur === "number") return `${dur}m`;
  // object with hours/minutes
  const h = dur.hours ?? 0;
  const m = dur.minutes ?? 0;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  if (m) return `${m}m`;
  return "";
};

const mapMovieToTrailerItem = (movie) => {
  // movie.latestTrailer may hold nested data
  const lt = movie.latestTrailer || {};
  const title = lt.title || movie.movieName || movie.title || "Untitled";
  const thumbnail =
    getUploadUrl(lt.thumbnail) ||
    getUploadUrl(movie.poster) ||
    PLACEHOLDER_THUMB;
  const videoUrl =
    lt.videoId || lt.videoUrl || movie.trailerUrl || movie.videoUrl || "";
  const duration = lt.duration
    ? formatDuration(lt.duration)
    : movie.duration
    ? formatDuration(movie.duration)
    : "";
  const year = lt.year || movie.year || "";
  const genre =
    lt.genres && lt.genres.length
      ? lt.genres.join(", ")
      : movie.categories && movie.categories.length
      ? movie.categories.join(", ")
      : "";
  const description = lt.description || movie.story || "";

  // Build credits object expected by UI: { Director: { name, image }, Producer: {...}, Singer: {...} }
  const credits = {};
  const firstDirector = (lt.directors || movie.directors || []).find(Boolean);
  const firstProducer = (lt.producers || movie.producers || []).find(Boolean);
  const firstSinger = (lt.singers || movie.singers || []).find(Boolean);

  if (firstDirector) {
    credits["Director"] = {
      name: firstDirector.name || "Unknown",
      image:
        getUploadUrl(firstDirector.file) ||
        getUploadUrl(firstDirector.image) ||
        getUploadUrl(firstDirector.photo) ||
        PLACEHOLDER_THUMB,
    };
  }
  if (firstProducer) {
    credits["Producer"] = {
      name: firstProducer.name || "Unknown",
      image:
        getUploadUrl(firstProducer.file) ||
        getUploadUrl(firstProducer.image) ||
        getUploadUrl(firstProducer.photo) ||
        PLACEHOLDER_THUMB,
    };
  }
  if (firstSinger) {
    credits["Singer"] = {
      name: firstSinger.name || "Unknown",
      image:
        getUploadUrl(firstSinger.file) ||
        getUploadUrl(firstSinger.image) ||
        getUploadUrl(firstSinger.photo) ||
        PLACEHOLDER_THUMB,
    };
  }

  return {
    id: movie._id || movie.id,
    title,
    thumbnail,
    videoUrl,
    duration,
    year,
    genre,
    description,
    credits,
  };
};



const Trailers = () => {
  const [featuredTrailer, setFeaturedTrailer] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted,setIsMuted]=useState(false)
  const carouselRef = useRef(null);
  const videoRef=useRef(null)
  const [trailers,setTrailers]=useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)

  useEffect(()=>{
    const ac=new AbortController()
    setLoading(true)
    setError(null)

    async function load() {
      try{
        const url=`${API_BASE}/api/movies?latestTrailers=true&limit=50`
        const res=await fetch(url,{signal:ac.signal})
        if(!res.ok) throw new Error("HTTP ${res.status}")
         
        const json=await res.json();
        const items=Array.isArray(json.items)?json.items:[];  
        const mapped=items.map(mapMovieToTrailerItem)
        console.log(mapped)
        setTrailers(mapped)
        setFeaturedTrailer(mapped[0] || null)
        setLoading(false)
      }
      catch(err){
        if(err.name==="AbortError") return
        console.error("failed to laoda trailers",err)
        setError("failed to load from server")
        setLoading(false)

      }
      
    }
    load()
    return ()=>ac.abort()


  },[])


  // Build embed url
  const getEmbedBaseUrl = (videoUrl) => {
    if (!videoUrl) return null;
    try {
      const url = new URL(videoUrl);
      const host = url.hostname.replace("www.", "").toLowerCase();

      if (host.includes("youtube.com")) {
        const vid = url.searchParams.get("v");
        if (vid) return `https://www.youtube.com/embed/${vid}`;
      }

      if (host === "youtu.be") {
        const vid = url.pathname.replace("/", "");
        if (vid) return `https://www.youtube.com/embed/${vid}`;
      }

      if (host.includes("vimeo.com")) {
        const parts = url.pathname.split("/").filter(Boolean);
        const id = parts.pop();
        if (id) return `https://player.vimeo.com/video/${id}`;
      }

      return videoUrl || null;
    } catch {
      return null;
    }
  };

   // // build final iframe src with autoplay /mute parameter
  const buildFrameSrc=(videoUrl)=>{
    const base=getEmbedBaseUrl(videoUrl)
    if(!base) return "";
    const sep=base.includes("?")?"&":"?";
    //add autoplay/mute /rel
    return `${base}${sep}autoplay=1&mute=${isMuted? 1:0}`
  }

  // Single correct selectTrailer
  const selectTrailer = (trailer) => {
    setFeaturedTrailer(trailer);
    setIsPlaying(false);

    // center selected item
    if (carouselRef.current) {
      const el = carouselRef.current.querySelector(
        `[data-id='${trailer.id}']`
      );
      if (el) {
        const rect = el.getBoundingClientRect();
        const parentRect = carouselRef.current.getBoundingClientRect();
        const offset =
          rect.left - parentRect.left - parentRect.width / 2 + rect.width / 2;
        carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
      }
    }
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  // helps in playing the video
  if(loading){
    return (
      <div className={trailersStyles.container}>
        <div className="py-12 text-center text-gray-300">Loading Trailers ...</div>

      </div>
    )
  }


  if(error){
    return (
      <div className={trailersStyles.container}>
        <div className="py-12 text-center text-red-400 ">{error}</div>

      </div>
    )
  }

  // Handle empty or null featured trailer
  if (!featuredTrailer) {
    return (
      <div className={trailersStyles.container}>
        <div className="py-12 text-center text-gray-300">No trailers available</div>
      </div>
    );
  }

  const dataToRender=trailers || []




 
  return (
    <div className={trailersStyles.container}>
      <main className={trailersStyles.main}>
        <div className={trailersStyles.layout}>

          {/* LEFT SIDE */}
          <div className={trailersStyles.leftSide}>
            <div className={trailersStyles.leftCard}>
              <h2 className={trailersStyles.leftSide} style={{ fontFamily: "monoton, cursive" }}>
                <Clapperboard className={trailersStyles.titleIcon} />
                Latest Trailer
              </h2>

              <div className={trailersStyles.carouselControls}>
                <button onClick={scrollLeft}><ChevronsLeft size={18} /></button>
                <button onClick={scrollRight}><ChevronsRight size={18} /></button>
                <span className={trailersStyles.trailerCount}>
                  {dataToRender.length} Trailers
                </span>
              </div>

              <div ref={carouselRef} className={trailersStyles.carousel}>
                {dataToRender.map((trailer) => (
                  <div
                    key={trailer.id}
                    data-id={trailer.id}
                    className={
                      featuredTrailer.id === trailer.id
                        ? trailersStyles.carouselItem.active
                        : trailersStyles.carouselItem.inactive
                    }
                    onClick={() => selectTrailer(trailer)}
                  >
                    <img src={trailer.thumbnail || PLACEHOLDER_THUMB} alt={trailer.title} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={trailersStyles.rightSide}>
            <div className={trailersStyles.rightCard}>
              <div className={trailersStyles.videoContainer}>

                {isPlaying && getEmbedBaseUrl(featuredTrailer.videoUrl) ? (
                  <div className={trailersStyles.videoWrapper}>
                    <iframe
                      className={trailersStyles.videoIframe}
                      src={getEmbedBaseUrl(featuredTrailer.videoUrl)}
                      title={featuredTrailer.title}
                      frameBorder="0"
                      allowFullScreen
                    />
                    <button
                      className={trailersStyles.closeButtonInner}
                      onClick={() => setIsPlaying(false)}
                    >
                      <X size={28} />
                    </button>
                  </div>
                ) : getEmbedBaseUrl(featuredTrailer.videoUrl) ? (
                  <div className={trailersStyles.thumbnailContainer}>
                    <img
                      src={featuredTrailer.thumbnail}
                      alt={featuredTrailer.title}
                      className={trailersStyles.thumbnailImage}
                    />
                    <button
                      onClick={() => setIsPlaying(true)}
                      className={trailersStyles.playButton}
                    >
                      <Play size={32} />
                    </button>
                  </div>
                ) : (
                  <div className={trailersStyles.thumbnailContainer}>
                    <img
                      src={featuredTrailer.thumbnail}
                      alt={featuredTrailer.title}
                      className={trailersStyles.thumbnailImage}
                    />
                  </div>
                )}

              </div>

              <div className={trailersStyles.trailerInfo}>
                <h2 className={trailersStyles.trailerTitle}>
                  {featuredTrailer.title}
                </h2>

                <div className={trailersStyles.trailerMeta}>
                  <span className={trailersStyles.metaItem}>
                    <Clock size={16} /> {featuredTrailer.duration}
                  </span>
                  <span className={trailersStyles.metaItem}>
                    <Calendar size={16} /> {featuredTrailer.year}
                  </span>
                </div>

                <p className={trailersStyles.description}>
                  {featuredTrailer.description}
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      <style jsx>{trailersCSS}</style>
    </div>
  );
};

export default Trailers;
