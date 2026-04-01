import { GifPet } from "@/components/gif-pet";

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden border">
      <GifPet animal="deno" color="green" />
      <GifPet animal="fox" color="red" />
    </div>
  );
}
