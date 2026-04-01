"use client";

import { useMemo, useState } from "react";
import JSZip from "jszip";

import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";

const registryUrl = "./registry.json";

const installCommands = {
  pnpm: `pnpm dlx shadcn@latest add https://webpets-flame.vercel.app/r/web-pet.json`,
  npm: `npx shadcn@latest add https://webpets-flame.vercel.app/r/web-pet.json`,
  yarn: `yarn dlx shadcn@latest add https://webpets-flame.vercel.app/r/web-pet.json`,
  bun: `bunx --bun shadcn@latest add https://webpets-flame.vercel.app/r/web-pet.json`,
};

type InstallSnippetProps = {
  animal: string;
  color: string;
  actions: string[];
};

export function InstallSnippet({
  animal,
  color,
  actions,
}: InstallSnippetProps) {
  const [downloading, setDownloading] = useState(false);
  const fileNames = useMemo(
    () =>
      actions.map((action) => ({
        action,
        name: `${color}_${action}_8fps.gif`,
      })),
    [actions, color],
  );

  const handleDownload = async () => {
    if (!animal || !color) return;
    setDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("media")?.folder(animal);
      if (!folder) return;

      await Promise.all(
        fileNames.map(async ({ action, name }) => {
          const response = await fetch(
            `/media/${animal}/${color}_${action}_8fps.gif`,
          );
          if (!response.ok) return;
          const blob = await response.blob();
          folder.file(name, blob);
        }),
      );

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${animal}-${color}-assets.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const installTabsHeader = (
    <TabsList className="text-xs gap-2">
      <TabsTrigger value="pnpm">pnpm</TabsTrigger>
      <TabsTrigger value="npm">npm</TabsTrigger>
      <TabsTrigger value="yarn">yarn</TabsTrigger>
      <TabsTrigger value="bun">bun</TabsTrigger>
    </TabsList>
  );

  return (
    <Card className="dashboard-enter">
      <CardHeader className="pb-3">
        <CardTitle>Install</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <Button
            variant="outline"
            size="sm"
            className="px-3"
            onClick={handleDownload}
            disabled={downloading}
          >
            <HugeiconsIcon icon={Download01Icon} size={16} />
            {downloading ? "Zipping" : "Download assets"}
          </Button>
        </div>
        <Tabs defaultValue="bun" className="flex flex-col gap-3">
          <TabsContent value="pnpm">
            <CodeBlock
              code={installCommands.pnpm}
              lang="bash"
              header={installTabsHeader}
            />
          </TabsContent>
          <TabsContent value="npm">
            <CodeBlock
              code={installCommands.npm}
              lang="bash"
              header={installTabsHeader}
            />
          </TabsContent>
          <TabsContent value="yarn">
            <CodeBlock
              code={installCommands.yarn}
              lang="bash"
              header={installTabsHeader}
            />
          </TabsContent>
          <TabsContent value="bun">
            <CodeBlock
              code={installCommands.bun}
              lang="bash"
              header={installTabsHeader}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
