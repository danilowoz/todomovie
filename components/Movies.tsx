"use client";

import { Movie, deleteMovie, toggleWatched } from "@/utils/data";
import { Welcome } from "./Welcome";
import MovieItem from "./Movie";
import { usePreference } from "@/utils/usePreference";
import { sortedMovies } from "@/utils/movies";
import { useOptimistic, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Movies = ({ data }: { data: Movie[] }) => {
  const [preference] = usePreference();
  const movies = sortedMovies(data, preference);

  const [optimistic, setOptimistic] = useOptimistic<
    Movie[],
    { action: "toggle" | "delete"; id: string }
  >(movies, (prevData, action) => {
    if (action.action === "delete") {
      return prevData.filter((movie) => movie.imdbid !== action.id);
    }

    return prevData.map((movie) => {
      if (movie.imdbid === action.id) {
        return { ...movie, watched: !movie.watched };
      }

      return movie;
    });
  });

  const unwatchedMovies = optimistic.filter((movie) => !movie.watched);
  const watchedMovies = optimistic.filter((movie) => movie.watched);

  if (optimistic.length === 0) {
    return <Welcome />;
  }

  function handleDeleteMovie(id: string) {
    startTransition(() => {
      setOptimistic({ id, action: "delete" });
    });
    deleteMovie(id);
  }

  function handleToggleMovie(id: string) {
    startTransition(() => {
      setOptimistic({ id, action: "toggle" });
    });
    toggleWatched(id);
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
              toggleWatched={() => handleToggleMovie(movie.imdbid)}
              deleteMovie={() => handleDeleteMovie(movie.imdbid)}
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
                  toggleWatched={() => handleToggleMovie(movie.imdbid)}
                  deleteMovie={() => handleDeleteMovie(movie.imdbid)}
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
