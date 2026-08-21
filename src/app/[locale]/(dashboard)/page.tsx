"use client";

import { useRef, useState } from "react";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";

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

  const handleEdit = (id: string, newContent: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id
          ? {
              ...message,
              content: newContent,
            }
          : message,
      ),
    );
  };

  return (
    <>
      <ChatMessages
        messages={messages}
        hasMessages={hasMessages}
        onEdit={handleEdit}
      />

      <ChatInput
        hasMessages={hasMessages}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onStop={handleStop}
      />
    </>
  );
}
