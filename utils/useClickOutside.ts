import { RefObject, useEffect } from "react";

export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Detach the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
