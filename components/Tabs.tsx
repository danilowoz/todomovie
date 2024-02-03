"use client";

import { CSSProperties, useEffect, useLayoutEffect, useState } from "react";
import "./tabs.css";
import {
  PREFERENCE_ITEMS,
  Preference,
  usePreference,
} from "@/utils/usePreference";

export const Tabs = () => {
  const [preference, setPreference] = usePreference();
  const [leftPosition, setLeftPosition] = useState(3);
  const [rightPosition, setRightPosition] = useState(140);

  function setPosition({
    currentTarget,
  }: {
    currentTarget: HTMLButtonElement;
  }) {
    setLeftPosition(currentTarget.offsetLeft);
    setRightPosition(
      (currentTarget.parentElement?.offsetWidth ?? 0) -
        currentTarget.offsetLeft -
        currentTarget.offsetWidth,
    );
  }

  function setActiveItem({
    currentTarget,
  }: {
    currentTarget: HTMLButtonElement;
  }) {
    setPreference(currentTarget.innerText as Preference);
    setPosition({ currentTarget });
  }

  useLayoutEffect(() => {
    const element: HTMLButtonElement | null = document.querySelector(
      `.app-nav_item[data-tab-name="${preference}"]`,
    );

    if (element) {
      setPosition({ currentTarget: element });
    }
  }, [preference]);

  return (
    <div className="app-nav_container">
      <nav
        className="app-nav"
        style={
          {
            "--left": `${leftPosition}px`,
            "--right": `${rightPosition}px`,
          } as CSSProperties
        }
      >
        {PREFERENCE_ITEMS.map((item) => (
          <button
            key={item}
            onClick={setActiveItem}
            className={`app-nav_item ${preference === item ? "active" : ""}`}
            data-tab-name={item}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};
