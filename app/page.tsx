import { GifPet } from "@/components/gif-pet";
import deno from "@/lib/animals/deno";

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <GifPet config={deno} />
    </div>
  );
}
