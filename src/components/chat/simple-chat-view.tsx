'use client';

import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { ChatRequestOptions } from 'ai';
import { motion } from 'framer-motion';
import ChatMessageContent from './chat-message-content';
import ToolRenderer from './tool-renderer';

interface SimplifiedChatViewProps {
  message: unknown; // SDK version compatibility
  isLoading: boolean;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  addToolResult?: (args: { toolCallId: string; result: string }) => void;
}

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut' as const,
  },
};

export function SimplifiedChatView({
  message,
  isLoading,
  reload,
  addToolResult,
}: SimplifiedChatViewProps) {
  const m = message as { role?: unknown; parts?: unknown; content?: unknown; id?: unknown };
  if (m.role !== 'assistant') return null;

  type ToolInvocationPart = {
    type: 'tool-invocation';
    toolInvocation?: { state?: string; toolName?: string; toolCallId?: string; result?: unknown };
  };

  const isToolInvocationPart = (part: unknown): part is ToolInvocationPart => {
    if (part == null || typeof part !== 'object') return false;
    return (part as { type?: unknown }).type === 'tool-invocation';
  };

  // Extract tool invocations that are in "result" state
  const toolInvocations =
    (Array.isArray(m.parts) ? m.parts : [])
      .filter(isToolInvocationPart)
      .map((part) => part.toolInvocation)
      .filter((ti): ti is NonNullable<typeof ti> => Boolean(ti))
      .filter((ti) => ti.state === 'result');

  // Only display the first tool (if any)
  const currentTool = toolInvocations.length > 0 ? [toolInvocations[0]] : [];

  const text = typeof m.content === 'string' ? m.content : '';
  const hasTextContent = text.trim().length > 0;
  const hasTools = currentTool.length > 0;

  return (
    <motion.div {...MOTION_CONFIG} className="flex h-full w-full flex-col px-4">
      <div className="flex w-full flex-col">
        {hasTools && (
          <div className="mb-4 w-full">
            <ToolRenderer toolInvocations={currentTool} />
          </div>
        )}

        {/* Text content */}
        {hasTextContent && (
          <div className="w-full">
            <ChatBubble variant="received" className="w-full">
              <ChatBubbleMessage className="w-full">
                <ChatMessageContent
                  message={m}
                  isLast={true}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                  skipToolRendering={true}
                />
              </ChatBubbleMessage>
            </ChatBubble>
          </div>
        )}
      </div>
    </motion.div>
  );
}
