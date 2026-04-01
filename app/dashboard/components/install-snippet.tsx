"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";

const installCommands = {
  pnpm: "pnpm add webpet",
  npm: "npm install webpet",
  yarn: "yarn add webpet",
  bun: "bun add webpet",
};

const installTabsHeader = (
  <TabsList className="text-xs gap-2">
    <TabsTrigger value="pnpm">pnpm</TabsTrigger>
    <TabsTrigger value="npm">npm</TabsTrigger>
    <TabsTrigger value="yarn">yarn</TabsTrigger>
    <TabsTrigger value="bun">bun</TabsTrigger>
  </TabsList>
);

export function InstallSnippet() {
  return (
    <div className="dashboard-enter text-xs text-muted-foreground">
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
    </div>
  );
}
