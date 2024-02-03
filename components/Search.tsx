"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./search.css";
import { MovieRaw, createCancellableFetch, createURL } from "../utils/fetch";
import { Movie, insertMovie } from "@/utils/data";

const cancellableFetch = createCancellableFetch();

export const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [indexSelected, setIndexSelected] = useState(0);
  const timer = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await cancellableFetch(
          createURL({ search: query.trim() }),
        );

        setResults(
          data.Search.slice(0, 6) ?? [],
          // data.Search
          //   ? data.Search.filter(
          //       (movie) => !$movies.find((m) => m.imdbID === movie.imdbID),
          //     ).slice(0, 6)
          //   : [],
        );
      } catch (error) {
        // TODO
        console.error(error);
      }
    };

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      fetchMovies();
    }, 500);
  }, [query]);

  async function addMovieToStore(imdbID: string) {
    try {
      const fullMovie: MovieRaw = await fetch(createURL({ imdbID })).then(
        (res) => res.json(),
      );

      await insertMovie({
        imdbrating: fullMovie.imdbRating,
        genre: fullMovie.Genre,
        plot: fullMovie.Plot,
        poster: fullMovie.Poster,
        runtime: fullMovie.Runtime,
        title: fullMovie.Title,
        year: fullMovie.Year,
        imdbid: fullMovie.imdbID,
        director: fullMovie.Director,
      });
    } catch (error) {
      // TODO
      console.error(error);
    }
  }

  function selectMovie(imdbID: string) {
    setQuery("");

    addMovieToStore(imdbID);
    resetInterfaceState();
  }

  function resetInterfaceState() {
    setResults([]);
    setIndexSelected(0);
  }

  const keyHandler = useCallback(
    (event: KeyboardEvent) => {
      const { code } = event;

      switch (code) {
        case "Enter":
        case "Tab": {
          selectMovie(results[indexSelected].imdbID);
          event.preventDefault();
          break;
        }
        case "Escape": {
          resetInterfaceState();
          break;
        }

        case "ArrowUp": {
          setIndexSelected((prev) => {
            return prev !== 0 ? prev - 1 : prev;
          });

          event.preventDefault();
          break;
        }
        case "ArrowDown": {
          setIndexSelected((prev) => {
            return prev !== results.length - 1 ? prev + 1 : prev;
          });

          event.preventDefault();
          break;
        }

        default:
          break;
      }
    },
    [results, indexSelected, selectMovie],
  );

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      window.addEventListener("keydown", keyHandler);
    }

    return () => {
      if (input) {
        window.removeEventListener("keydown", keyHandler);
      }
    };
  }, [keyHandler]);

  return (
    <div
      className="container-padding"
      //   use:clickOutside
      //   on:click_outside={resetInterfaceState}
    >
      <input
        ref={inputRef}
        className="app-search"
        value={query}
        onChange={({ target }) => setQuery(target.value)}
        type="search"
        placeholder="Search..."
      />

      {results.length > 0 && (
        <div className="app-search_results_container">
          <div className="app-search_results">
            {results.map((result, index) => {
              if (!result.Title) {
                return;
              }

              return (
                <div
                  key={result.imdbID}
                  className={`app-search_result ${index === indexSelected ? "app-search_result--selected" : ""}`}
                  onClick={() => {
                    selectMovie(result.imdbID);
                  }}
                >
                  {result.Title.split(new RegExp(`(${query})`, "gi")).map(
                    (part) => (
                      <span
                        key={part}
                        className={part === query ? "query" : ""}
                      >
                        {part}
                      </span>
                    ),
                  )}

                  {result.Year && (
                    <span className="app-search_result_year">
                      ({result.Year})
                    </span>
                  )}

                  <div className="app-search_poster">
                    <img src={result.Poster} alt={result.Title} />
                  </div>

                  <div className="app-search_poster--shadow">
                    <img src={result.Poster} alt={result.Title} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
