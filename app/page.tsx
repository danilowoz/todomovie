import { Todo } from "@/components/Todo";
import { getMovies } from "@/utils/data";

export default async function Home() {
  const movies = await getMovies();

  return <Todo data={movies} />;
}
