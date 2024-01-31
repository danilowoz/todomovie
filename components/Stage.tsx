import "./stage.css";

export const Stage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="container">
      <div className="stage">{children}</div>
    </div>
  );
};
