"use client";

import oscar from "./oscar.json";
import { Movie, deleteMovie, insertMovies, toggleWatched } from "@/utils/data";
import { Export } from "@/components/Export";
import { Movies } from "@/components/Movies";
import { Search } from "@/components/Search";
import { Tabs } from "@/components/Tabs";
import { sortedMovies } from "@/utils/movies";
import { useOptimistic, startTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type OptimisticAction =
  | { action: "toggle" | "delete"; id: string }
  | { action: "set"; payload: Movie[] }
  | { action: "add"; payload: Movie };

export const PREFERENCE_ITEMS = ["Rate", "Last added", "Year"] as const;
export type Preference = (typeof PREFERENCE_ITEMS)[number];

export const Todo = ({ data }: { data: Movie[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filter = (searchParams.get("filter") as Preference) ?? "Rate";

  const [preference, setPreference] = useOptimistic<Preference>(
    PREFERENCE_ITEMS[0],
  );
  const [optimistic, setOptimistic] = useOptimistic<Movie[], OptimisticAction>(
    data,
    (prevData, action) => {
      switch (action.action) {
        case "add": {
          return [...prevData, action.payload];
        }

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

  function handleSetMovies() {
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
      country: item.Country,
      added: Date.now().toString(),
      watched: false,
    }));

    startTransition(() => {
      setOptimistic({ action: "set", payload: state });
    });

    insertMovies(state);
  }

  function handleAddMovie(movie: Movie) {
    startTransition(() => {
      setOptimistic({ action: "add", payload: movie });
    });

    insertMovies([movie]);
  }

  function handleFilterChange(value: Preference) {
    startTransition(() => {
      setPreference(value);

      const params = new URLSearchParams(searchParams.toString());
      params.set("filter", value);

      router.replace(pathname + "?" + params.toString());
    });
  }

  return (
    <>
      <Tabs
        items={PREFERENCE_ITEMS}
        current={filter}
        setCurrent={handleFilterChange}
      />
      <Export data={movies} />
      <Search data={movies} onAddMovie={handleAddMovie} />
      <Movies
        data={movies}
        onSetMovies={handleSetMovies}
        onToggleMovie={handleToggleMovie}
        onDeleteMovie={handleDeleteMovie}
      />
    </>
  );
};
