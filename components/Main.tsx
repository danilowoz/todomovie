import { Welcome } from "./Welcome";
import MovieItem from "./Movie";

import { motion, AnimatePresence, AnimationProps } from "framer-motion";
import { Movie } from "@/utils/data";

const EXIT: AnimationProps["exit"] = {
  y: 30,
  opacity: 0,
  scale: 0.95,
};

const TRANSITION: AnimationProps["transition"] = {
  duration: 0.4,
  ease: "easeOut",
  y: { delay: 0.2 },
};

export const Main = ({
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
      <AnimatePresence>
        {watchedMovies.length > 0 && unwatchedMovies.length === 0 && (
          <motion.div
            exit={{ scale: 0.99, opacity: 0 }}
            transition={TRANSITION}
            className="movies-done"
          >
            <div>
              <p>And that&apos;s all I have to say about that.</p>

              <small>Forrest Gump</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <motion.p layout className="movies-watched">
              Watched
            </motion.p>
          )}

          {watchedMovies.map((movie) => (
            <MovieItem
              toggleWatched={() => onToggleMovie(movie.imdbid)}
              deleteMovie={() => onDeleteMovie(movie.imdbid)}
              data={movie}
              key={movie.imdbid + "watched"}
              watched
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};
