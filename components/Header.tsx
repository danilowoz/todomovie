import "./header.css";
import { BackgroundCSS } from "./BackgroundCSS";

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <BackgroundCSS />

      <div className="app-header_title">
        <div className="container">
          <h1>
            <span>Todo</span>MOVIE
          </h1>
          <p>Don&apos;t skip one</p>
        </div>
      </div>
    </header>
  );
};
