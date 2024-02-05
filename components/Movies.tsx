import { Welcome } from "./Welcome";
import MovieItem from "./Movie";

import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/utils/data";

const EXIT = {
  y: 30,
  opacity: 0,
};

const TRANSITION = {
  duration: 0.3,
  ease: [0.43, 0.13, 0.23, 0.96],
};

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
              exit={EXIT}
              transition={TRANSITION}
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
                exit={EXIT}
                transition={TRANSITION}
                layout
                className="movies-watched"
              >
                Watched
              </motion.p>
              {watchedMovies.map((movie) => (
                <MovieItem
                  exit={EXIT}
                  transition={TRANSITION}
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
