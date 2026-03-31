import { GifPet } from "@/components/gif-pet";
import deno from "@/lib/animals/deno";
import fox from "@/lib/animals/fox-red";

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden border">
      <GifPet config={deno} />
      <GifPet config={fox} />
    </div>
  );
}
