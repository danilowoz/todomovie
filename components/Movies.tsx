"use client";

import { Movie, deleteMovie, toggleWatched } from "@/utils/data";
import { Welcome } from "./Welcome";
import MovieItem from "./Movie";
import { usePreference } from "@/utils/usePreference";
import { sortedMovies } from "@/utils/movies";
import { useOptimistic } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";

export const Movies = ({ data }: { data: Movie[] }) => {
  const [preference] = usePreference();
  const movies = sortedMovies(data, preference);

  const [optimistic, setOptimistic] = useOptimistic(movies, (data, action) =>
    data.map((movie) => {
      if (movie.imdbid === action) {
        return { ...movie, watched: !movie.watched };
      }

      return movie;
    }),
  );

  const unwatchedMovies = optimistic.filter((movie) => !movie.watched);
  const watchedMovies = optimistic.filter((movie) => movie.watched);

  if (optimistic.length === 0) {
    return <Welcome />;
  }

  return (
    <>
      {watchedMovies.length > 0 && unwatchedMovies.length === 0 && (
        <div className="movies-done">
          <div>
            <p>And that&apos;s all I have to say about that.</p>

            <small>Forrest Gump</small>
          </div>
        </div>
      )}

      <div className="movies container-padding">
        <AnimatePresence>
          {unwatchedMovies.map((movie) => (
            <MovieItem
              toggleWatched={() => {
                setOptimistic(movie.imdbid);
                toggleWatched(movie.imdbid);
              }}
              deleteMovie={() => deleteMovie(movie.imdbid)}
              data={movie}
              key={movie.imdbid}
              watched={false}
            />
          ))}

          {watchedMovies.length > 0 && (
            <>
              <motion.p
                exit={{ opacity: 0, y: 30 }}
                layout
                className="movies-watched"
                transition={{ duration: 0.2 }}
              >
                Watched
              </motion.p>
              {watchedMovies.map((movie) => (
                <MovieItem
                  toggleWatched={() => {
                    setOptimistic(movie.imdbid);
                    toggleWatched(movie.imdbid);
                  }}
                  deleteMovie={() => deleteMovie(movie.imdbid)}
                  data={movie}
                  key={movie.imdbid}
                  watched
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
