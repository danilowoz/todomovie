import { getMovies } from "@/utils/data";

export const Movies = async () => {
  const movies = await getMovies();

  return <div>{JSON.stringify(movies)}</div>;
};
