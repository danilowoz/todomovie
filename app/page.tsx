import { Todo } from "@/components/Todo";
import { getMovies } from "@/utils/data";
import { Suspense } from "react";

export default async function Home() {
  const movies = await getMovies();

  return (
    <Suspense>
      <Todo data={movies} />
    </Suspense>
  );
}
