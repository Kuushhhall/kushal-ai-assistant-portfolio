'use client';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import WelcomeModal from '@/components/welcome-modal';
import { Info } from 'lucide-react';
import { GithubButton } from '../ui/github-button';
import HelperBoost from './HelperBoost';
import SingleTurnView from './single-turn-view';
import GraphDialog from '@/components/graph/graph-dialog';

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const Avatar: React.FC<AvatarProps> = ({ hasActiveTool, videoRef }) => {
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    const detectIOS = () => {
      const userAgent = window.navigator.userAgent;
      const platform = window.navigator.platform;
      const maxTouchPoints = window.navigator.maxTouchPoints || 0;
      const msStream = (window as unknown as { MSStream?: unknown }).MSStream;

      const isIOSByUA = /iPad|iPhone|iPod/.test(userAgent) && !msStream;
      const isIOSByPlatform = /iPad|iPhone|iPod/.test(platform);
      const isIPadOS =
        platform === 'MacIntel' && maxTouchPoints > 1 && !msStream;
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);

      return isIOSByUA || isIOSByPlatform || isIPadOS || isSafari;
    };

    setIsIOSDevice(detectIOS());
  }, []);

  return (
    <div
      className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
    >
      <div
        className="relative cursor-pointer"
        onClick={() => (window.location.href = '/')}
      >
        {isIOSDevice ? (
          <Image
            src="/landing_page_memoji.png"
            alt="iOS avatar"
            width={512}
            height={512}
            priority
            className="h-full w-full scale-[1.8] object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full scale-[1.8] object-contain"
            muted
            playsInline
            loop
          >
            <source src="/final_memojis.webm" type="video/webm" />
            <source src="/final_memojis_ios.mp4" type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut' as const,
  },
};

const Chat = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const submittedRef = useRef(false); // Prevent duplicate submissions
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    isLoading,
    stop,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
        setIsTalking(true);
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error('Failed to play video:', error);
          });
        }
      }
    },
    onFinish: () => {
      setLoadingSubmit(false);
      setIsTalking(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    onError: (error) => {
      setLoadingSubmit(false);
      setIsTalking(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      console.error('Chat error:', error.message, error.cause);
      toast.error(`Error: ${error.message}`);
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            part.type === 'tool-invocation' &&
            part.toolInvocation?.state === 'result'
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state !== 'result'
      )
  );

  const submitQuery = React.useCallback((query: string) => {
    if (!query.trim() || isToolInProgress) return;
    setLoadingSubmit(true);
    append({
      role: 'user',
      content: query,
    });
  }, [append, isToolInProgress]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.pause();
    }

    if (initialQuery && !autoSubmitted && !submittedRef.current) {
      submittedRef.current = true;
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted, setInput, submitQuery]);

  useEffect(() => {
    if (videoRef.current) {
      if (isTalking) {
        videoRef.current.play().catch((error) => {
          console.error('Failed to play video:', error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isTalking]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQuery(input);
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
    setIsTalking(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Header */}
      <header className="sticky top-0 z-[50] border-b bg-background/80 backdrop-blur-md">
        <div className="relative mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <GraphDialog />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Avatar hasActiveTool={hasActiveTool} videoRef={videoRef} />
          </div>

          <div className="flex items-center gap-2">
            <WelcomeModal
              trigger={
                <button
                  type="button"
                  className="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
                  aria-label="About this chat"
                >
                  <Info className="h-5 w-5" />
                </button>
              }
            />
            <GithubButton
              animationDuration={1.5}
              label="Star"
              size={'sm'}
              repoUrl="https://github.com/Kuushhhall"
            />
          </div>
        </div>
      </header>

      {/* Main (single scroll region) */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-[calc(100dvh-220px)] items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding submitQuery={submitQuery} />
              </motion.div>
            ) : currentAIMessage ? (
              <motion.div key="turn" {...MOTION_CONFIG}>
                <SingleTurnView
                  userMessage={latestUserMessage}
                  assistantMessage={currentAIMessage}
                  isLoading={isLoading}
                  reload={reload}
                  onStop={handleStop}
                  addToolResult={addToolResult}
                />
              </motion.div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-[18px]"
                >
                  <SingleTurnView
                    userMessage={latestUserMessage}
                    assistantMessage={null}
                    isLoading={true}
                    reload={reload}
                    onStop={handleStop}
                  />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-[40] border-t bg-background/90 backdrop-blur-md">
        <div className="mx-auto w-full max-w-3xl px-2 pt-3 md:px-0">
          <div className="flex flex-col items-center gap-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
            <HelperBoost submitQuery={submitQuery} />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
