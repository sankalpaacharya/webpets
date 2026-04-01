"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import {
  Copy01Icon,
  File01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type CodeBlockContextType = {
  code: string;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
});

function useCodeBlockContext() {
  const ctx = useContext(CodeBlockContext);
  if (!ctx) {
    throw new Error("useCodeBlockContext must be used within a CodeBlock");
  }
  return ctx;
}

type CodeBlockCopyButtonProps = {
  className?: string;
};

export function CodeBlockCopyButton({ className }: CodeBlockCopyButtonProps) {
  const { code } = useCodeBlockContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "rounded-md p-1 transition hover:bg-muted text-muted-foreground",
          className,
        )}
        onClick={handleCopy}
      >
        {copied ? (
          <HugeiconsIcon icon={Tick01Icon} size={18} />
        ) : (
          <HugeiconsIcon icon={Copy01Icon} size={18} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

type CodeBlockProps = {
  code: string;
  lang: BundledLanguage;
  title?: string;
  className?: string;
  theme?: string;
};

export function CodeBlock({
  code,
  lang,
  title,
  className,
  theme = "github-dark",
}: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);

  const generateHtml = useCallback(async () => {
    if (!code) {
      setHtml("<pre><code></code></pre>");
      return;
    }

    const out = await codeToHtml(code, {
      lang,
      theme,
      colorReplacements: {
        "#0d1117": "var(--background)",
        "#ffffff": "var(--background)",
      },
    });
    setHtml(out);
  }, [code, lang, theme]);

  useEffect(() => {
    generateHtml();
  }, [generateHtml]);

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <div
        className={cn(
          "relative w-full max-w-full overflow-hidden rounded-2xl border border-border bg-card/60 text-xs",
          className,
        )}
      >
        {title ? (
          <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-4 py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <HugeiconsIcon icon={File01Icon} size={16} />
              <span className="font-semibold">{title}</span>
            </div>
            <CodeBlockCopyButton />
          </div>
        ) : (
          <div className="absolute right-3 top-3 z-10">
            <CodeBlockCopyButton />
          </div>
        )}
        <div className="overflow-auto p-3 font-mono [&_.shiki]:whitespace-pre-wrap [&_.shiki]:break-words [&_.shiki]:m-0 [&_.shiki>code]:whitespace-pre-wrap [&_.shiki>code]:break-words [&>pre]:whitespace-pre-wrap [&>pre]:break-words [&>pre]:m-0">
          {html == null ? (
            <pre>
              <code>{code}</code>
            </pre>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
}
