import { useEffect, useState } from "react";

export const PREFERENCE_ITEMS = ["Rate", "Last added", "Year"] as const;
export type Preference = (typeof PREFERENCE_ITEMS)[number];

export const usePreference = (): [Preference, (opt: Preference) => void] => {
  const [state, setCurrent] = useState<Preference>(PREFERENCE_ITEMS[0]);

  const update = () => {
    const tab = window.localStorage.getItem("tab");

    if (tab) {
      setCurrent(tab as Preference);
    }
  };

  useEffect(() => {
    update();

    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("storage", update);
    };
  }, []);

  return [
    state,
    (tab: Preference) => {
      window.localStorage.setItem("tab", tab);
      window.dispatchEvent(new Event("storage")); // rá!

      setCurrent(tab);
    },
  ];
};
