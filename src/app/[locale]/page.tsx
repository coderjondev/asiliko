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

    try {
      const response = await fetch(
        "http://localhost:20128/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OMNIROUTE_API_KEY}`,
          },
          body: JSON.stringify({
            model: "kr/claude-sonnet-4.5",
            messages: [
              {
                role: "user",
                content,
              },
            ],
            stream: false,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message || data?.error || "OmniRoute request failed",
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.choices?.[0]?.message?.content ?? "",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "API request failed.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
