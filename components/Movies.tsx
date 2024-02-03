import { getMovies } from "@/utils/data";
import { Welcome } from "./Welcome";
import MovieItem from "./Movie";

export const Movies = async () => {
  const movies = await getMovies();

  const unwatchedMovies = movies.filter((movie) => !movie.watched);
  const watchedMovies = movies.filter((movie) => movie.watched);

  if (movies.length === 0) {
    return <Welcome />;
  }

  return (
    <>
      {watchedMovies.length > 0 && unwatchedMovies.length === 0 && (
        <div className="movies-done">
          <div>
            <p>And that's all I have to say about that.</p>

            <small>Forrest Gump</small>
          </div>
        </div>
      )}

      <div className="movies container-padding">
        {unwatchedMovies.map((movie) => (
          <MovieItem data={movie} key={movie.imdbid} watched={false} />
        ))}

        {watchedMovies.length > 0 && (
          <>
            <p className="movies-watched">Watched</p>
            {watchedMovies.map((movie) => (
              <MovieItem data={movie} key={movie.imdbid} watched />
            ))}
          </>
        )}
      </div>
    </>
  );
};
