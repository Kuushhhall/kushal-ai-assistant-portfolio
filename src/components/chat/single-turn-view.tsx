'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChatRequestOptions } from 'ai';
import { ChevronDown, ChevronUp, Copy, RefreshCcw, Square } from 'lucide-react';
import { toast } from 'sonner';
import ChatMessageContent from './chat-message-content';
import ToolRenderer from './tool-renderer';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';

type SingleTurnViewProps = {
  userMessage: unknown | null;
  assistantMessage: unknown | null;
  isLoading: boolean;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  onStop: () => void;
  addToolResult?: (args: { toolCallId: string; result: string }) => void;
};

type TextPart = { type: 'text'; text: string };
type ToolInvocationPart = {
  type: 'tool-invocation';
  toolInvocation?: { state?: string; toolName?: string; toolCallId?: string; result?: unknown };
};

function isTextPart(part: unknown): part is TextPart {
  if (part == null || typeof part !== 'object') return false;
  const p = part as { type?: unknown; text?: unknown };
  return p.type === 'text' && typeof p.text === 'string';
}

function isToolInvocationPart(part: unknown): part is ToolInvocationPart {
  if (part == null || typeof part !== 'object') return false;
  const p = part as { type?: unknown; toolInvocation?: unknown };
  return p.type === 'tool-invocation';
}

function extractText(message: unknown): string {
  if (!message) return '';
  const m = message as { content?: unknown; parts?: unknown };
  if (typeof m.content === 'string' && m.content.trim()) return m.content;
  const parts: unknown[] = Array.isArray(m.parts) ? m.parts : [];
  return parts.filter(isTextPart).map((p) => p.text).join('\n');
}

export default function SingleTurnView({
  userMessage,
  assistantMessage,
  isLoading,
  reload,
  onStop,
  addToolResult,
}: SingleTurnViewProps) {
  const hasUserMessage = userMessage != null;
  const hasAssistantMessage = assistantMessage != null;

  const userText = hasUserMessage
    ? String((userMessage as { content?: unknown }).content ?? '').trim()
    : '';

  const toolInvocations =
    (() => {
      if (!assistantMessage) return [];
      const parts: unknown[] = Array.isArray(
        (assistantMessage as { parts?: unknown })?.parts
      )
        ? ((assistantMessage as { parts?: unknown }).parts as unknown[])
        : [];

      return parts
        .filter(isToolInvocationPart)
        .map((p) => p.toolInvocation)
        .filter((ti): ti is NonNullable<typeof ti> => Boolean(ti))
        .filter((ti) => ti.state === 'result');
    })();

  const currentTool = toolInvocations.length > 0 ? [toolInvocations[0]] : [];
  const hasTools = currentTool.length > 0;
  const hasAssistantText = extractText(assistantMessage).trim().length > 0;

  const [toolsOpen, setToolsOpen] = React.useState(true);

  const handleCopyAnswer = async () => {
    const text = extractText(assistantMessage);
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 px-4 py-6 md:py-8">
      {hasUserMessage && (
        <ChatBubble variant="sent">
          <ChatBubbleMessage className="text-sm md:text-[15px]">
            {userText}
          </ChatBubbleMessage>
        </ChatBubble>
      )}

      {hasTools && (
        <Collapsible
          open={toolsOpen}
          onOpenChange={setToolsOpen}
          className="w-full rounded-xl border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="text-sm font-medium">Tool result</div>
              <div className="text-muted-foreground text-xs">
                {currentTool[0]?.toolName ?? 'Tool'}
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="shrink-0">
                {toolsOpen ? (
                  <>
                    <ChevronUp className="size-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-4" />
                    Show
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="border-t">
            <div className="p-4">
              <ToolRenderer
                toolInvocations={currentTool}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {(assistantMessage || isLoading) && (
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-muted-foreground text-xs">Answer</div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyAnswer}
                disabled={!hasAssistantText}
              >
                <Copy className="size-4" />
                Copy
              </Button>

              {isLoading ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onStop}
                >
                  <Square className="size-4" />
                  Stop
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => reload()}
                  disabled={!assistantMessage}
                >
                  <RefreshCcw className="size-4" />
                  Regenerate
                </Button>
              )}
            </div>
          </div>

          <ChatBubble variant="received" className="w-full">
            <ChatBubbleMessage className="w-full" isLoading={isLoading}>
              {hasAssistantMessage && (
                <ChatMessageContent
                  message={assistantMessage}
                  isLast={true}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                  skipToolRendering={true}
                />
              )}
            </ChatBubbleMessage>
          </ChatBubble>
        </div>
      )}
    </div>
  );
}
