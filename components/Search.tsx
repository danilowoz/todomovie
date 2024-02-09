import { useCallback, useEffect, useRef, useState } from "react";
import "./search.css";
import { MovieRaw, createCancellableFetch, createURL } from "../utils/fetch";
import { Movie } from "@/utils/data";
import { useClickOutside } from "@/utils/useClickOutside";

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
  const [error, setError] = useState(false);

  const timer = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, resetInterfaceState);

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (!query) {
      setResults([]);
      return;
    }

    const fetchMovies = async () => {
      setError(false);

      try {
        const response = await cancellableFetch<
          { Search: MovieRaw[] } | { Error: string }
        >(createURL({ search: query.trim() }));

        if ("Error" in response) {
          setError(true);

          return;
        }

        setResults(
          response.Search
            ? response.Search.filter(
                (rawItem) => !data.find((m) => m.imdbid === rawItem.imdbID),
              ).slice(0, 6)
            : [],
        );
      } catch (error) {
        console.error(error);
      }
    };

    timer.current = setTimeout(() => {
      fetchMovies();
    }, 500);
  }, [query, data]);

  const addMovieToStore = useCallback(
    async (imdbID: string) => {
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
          released: fullMovie.Released,
          imdbid: fullMovie.imdbID,
          director: fullMovie.Director,
          country: fullMovie.Country,
          added: new Date().toString(),
        });

        resetInterfaceState();
      } catch (error) {
        console.error(error);
      }
    },
    [onAddMovie],
  );

  const selectMovie = useCallback(
    (imdbID: string) => {
      setQuery("");

      addMovieToStore(imdbID);
      resetInterfaceState();
    },
    [addMovieToStore],
  );

  function resetInterfaceState() {
    setResults([]);
    setIndexSelected(0);
    setError(false);
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

      {error && (
        <div className="app-search_results_container">
          <div className="app-search__dropdown app-search_error">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98664 7.5 8.98664C7.2208 8.98664 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>

            <span>Movie not found, try again...</span>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="app-search_results_container">
          <div className="app-search__dropdown app-search_results">
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
                    (part, index) => (
                      <span
                        key={part + index}
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
