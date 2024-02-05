"use client";

import oscar from "./oscar.json";
import { Movie, deleteMovie, insertMovies, toggleWatched } from "@/utils/data";
import { Welcome } from "./Welcome";
import MovieItem from "./Movie";
import { usePreference } from "@/utils/usePreference";
import { sortedMovies } from "@/utils/movies";
import { useOptimistic, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OptimisticAction =
  | { action: "toggle" | "delete"; id: string }
  | { action: "set"; payload: Movie[] };

export const Movies = ({ data }: { data: Movie[] }) => {
  const [preference] = usePreference();

  const [optimistic, setOptimistic] = useOptimistic<Movie[], OptimisticAction>(
    data,
    (prevData, action) => {
      switch (action.action) {
        case "set": {
          return action.payload;
        }

        case "delete": {
          return prevData.filter((movie) => movie.imdbid !== action.id);
        }

        case "toggle": {
          return prevData.map((movie) => {
            if (movie.imdbid === action.id) {
              return { ...movie, watched: !movie.watched };
            }

            return movie;
          });
        }

        default:
          return prevData;
      }
    },
  );

  const movies = sortedMovies(optimistic, preference);
  const unwatchedMovies = movies.filter((movie) => !movie.watched);
  const watchedMovies = movies.filter((movie) => movie.watched);

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

  function handleInitialState() {
    const state = oscar.map((item) => ({
      director: item.Director,
      genre: item.Genre,
      plot: item.Plot,
      poster: item.Poster,
      title: item.Title,
      year: item.Year,
      imdbrating: item.imdbRating,
      imdbid: item.imdbID,
      runtime: item.Runtime,
      added: Date.now().toString(),
      watched: false,
    }));

    startTransition(() => {
      setOptimistic({ action: "set", payload: state });
    });

    insertMovies(state);
  }

  if (optimistic.length === 0) {
    return <Welcome onAddMovies={handleInitialState} />;
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
