"use client";

import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { StickToBottom } from "use-stick-to-bottom";

export type ChatContainerRootProps = React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerContentProps = React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerScrollAnchorProps =
  React.HTMLAttributes<HTMLDivElement>;

function ChatContainerRoot({
  children,
  className,
  ...props
}: ChatContainerRootProps) {
  return (
    <StickToBottom
      {...props}
      className={cn("flex overflow-y-auto", className)}
      resize="smooth"
      initial="instant"
      role="log"
    >
      {children}
    </StickToBottom>
  );
}

function ChatContainerContent({
  children,
  className,
  ...props
}: ChatContainerContentProps) {
  return (
    <StickToBottom.Content
      className={cn("flex w-full flex-col", className)}
      {...props}
    >
      {children}
    </StickToBottom.Content>
  );
}

const ChatContainerScrollAnchor = forwardRef<
  HTMLDivElement,
  ChatContainerScrollAnchorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-px w-full shrink-0 scroll-mt-4", className)}
    aria-hidden="true"
    {...props}
  />
));

ChatContainerScrollAnchor.displayName = "ChatContainerScrollAnchor";

export { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor };
