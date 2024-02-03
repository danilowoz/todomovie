import { getMovieIDS } from "@/utils/data";

export const Movies = async () => {
  const movies = await getMovieIDS();

  return <div>{JSON.stringify(movies)}</div>;
};
