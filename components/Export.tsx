import "./export.css";
import { Movie } from "@/utils/data";
import React, { useState } from "react";
import { Tooltip } from "./Tooltip";

const exportAsMarkdown = (movies: Movie[]) => {
  const text = movies
    .map(
      (movie) =>
        `- [${movie.watched ? "x" : " "}] **${movie.title} (${movie.year})** by ${movie.director}: ${movie.runtime} - ${movie.genre} - ${movie.imdbrating} `,
    )
    .join("\n");
  copyToClipboard(text);
};

const copyToClipboard = (text: string) => {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

export const Export = ({ data }: { data: Movie[] }) => {
  const [clicked, setClicked] = useState(false);
  const [slideOut, setSlideOut] = useState(false);

  const handleButtonClick = () => {
    setClicked(true);

    setTimeout(() => {
      setSlideOut(true);
    }, 2500);

    setTimeout(() => {
      setSlideOut(false);
      setClicked(false);
    }, 3000);

    exportAsMarkdown(data);
  };

  return (
    <>
      <Tooltip
        trigger={
          <button onClick={handleButtonClick} className="button export-button">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </button>
        }
      >
        Export to markdown
      </Tooltip>

      {clicked && (
        <div className={`notification ${slideOut ? "slide-out" : ""}`}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
              fill="var(--brand-color-blue)"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
          Copied to clipboard
        </div>
      )}
    </>
  );
};
