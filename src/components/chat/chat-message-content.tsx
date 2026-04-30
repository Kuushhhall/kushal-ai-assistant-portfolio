'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

export type ChatMessageContentProps = {
  message: unknown; // SDK version compatibility
  isLast?: boolean;
  isLoading?: boolean;
  reload?: () => Promise<string | null | undefined>;
  addToolResult?: (args: { toolCallId: string; result: string }) => void;
  skipToolRendering?: boolean;
};

type TextPart = { type: 'text'; text: string };

function isTextPart(part: unknown): part is TextPart {
  if (part == null || typeof part !== 'object') return false;
  const p = part as { type?: unknown; text?: unknown };
  return p.type === 'text' && typeof p.text === 'string';
}

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Copied');
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="my-4 w-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <div className="text-muted-foreground min-w-0 text-xs">
          {language ? language : 'code'}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-7 px-2"
        >
          <Copy className="size-4" />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="custom-scrollbar overflow-x-auto px-4 py-3 text-sm leading-relaxed">
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

export default function ChatMessageContent({
  message,
}: ChatMessageContentProps) {
  const maybeParts = (message as { parts?: unknown })?.parts;
  const parts: unknown[] = Array.isArray(maybeParts) ? maybeParts : [];

  return (
    <div className="w-full">
      {parts.map((part, partIndex: number) => {
        if (!isTextPart(part) || !part.text) return null;

        return (
          <div key={partIndex} className="prose dark:prose-invert w-full">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="break-words whitespace-pre-wrap">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="my-4 list-disc pl-6">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-4 list-decimal pl-6">{children}</ol>
                ),
                li: ({ children }) => <li className="my-1">{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children, ...props }) => {
                  const raw = String(children ?? '');
                  const match = /language-(\w+)/.exec(className ?? '');
                  const language = match?.[1];

                  // Inline code
                  if (!className) {
                    return (
                      <code
                        className={cn(
                          'bg-muted rounded-md px-1 py-0.5 font-mono text-[0.875em]',
                          'text-foreground'
                        )}
                        {...props}
                      >
                        {raw}
                      </code>
                    );
                  }

                  // Block code (fenced)
                  return (
                    <CodeBlock
                      code={raw.replace(/\n$/, '')}
                      language={language}
                    />
                  );
                },
                pre: ({ children }) => <>{children}</>,
              }}
            >
              {part.text}
            </Markdown>
          </div>
        );
      })}
    </div>
  );
}
