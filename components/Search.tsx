"use client";

import { useRef, useState } from "react";
import "./search.css";
import { createCancellableFetch, createAPI } from "../utils/fetch";

{
  /* <script lang="ts">
  import './search.css';

  import { onMount } from 'svelte';
  
  import { clickOutside } from '../utils/clickOutside';
  import { movies } from '../store/movies';

  const cancellableFetch = createCancellableFetch();

  let query = '';
  let results = [];
  $: indexSelected = 0;

  async function search(query) {
    try {
      const data = await cancellableFetch(createAPI({ search: query.trim() }));

      results = data.Search
        ? data.Search.filter(
            (movie) => !$movies.find((m) => m.imdbID === movie.imdbID)
          ).slice(0, 6)
        : [];
    } catch (error) {
      // TODO
      console.error(error);
    }
  }

  function keyHandler(event) {
    const { code } = event;

    switch (code) {
      case 'Enter':
      case 'Tab': {
        selectMovie(results[indexSelected].imdbID);
        event.preventDefault();
        break;
      }
      case 'Escape': {
        resetInterfaceState();
        break;
      }

      case 'ArrowUp': {
        if (indexSelected !== 0) {
          indexSelected -= 1;
        }
        event.preventDefault();
        break;
      }
      case 'ArrowDown': {
        if (indexSelected !== results.length - 1) {
          indexSelected += 1;
        }
        event.preventDefault();
        break;
      }

      default:
        break;
    }
  }

  function selectMovie(imdbID) {
    query = '';

    addMovieToStore(imdbID);
    resetInterfaceState();
  }

  async function addMovieToStore(imdbID) {
    try {
      const fullMovie = await fetch(createAPI({ imdbID })).then((res) =>
        res.json()
      );

      movies.update((prev) => [
        ...prev,
        { ...fullMovie, added: Date.now(), watched: false }
      ]);
    } catch (error) {
      // TODO
      console.error(error);
    }
  }

  function disposeKeyHandler() {
    window.removeEventListener('keydown', keyHandler);
  }

  function resetInterfaceState() {
    results = [];
    search('');
    indexSelected = 0;
  }

  let timer;

  function onInput({ target }: Event) {
    query = target.value;

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      search(query);
    }, 400);
  }

  function onSearchFocus() {
    window.addEventListener('keydown', keyHandler);
  }
</script> */
}

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
      const data = await cancellableFetch(
        createAPI({ search: query.trim() }).toString(),
      );

      setResults(
        data.Search
          ? data.Search.filter(
              (movie) => !$movies.find((m) => m.imdbID === movie.imdbID),
            ).slice(0, 6)
          : [],
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
        // on:focus={onSearchFocus}
        // on:blur={disposeKeyHandler}
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
