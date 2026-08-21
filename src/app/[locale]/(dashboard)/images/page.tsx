"use client";

import { useRef, useState } from "react";

import { ChatInput } from "@/components/chat/chat-input";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const hasMessages = messages.length > 0;

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "API chaqiruvi o'chirildi.",
        },
      ]);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "To'xtatildi.",
          },
        ]);
        return;
      }

      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <>
      <ChatContainerRoot className="min-h-0 flex-1 overflow-y-scroll custom-scrollbar">
        <ChatContainerContent className="mx-auto w-full max-w-3xl space-y-6 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                className={
                  message.role === "user"
                    ? "max-w-[80%] rounded-2xl bg-muted px-4 py-3 text-sm"
                    : "max-w-[80%] px-1 py-2 text-sm"
                }
              >
                {message.content}
              </div>
            </div>
          ))}
        </ChatContainerContent>
      </ChatContainerRoot>

      <ChatInput
        hasMessages={hasMessages}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onStop={handleStop}
      />
    </>
  );
}
