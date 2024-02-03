import { Movie } from "./data";
import { PREFERENCE_ITEMS } from "./usePreference";

export const sortedMovies = (
  movies: Movie[],
  preference: (typeof PREFERENCE_ITEMS)[number],
) => {
  switch (preference) {
    case "Last added":
      return movies.sort((a, b) => {
        // @ts-ignore
        return new Date(b.added) - new Date(a.added);
      });

    case "Year":
      return movies.sort((a, b) => {
        if (Number(a.year) > Number(b.year)) {
          return -1;
        }
        if (Number(a.year) < Number(b.year)) {
          return 1;
        }
        return 0;
      });

    default:
    case "Rate":
      return movies.sort((a, b) => {
        return (
          Number(b.imdbrating === "N/A" ? 0 : b.imdbrating) -
          Number(a.imdbrating === "N/A" ? 0 : a.imdbrating)
        );
      });
  }
};
