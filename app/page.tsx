import { Movies } from "@/components/Movies";
import { Search } from "@/components/Search";
import { Stage } from "@/components/Stage";
import { Tabs } from "@/components/Tabs";

export default function Home() {
  return (
    <Stage>
      <Tabs />

      <Search />

      <Movies />
    </Stage>
  );
}
