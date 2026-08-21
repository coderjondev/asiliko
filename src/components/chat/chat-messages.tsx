"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy, Pencil, X } from "@/icons/icon";

import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatMessagesProps = {
  messages: Message[];
  hasMessages?: boolean;
  onEdit?: (id: string, newContent: string) => void;
};

type ChatMessageItemProps = {
  message: Message;
  onEdit?: (id: string, newContent: string) => void;
};

//! Collapse long user messages after reaching this height.
const USER_MESSAGE_MAX_HEIGHT = 128;

function MessageActions({
  copied,
  onCopy,
  onEdit,
}: {
  copied: boolean;
  onCopy: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              onClick={onCopy}
              className="size-8 p-0 sm:size-9"
            />
          }
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </TooltipTrigger>

        <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
      </Tooltip>

      {onEdit && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                className="size-8 p-0 sm:size-9"
              />
            }
            onClick={onEdit}
          >
            <Pencil className="size-4" />
          </TooltipTrigger>

          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function ChatMessageItem({ message, onEdit }: ChatMessageItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isUser = message.role === "user";

  //! Recalculate overflow when the message content or width changes.
  useEffect(() => {
    if (!isUser || isEditing) {
      return;
    }

    const element = contentRef.current;

    if (!element) {
      return;
    }

    let frameId: number | null = null;

    const checkOverflow = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const overflowing = element.scrollHeight > USER_MESSAGE_MAX_HEIGHT + 1;

        setIsOverflowing(overflowing);
      });
    };

    checkOverflow();

    //* Keep overflow state accurate across responsive width changes.
    const observer = new ResizeObserver(checkOverflow);

    observer.observe(element);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      observer.disconnect();
    };
  }, [message.content, isUser, isEditing]);

  //* Clear the copy timeout when the component unmounts.
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);

      setCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  //* Start editing with the current message content.
  const handleStartEdit = () => {
    setEditContent(message.content);
    setIsEditing(true);
  };

  //* Restore the original content and exit edit mode.
  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsExpanded(false);
    setIsEditing(false);
  };

  //! Prevent empty messages from being saved.
  const handleSaveEdit = () => {
    const newContent = editContent.trim();

    if (!newContent) {
      return;
    }

    onEdit?.(message.id, newContent);

    setIsExpanded(false);
    setIsEditing(false);
  };

  //* Enter saves, Shift+Enter creates a new line, and Escape cancels.
  const handleEditKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancelEdit();
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSaveEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="w-full">
        <Textarea
          value={editContent}
          onChange={(event) => setEditContent(event.target.value)}
          onKeyDown={handleEditKeyDown}
          autoFocus
          rows={5}
          className={[
            "block w-full resize-none",
            "rounded-2xl",
            "p-4 sm:p-5",
            "text-sm sm:text-base",
            "focus-visible:ring-0",
            "focus-visible:ring-offset-0",
            "focus:outline-none",
            "focus-visible:outline-none",
          ].join(" ")}
        />

        <div className="mt-2 flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs sm:gap-1.5 sm:text-sm"
                />
              }
              onClick={handleCancelEdit}
            >
              <X className="size-4" />
              Cancel
            </TooltipTrigger>

            <TooltipContent>Cancel editing</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              onClick={handleSaveEdit}
              render={
                <Button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs sm:gap-1.5 sm:text-sm"
                />
              }
            >
              <Check className="size-4" />
              Save
            </TooltipTrigger>

            <TooltipContent>Save changes</TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex w-full flex-col",
        isUser ? "items-end" : "items-start",
      ].join(" ")}
    >
      <div
        className={[
          "text-sm",

          isUser
            ? [
                "relative",
                "w-fit max-w-[92%]",
                "rounded-2xl bg-muted",
                "p-3.5 text-foreground",
                "sm:max-w-[85%]",
                "sm:p-4",
              ].join(" ")
            : "max-w-full px-1 py-2 text-foreground",
        ].join(" ")}
      >
        {isUser ? (
          <div
            ref={contentRef}
            className={[
              "whitespace-pre-wrap wrap-break-word",
              "overflow-hidden",

              //! Reserve space for the Show More/Less button.
              !isExpanded && isOverflowing ? "max-h-32 pb-8" : "max-h-none",
            ].join(" ")}
          >
            {message.content}
          </div>
        ) : (
          <div className="whitespace-pre-wrap wrap-break-word">
            {message.content}
          </div>
        )}

        {isUser && isOverflowing && (
          <Tooltip>
            <TooltipTrigger
              onClick={() => setIsExpanded((current) => !current)}
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className={[
                    "absolute right-1 bottom-1",
                    "h-7 rounded-md",
                    "px-2 py-1",
                    "text-xs font-medium",
                    "bg-muted",
                    "hover:bg-muted",
                  ].join(" ")}
                />
              }
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="ml-1 size-3.5" />
                </>
              ) : (
                <>
                  Show more
                  <ChevronDown className="ml-1 size-3.5" />
                </>
              )}
            </TooltipTrigger>

            <TooltipContent>
              {isExpanded ? "Collapse message" : "Expand message"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="mt-1 flex items-center justify-end">
        <MessageActions
          copied={copied}
          onCopy={handleCopy}
          onEdit={isUser && onEdit ? handleStartEdit : undefined}
        />
      </div>
    </div>
  );
}

export function ChatMessages({ messages, onEdit }: ChatMessagesProps) {
  return (
    <ChatContainerRoot
      className={[
        "min-h-0 flex-1",
        "overflow-y-auto overflow-x-hidden",
        "transition-[padding] duration-300",
      ].join(" ")}
    >
      <ChatContainerContent
        className={[
          "mx-auto w-full max-w-3xl",
          "space-y-4",
          "px-3 py-3",
          "sm:space-y-6",
          "sm:px-4 sm:py-4",
          "md:px-0",
        ].join(" ")}
      >
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} onEdit={onEdit} />
        ))}

        <ChatContainerScrollAnchor />
      </ChatContainerContent>
    </ChatContainerRoot>
  );
}
