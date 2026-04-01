import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

export default function DocsPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Docs
          </p>
          <h1 className="text-3xl sm:text-4xl">Install WebPet</h1>
          <p className="text-sm text-muted-foreground">
            Install the component, download assets, and keep the folder layout
            consistent so the paths resolve correctly.
          </p>
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href="/playground">Back to playground</Link>
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Setup steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Install the component using the registry command.</li>
              <li>
                Download the assets and place them in{" "}
                <span className="text-foreground">public</span>.
              </li>
              <li>
                Do not rename the folder structure. If you do, update the asset
                paths inside the component.
              </li>
            </ol>
            <div className="max-w-md overflow-hidden rounded-2xl border border-border bg-background/60">
              <Image
                src="/images/image.png"
                alt="Public folder layout"
                width={640}
                height={360}
                className="h-auto w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
