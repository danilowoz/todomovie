import { Preference } from "./Todo";
import "./tabs.css";
import { CSSProperties, useLayoutEffect, useState } from "react";

export const Tabs = ({
  current,
  setCurrent,
  items,
}: {
  items: readonly Preference[];
  current: Preference;
  setCurrent: (current: Preference) => void;
}) => {
  const [leftPosition, setLeftPosition] = useState<number | undefined>();
  const [rightPosition, setRightPosition] = useState<number | undefined>();

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
    setCurrent(currentTarget.dataset.tabName as Preference);
    setPosition({ currentTarget });
  }

  useLayoutEffect(() => {
    const element: HTMLButtonElement | null = document.querySelector(
      `.app-nav_item[data-tab-name="${current}"]`,
    );

    if (element) {
      setPosition({ currentTarget: element });
    }
  }, [current]);

  return (
    <div className="app-nav_container">
      <nav
        className="app-nav"
        style={
          leftPosition
            ? ({
                "--left": `${leftPosition}px`,
                "--right": `${rightPosition}px`,
              } as CSSProperties)
            : {}
        }
      >
        {items.map((item) => (
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
