"use client";

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatMessagesProps = {
  messages: Message[];
  hasMessages: boolean;
};

export function ChatMessages({ messages, hasMessages }: ChatMessagesProps) {
  return (
    <ChatContainerRoot
      className={[
        "absolute inset-x-0 top-0 h-full overflow-hidden transition-[padding] duration-300",
        hasMessages ? "pb-36" : "pb-0",
      ].join(" ")}
    >
      <ChatContainerContent
        className={["mx-auto w-full max-w-3xl", "space-y-6", "py-6"].join(
          " ",
        )}
      >
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
                  ? "max-w-[80%] rounded-2xl bg-muted py-3 text-sm"
                  : "max-w-[80%] py-2 text-sm"
              }
            >
              {message.content}
            </div>
          </div>
        ))}
      </ChatContainerContent>
    </ChatContainerRoot>
  );
}
