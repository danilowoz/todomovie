import { Movies } from "@/components/Movies";
import { Search } from "@/components/Search";
import { Stage } from "@/components/Stage";
import { Tabs } from "@/components/Tabs";
import { getMovies } from "@/utils/data";

export default async function Home() {
  const movies = await getMovies();

  return (
    <Stage>
      <Tabs />
      <Search />
      <Movies data={movies} />
    </Stage>
  );
}
