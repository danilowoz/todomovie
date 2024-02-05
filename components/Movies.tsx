import { Welcome } from "./Welcome";
import MovieItem from "./Movie";

import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/utils/data";

export const Movies = ({
  data,
  onToggleMovie,
  onDeleteMovie,
  onSetMovies,
}: {
  data: Movie[];
  onToggleMovie: (imdbid: string) => void;
  onDeleteMovie: (imdbid: string) => void;
  onSetMovies: () => void;
}) => {
  const unwatchedMovies = data.filter((movie) => !movie.watched);
  const watchedMovies = data.filter((movie) => movie.watched);

  if (data.length === 0) {
    return <Welcome onSetMovies={onSetMovies} />;
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
              toggleWatched={() => onToggleMovie(movie.imdbid)}
              deleteMovie={() => onDeleteMovie(movie.imdbid)}
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
                  toggleWatched={() => onToggleMovie(movie.imdbid)}
                  deleteMovie={() => onDeleteMovie(movie.imdbid)}
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
