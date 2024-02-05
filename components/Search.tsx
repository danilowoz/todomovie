import { useCallback, useEffect, useRef, useState } from "react";
import "./search.css";
import { MovieRaw, createCancellableFetch, createURL } from "../utils/fetch";
import { Movie } from "@/utils/data";
import { useClickOutside } from "@/utils/useClickOutside";
import Image from "next/image";

const cancellableFetch = createCancellableFetch();

export const Search = ({
  data,
  onAddMovie,
}: {
  data: Movie[];
  onAddMovie: (movie: Movie) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieRaw[]>([]);
  const [indexSelected, setIndexSelected] = useState(0);
  const timer = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, resetInterfaceState);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (!query) return;

        const rawMovies = await cancellableFetch<{ Search: MovieRaw[] }>(
          createURL({ search: query.trim() }),
        );

        setResults(
          rawMovies.Search
            ? rawMovies.Search.filter(
                (rawItem) => !data.find((m) => m.imdbid === rawItem.imdbID),
              ).slice(0, 6)
            : [],
        );
      } catch (error) {
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

      onAddMovie({
        imdbrating: fullMovie.imdbRating,
        genre: fullMovie.Genre,
        plot: fullMovie.Plot,
        poster: fullMovie.Poster,
        runtime: fullMovie.Runtime,
        title: fullMovie.Title,
        year: fullMovie.Year,
        imdbid: fullMovie.imdbID,
        director: fullMovie.Director,
        added: new Date().toString(),
      });
    } catch (error) {
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
    <div className="container-padding" ref={containerRef}>
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
                      {" "}
                      ({result.Year})
                    </span>
                  )}

                  <div className="app-search_poster">
                    <img src={result.Poster} alt={result.Title} />
                  </div>

                  <div className="app-search_poster--shadow">
                    <Image src={result.Poster} alt={result.Title} />
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
