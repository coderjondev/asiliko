"use client";

import { useState } from "react";

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

  const hasMessages = messages.length > 0;

  const handleSubmit = (content: string) => {
    if (!content.trim()) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((current) => [...current, userMessage]);

    setIsLoading(true);

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "This is a temporary AI response.",
        },
      ]);

      setIsLoading(false);
    }, 2000);
  };

  return (
    <main className="flex h-full min-h-0 w-full flex-col overflow-hidden">
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
      />
    </main>
  );
}
