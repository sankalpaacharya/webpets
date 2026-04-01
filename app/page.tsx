import Link from "next/link";
import { WebPet } from "@/components/web-pet";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-6xl min-h-[calc(100vh-4rem)] flex-col justify-center gap-12 px-6 py-20">
        <div className="dashboard-enter flex flex-1 flex-col items-center gap-6 text-center">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            A tiny world of
            <span className="block text-muted-foreground">
              friendly web pets.
            </span>
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/playground">Launch playground</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href="#features">See what's inside</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>pixel-perfect sprites</span>
            <span>zero setup</span>
            <span>calm mode</span>
          </div>
        </div>

        <div id="features" className="dashboard-card" />
      </div>

      <WebPet animal="horse" color="magical" />
      <WebPet animal="panda" color="black" />
    </div>
  );
}
