import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversation } from "@11labs/react";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatSuggestions } from "./chat/ChatSuggestions";
import { useChat } from "@/hooks/useChat";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { motion, AnimatePresence } from "framer-motion";

export function Chatbot() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isPending,
    clearConversation
  } = useChat();

  const { isRecording, handleVoiceInput } = useSpeechRecognition((transcript) => {
    setInput(transcript);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    setIsTyping(isPending);
  }, [isPending]);

  useEffect(() => {
    const handleInitialQuery = (event: CustomEvent<string>) => {
      setInput(event.detail);
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    };

    window.addEventListener('setInitialQuery', handleInitialQuery as EventListener);
    return () => {
      window.removeEventListener('setInitialQuery', handleInitialQuery as EventListener);
    };
  }, [setInput, handleSubmit]);

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] md:h-[700px] flex flex-col bg-background shadow-lg rounded-xl">
      <ChatHeader messages={messages} />
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 md:p-6 overflow-y-auto">
        {messages.length === 1 && (
          <ChatSuggestions onSuggestionClick={(suggestion) => {
            setInput(suggestion);
            handleSubmit({ preventDefault: () => {} } as React.FormEvent);
          }} />
        )}
        <AnimatePresence>
          <div className="space-y-4 md:space-y-6">
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ChatMessage {...message} />
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-75">●</span>
                <span className="animate-pulse delay-150">●</span>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </ScrollArea>

      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        handleVoiceInput={handleVoiceInput}
        handleClearConversation={clearConversation}
        isRecording={isRecording}
        isPending={isPending}
      />
    </Card>
  );
}