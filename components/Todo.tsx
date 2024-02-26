"use client";

import oscar from "./oscar.json";
import { Movie, deleteMovie, insertMovies, toggleWatched } from "@/utils/data";
import { Export } from "@/components/Export";
import { Movies } from "@/components/Movies";
import { Search } from "@/components/Search";
import { Tabs } from "@/components/Tabs";
import { sortedMovies } from "@/utils/movies";
import { useOptimistic, startTransition, useState, useEffect } from "react";

type OptimisticAction =
  | { action: "toggle" | "delete"; id: string }
  | { action: "set"; payload: Movie[] }
  | { action: "add"; payload: Movie };

export const PREFERENCE_ITEMS = ["Rating", "Last added", "Year"] as const;
export type Preference = (typeof PREFERENCE_ITEMS)[number];

export const Todo = ({ data }: { data: Movie[] }) => {
  const [preference, setPreference] = useState<Preference>(PREFERENCE_ITEMS[0]);
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
      released: item.Released,
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

  return (
    <>
      <Tabs
        items={PREFERENCE_ITEMS}
        current={preference}
        setCurrent={setPreference}
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
