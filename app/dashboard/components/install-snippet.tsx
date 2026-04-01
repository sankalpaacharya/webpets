"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";

const installCommands = {
  pnpm: "pnpm add webpet",
  npm: "npm install webpet",
  yarn: "yarn add webpet",
  bun: "bun add webpet",
};

export function InstallSnippet() {
  return (
    <div className="dashboard-enter space-y-4 text-xs text-muted-foreground">
      <Tabs defaultValue="bun" className="flex flex-col gap-4">
        <TabsList className="text-xs gap-2">
          <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          <TabsTrigger value="npm">npm</TabsTrigger>
          <TabsTrigger value="yarn">yarn</TabsTrigger>
          <TabsTrigger value="bun">bun</TabsTrigger>
        </TabsList>
        <TabsContent value="pnpm">
          <CodeBlock code={installCommands.pnpm} lang="bash" title="Terminal" />
        </TabsContent>
        <TabsContent value="npm">
          <CodeBlock code={installCommands.npm} lang="bash" title="Terminal" />
        </TabsContent>
        <TabsContent value="yarn">
          <CodeBlock code={installCommands.yarn} lang="bash" title="Terminal" />
        </TabsContent>
        <TabsContent value="bun">
          <CodeBlock code={installCommands.bun} lang="bash" title="Terminal" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
