"use client";

import "./welcome.css";
import oscar from "./oscar.json";
import { insertMovies } from "@/utils/data";

export const Welcome = () => {
  function addToList() {
    insertMovies(
      oscar.map((item) => ({
        director: item.Director,
        genre: item.Genre,
        plot: item.Plot,
        poster: item.Poster,
        title: item.Title,
        year: item.Year,
        imdbrating: item.imdbRating,
        imdbid: item.imdbID,
        runtime: item.Runtime,
      })),
    );
  }
  return (
    <div className="container-padding welcome">
      <div className="welcome-image">
        <img src="/welcome.png" alt="welcome" />
      </div>

      <div className="welcome-content">
        <h2 className="welcome-caption">Welcome</h2>

        <div className="welcome-text">
          <h1>
            This is the new home of your movie list! Search, sort, and don't
            skip a single film.
          </h1>
          <p>
            Not sure where to start? Start searching or check out the list of
            Oscar-nominated movies.
          </p>

          <div>
            <button onClick={addToList} className="button button-primary">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V9.5C13 9.77614 12.7761 10 12.5 10H2.5C2.22386 10 2 9.77614 2 9.5V3.5ZM2 10.9146C1.4174 10.7087 1 10.1531 1 9.5V3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.1531 13.5826 10.7087 13 10.9146V11.5C13 12.3284 12.3284 13 11.5 13H3.5C2.67157 13 2 12.3284 2 11.5V10.9146ZM12 11V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V11H12ZM5 6.5C5 6.22386 5.22386 6 5.5 6H7V4.5C7 4.22386 7.22386 4 7.5 4C7.77614 4 8 4.22386 8 4.5V6H9.5C9.77614 6 10 6.22386 10 6.5C10 6.77614 9.77614 7 9.5 7H8V8.5C8 8.77614 7.77614 9 7.5 9C7.22386 9 7 8.77614 7 8.5V7H5.5C5.22386 7 5 6.77614 5 6.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
              Add Oscar-nominated
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
