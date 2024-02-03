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

  if (watchedMovies.length > 0 && unwatchedMovies.length === 0) {
    return (
      <div className="movies-done">
        <div className="movies-done">
          <div>
            <p>And that's all I have to say about that.</p>

            <small>Forrest Gump</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movies container-padding">
      {unwatchedMovies.map((movie) => (
        <MovieItem data={movie} key={movie.imdbID} watched={false} />
      ))}

      {watchedMovies.length > 0 && (
        <p className="movies-watched" watched>
          Watched
        </p>
      )}
    </div>
  );
};

// {#if $movies.length === 0}
//   <Welcome />
// {/if}

// {#if $watchedMovies.length > 0 && $data.length === 0}
//   <div class="movies-done">
//     <div>
//       <p>And that's all I have to say about that.</p>

//       <small>Forrest Gump</small>
//     </div>
//   </div>
// {/if}

// <div class="movies container-padding">
//   {#if $data.length > 0}
//     {#each $data as item (item.imdbID)}
//       <div transition:slide={{ duration: 300, easing: circOut }}>
//         <div transition:fade={{ duration: 150 }}>
//           <Movie data={item} {toggleWatched} {deleteMovie} watched={false} />
//         </div>
//       </div>
//     {/each}
//   {/if}

//   {#if $watchedMovies.length > 0}
//     <p class="movies-watched">Watched</p>
//     {#each $watchedMovies as item (item.imdbID)}
//       <div transition:slide={{ duration: 200, easing: circOut }}>
//         <div transition:fade={{ duration: 100 }}>
//           <Movie data={item} {toggleWatched} {deleteMovie} watched />
//         </div>
//       </div>
//     {/each}
//   {/if}
// </div>
