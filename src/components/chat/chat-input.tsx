"use client";

import { useState } from "react";

import FileMenu from "@/components/app-popover/file-menu";
import ModelPopover from "@/components/app-popover/model-popover";
import { FilePreview } from "@/components/file-preview";
import { Button } from "@/components/ui/button";
import { FileUpload, FileUploadContent } from "@/components/ui/file-upload";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { ArrowUp, Square } from "@/icons/icon";

type ChatInputProps = {
  hasMessages: boolean;
  isLoading: boolean;
  onSubmit: (input: string, modelId?: string, files?: File[]) => void;
  onStop?: () => void;
};

export function ChatInput({
  hasMessages,
  isLoading,
  onSubmit,
  onStop,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>();

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((current) => [...current, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (isLoading) {
      return;
    }

    const value = input.trim();

    if (!value && files.length === 0) {
      return;
    }

    onSubmit(value, selectedModelId, files);

    setInput("");
    setFiles([]);
  };

  return (
    <div
      className="
        relative z-10 w-full shrink-0 pb-3
        transition-[padding] duration-300
        md:px-4
        lg:px-5
        xl:px-6
        2xl:px-8
      "
    >
      <div
        className={[
          "mx-auto flex w-full max-w-3xl flex-col items-center gap-2",
          hasMessages
            ? "p-0"
            : "flex min-h-[calc(100dvh-120px)] items-center justify-center",
        ].join(" ")}
      >
        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className={[
            "w-full p-0 shadow-sm",

            files.length > 0
              ? "rounded-xl"
              : ["rounded-2xl", "sm:rounded-full"].join(" "),
          ].join(" ")}
        >
          {files.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto p-2">
              {files.map((file, index) => (
                <FilePreview
                  key={`${file.name}-${file.lastModified}-${index}`}
                  file={file}
                  isSingle={files.length === 1}
                  onRemove={() => handleRemoveFile(index)}
                />
              ))}
            </div>
          )}

          <div className="block px-2 pt-2 md:hidden">
            <PromptInputTextarea
              className="custom-scrollbar min-h-12 rounded-none bg-transparent! px-1 pt-2"
              placeholder="Ask anything"
            />
          </div>

          <PromptInputActions className="flex items-center justify-between px-2 py-1">
            <FileUpload onFilesAdded={handleFilesAdded}>
              <FileMenu />
              <FileUploadContent />
            </FileUpload>

            <PromptInputTextarea
              className="custom-scrollbar hidden rounded-none bg-transparent! pt-3 md:block"
              placeholder="Ask anything"
            />

            <div className="flex items-center gap-2">
              <ModelPopover
                value={selectedModelId}
                onChange={(model) => setSelectedModelId(model.id)}
                disabled={isLoading}
              />

              {isLoading ? (
                <PromptInputAction
                  tooltip="Stop"
                  render={
                    <Button
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStop?.();
                      }}
                    />
                  }
                >
                  <Square className="size-4" />
                </PromptInputAction>
              ) : (
                <PromptInputAction
                  tooltip="Send"
                  render={
                    <Button
                      className="rounded-full"
                      onClick={handleSubmit}
                      disabled={!input.trim() && files.length === 0}
                    />
                  }
                >
                  <ArrowUp className="size-4" />
                </PromptInputAction>
              )}
            </div>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
}
