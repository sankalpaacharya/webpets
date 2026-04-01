import Link from "next/link";

export default function CreditsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Credits
          </p>
          <h1 className="text-3xl sm:text-4xl">WebPet asset credits</h1>
          <p className="text-sm text-muted-foreground">
            The majority of assets are from{" "}
            <Link
              href="https://github.com/tonybaloney/vscode-pets"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              github.com/tonybaloney/vscode-pets
            </Link>
            .
          </p>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            The cat animations were designed by{" "}
            <Link
              href="https://seethingswarm.itch.io/catset"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              seethingswarm
            </Link>
            .
          </p>
          <p>
            The dog media assets for this extension were designed by{" "}
            <Link
              href="https://nvph-studio.itch.io/dog-animation-4-different-dogs"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              NVPH Studio
            </Link>
            .
          </p>
          <p>
            The winter theme is original artwork by{" "}
            <Link
              href="https://www.instagram.com/kianamosser/"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Kiana Mosser
            </Link>
            .
          </p>
          <p>
            The forest theme was designed by{" "}
            <Link
              href="https://edermunizz.itch.io/free-pixel-art-forest"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              edermunizz
            </Link>
            . The castle assets were created using artwork by{" "}
            <Link
              href="https://guttykreum.itch.io/gothic-castle-game-assets"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              GuttyKreum
            </Link>
            .
          </p>
          <p>
            <Link
              href="https://twitter.com/marcduiker"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Marc Duiker
            </Link>{" "}
            created the Clippy, Rocky, Zappy, rubber duck, snake, cockatiel,
            Ferris the crab, and Mod the dotnet bot media assets.
          </p>
          <p>
            <Link
              href="https://twitter.com/pixelthen"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Elthen
            </Link>{" "}
            created the fox media assets.
          </p>
          <p>
            <Link
              href="https://www.aldeka.net"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Karen Rustad Tolva
            </Link>{" "}
            designed the original concept of Ferris the crab.
          </p>
          <p>
            <Link
              href="https://github.com/kevin2huang"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Kevin Huang
            </Link>{" "}
            created the Akita inu media assets.
          </p>
          <p>
            The turtle animations were designed by enkeefe using{" "}
            <Link
              href="https://www.pixilart.com/draw"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Pixelart
            </Link>
            .
          </p>
          <p>
            The horse animations were adapted by{" "}
            <Link
              href="https://github.com/thechriskent"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Chris Kent
            </Link>{" "}
            from assets by{" "}
            <Link
              href="https://onfe.itch.io/horse-sprite-with-rider-asset-pack"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Onfe
            </Link>
            .
          </p>
          <p>
            <Link
              href="https://github.com/WoofWoof0"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Kennet Shin
            </Link>{" "}
            created the snail media assets.
          </p>
          <p>
            The frog animations were created by{" "}
            <Link
              href="https://seethingswarm.itch.io/frogpack"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              seethingswarm
            </Link>
            .
          </p>
          <p>
            <Link
              href="https://github.com/jeferris"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Jessie Ferris
            </Link>{" "}
            created the panda media assets.
          </p>
          <p>
            Squirrel animations were adapted by{" "}
            <Link
              href="https://github.com/thechriskent"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Chris Kent
            </Link>{" "}
            from assets by{" "}
            <Link
              href="https://azdner.itch.io/"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Azdner
            </Link>
            .
          </p>
          <p>
            Skeleton animations were adapted by{" "}
            <Link
              href="https://github.com/thechriskent"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Chris Kent
            </Link>{" "}
            from assets by{" "}
            <Link
              href="https://monopixelart.itch.io/"
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              MonoPixelArt
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
