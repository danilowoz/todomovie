import { Preference } from "@/components/Todo";
import { Movie } from "./data";

export const sortedMovies = (movies: Movie[], preference: Preference) => {
  switch (preference) {
    case "Last added":
      return movies.sort((a, b) => {
        // @ts-ignore
        return new Date(b.added) - new Date(a.added);
      });

    case "Year":
      return movies.sort((a, b) => {
        if (new Date(a.released) > new Date(b.released)) {
          return 1;
        }
        if (new Date(a.released) < new Date(b.released)) {
          return -1;
        }
        return 0;
      });

    default:
    case "Rating":
      return movies.sort((a, b) => {
        const rateA = Number(a.imdbrating === "N/A" ? 0 : a.imdbrating);
        const rateB = Number(b.imdbrating === "N/A" ? 0 : b.imdbrating);

        if (rateA === rateB) {
          // @ts-ignore
          return new Date(b.added) - new Date(a.added);
        }

        return rateB - rateA;
      });
  }
};

export function convertMinutesToHoursAndMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}
