import { Export } from "@/components/Export";
import { Movies } from "@/components/Movies";
import { Search } from "@/components/Search";
import { Tabs } from "@/components/Tabs";
import { getMovies } from "@/utils/data";

export default async function Home() {
  const movies = await getMovies();

  return (
    <>
      <Tabs />
      <Export data={movies} />
      <Search />
      <Movies data={movies} />
    </>
  );
}
