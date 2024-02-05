import { useEffect, useState } from "react";

export const PREFERENCE_ITEMS = ["Rate", "Last added", "Year"] as const;
export type Preference = (typeof PREFERENCE_ITEMS)[number];

export const usePreference = (): [Preference, (opt: Preference) => void] => {
  const [state, setCurrent] = useState<Preference>(PREFERENCE_ITEMS[0]);

  useEffect(() => {
    const tab = window.localStorage.getItem("tab");

    if (tab) {
      setCurrent(tab as Preference);
    }
  }, []);

  return [
    state,
    (tab: Preference) => {
      window.localStorage.setItem("tab", tab);

      setCurrent(tab);
    },
  ];
};
