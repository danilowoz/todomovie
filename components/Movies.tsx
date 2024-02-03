import { getMovies } from "@/utils/data";

export const Movies = async () => {
  await getMovies();

  return <div></div>;
};
