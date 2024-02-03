"use client";

import { CSSProperties, useEffect, useLayoutEffect, useState } from "react";
import "./tabs.css";

const ITEMS = ["Rate", "Last added", "Year"];

export const Tabs = () => {
  const [current, setCurrent] = useState(ITEMS[0]);
  const [leftPosition, setLeftPosition] = useState(3);
  const [rightPosition, setRightPosition] = useState(140);

  function setActiveItem({
    currentTarget,
  }: {
    currentTarget: HTMLButtonElement;
  }) {
    setCurrent(currentTarget.innerText);

    setLeftPosition(currentTarget.offsetLeft);
    setRightPosition(
      (currentTarget.parentElement?.offsetWidth ?? 0) -
        currentTarget.offsetLeft -
        currentTarget.offsetWidth,
    );

    // preferences.update((prev) => ({ ...prev, tab: current }));
  }

  useLayoutEffect(() => {
    const element: HTMLButtonElement | null = document.querySelector(
      `.app-nav_item[data-tab-name="${current}"]`,
    );

    if (element) {
      setActiveItem({ currentTarget: element });
    }
  }, []);

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
        {ITEMS.map((item) => (
          <button
            key={item}
            onClick={setActiveItem}
            className={`app-nav_item ${current === item ? "active" : ""}`}
            data-tab-name={item}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};
