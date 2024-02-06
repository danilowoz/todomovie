import { Movie } from "@/utils/data";
import React, { useState, useEffect } from "react";
import "./movie.css";
import { motion, AnimationProps } from "framer-motion";
import { Tooltip } from "./Tooltip";
import { flag } from "country-emoji";

export const MovieItem = ({
  data,
  watched,
  exit,
  transition,
  toggleWatched,
  deleteMovie,
}: {
  data: Movie;
  watched: boolean;
  exit?: AnimationProps["exit"];
  transition?: AnimationProps["transition"];
  toggleWatched: (imdbid: string) => void;
  deleteMovie: (imdbid: string) => void;
}) => {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    setCheck(false);
  }, [watched]);

  const handleCheckClick = () => {
    if (data.watched) {
      toggleWatched(data.imdbid);
    } else {
      setCheck(true);

      setTimeout(() => {
        toggleWatched(data.imdbid);
      }, 600);
    }
  };

  return (
    <motion.li
      layout
      exit={exit}
      transition={transition}
      className={`movie-item ${check || watched ? "movie-item__watched" : ""} ${
        check ? "movie-item__checked" : ""
      }`}
    >
      <div className="movie-item_sidebar">
        <p className="movie-item_rate only-desktop">{data.imdbrating}</p>

        <button
          className="button movie-item_actions movie-item_check-button"
          onClick={handleCheckClick}
        >
          <Tooltip
            delay={300}
            trigger={
              <img
                src={data.watched ? "/eye.svg" : "/check.svg"}
                alt={data.watched ? "Mark as not watched" : "Watched"}
              />
            }
          >
            Mark as {data.watched ? "not watched" : "watched"}
          </Tooltip>
        </button>

        <button
          className="button movie-item_actions"
          onClick={() => deleteMovie(data.imdbid)}
        >
          <Tooltip delay={300} trigger={<img src="/delete.svg" alt="Delete" />}>
            Delete
          </Tooltip>
        </button>
      </div>

      <div className="movie-item_info">
        <div className="movie-item_details">
          <h2 className="movie-item_title">
            <span>{data.title}</span>
          </h2>

          <p className="movie-item_metadata">by {data.director}</p>
          <p className="movie-item_metadata">{data.runtime}</p>
          <p className="movie-item_metadata only-desktop">{data.genre}</p>
          <p className="movie-item_metadata">{data.year}</p>
          <p className="movie-item_metadata only-mobile">{data.imdbrating}</p>
          <p className="movie-item_metadata only-desktop">
            {data.country.split(", ").map(flag).join(" ")}
          </p>
        </div>
        <p className="movie-item_description">{data.plot}</p>
      </div>
    </motion.li>
  );
};

export default MovieItem;
