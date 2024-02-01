"use client";

import { useRef, useState } from "react";
import "./search.css";
import { createCancellableFetch, createAPI } from "../utils/fetch";

type Movie = {
  Title: string;
  imdbID: string;
  Year: string;
  Type: string;
  Poster: string;
};

const cancellableFetch = createCancellableFetch();

export const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [indexSelected, setIndexSelected] = useState(0);
  const timer = useRef<NodeJS.Timeout>();

  async function search(query: string) {
    try {
      // @ts-ignore
      const data = await cancellableFetch(createAPI({ search: query.trim() }));

      setResults(
        data.Search ?? [],
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
  }

  async function addMovieToStore(imdbID: string) {
    try {
      const fullMovie = await fetch(createAPI({ imdbID })).then((res) =>
        res.json(),
      );

      // movies.update((prev) => [
      //   ...prev,
      //   { ...fullMovie, added: Date.now(), watched: false },
      // ]);
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

  function keyHandler(event: KeyboardEvent) {
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
        if (indexSelected !== 0) {
          setIndexSelected(indexSelected - 1);
        }
        event.preventDefault();
        break;
      }
      case "ArrowDown": {
        if (indexSelected !== results.length - 1) {
          setIndexSelected(indexSelected + 1);
        }
        event.preventDefault();
        break;
      }

      default:
        break;
    }
  }

  function onSearchFocus() {
    window.addEventListener("keydown", keyHandler);
  }

  function disposeKeyHandler() {
    window.removeEventListener("keydown", keyHandler);
  }

  function onInput({ target }: React.ChangeEvent<HTMLInputElement>) {
    setQuery(target.value);

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      search(query);
    }, 400);
  }

  return (
    <div
      className="container-padding"
      //   use:clickOutside
      //   on:click_outside={resetInterfaceState}
    >
      <input
        className="app-search"
        value={query}
        onChange={onInput}
        onFocus={onSearchFocus}
        onBlur={disposeKeyHandler}
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
                  className={`app-search_result ${index === indexSelected ? "selected" : ""}`}
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
