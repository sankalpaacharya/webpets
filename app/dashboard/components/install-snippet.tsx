"use client";

import { useState } from "react";
import JSZip from "jszip";

import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INSTALL_COMMANDS, PACKAGE_MANAGERS } from "@/lib/install-commands";
import { petGifFileName } from "@/lib/pet-media";

type InstallSnippetProps = {
  animal: string;
  color: string;
  actions: string[];
};

async function zipAssets(animal: string, color: string, actions: string[]) {
  const zip = new JSZip();
  const folder = zip.folder("media")?.folder(animal);
  if (!folder) return null;

  await Promise.all(
    actions.map(async (action) => {
      const name = petGifFileName(color, action);
      const response = await fetch(`/media/${animal}/${name}`);
      if (response.ok) folder.file(name, await response.blob());
    }),
  );

  return zip.generateAsync({ type: "blob" });
}

export function InstallSnippet({ animal, color, actions }: InstallSnippetProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!animal || !color) return;
    setDownloading(true);
    try {
      const blob = await zipAssets(animal, color, actions);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${animal}-${color}-assets.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Install</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={downloading}
        >
          <HugeiconsIcon icon={Download01Icon} size={16} />
          {downloading ? "Zipping…" : "Download GIFs"}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bun">
          <TabsList>
            {PACKAGE_MANAGERS.map((pm) => (
              <TabsTrigger key={pm} value={pm}>
                {pm}
              </TabsTrigger>
            ))}
          </TabsList>
          {PACKAGE_MANAGERS.map((pm) => (
            <TabsContent key={pm} value={pm} className="mt-3">
              <CodeBlock code={INSTALL_COMMANDS[pm]} lang="bash" />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
