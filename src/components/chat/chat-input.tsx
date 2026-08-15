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

import { ArrowUp, Mic } from "@/icons/icon";
import { useTranslations } from "next-intl";

type ChatInputProps = {
  hasMessages: boolean;
  isLoading: boolean;
  onSubmit: (input: string) => void;
};

export function ChatInput({
  hasMessages,
  isLoading,
  onSubmit,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const t = useTranslations();

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((current) => [...current, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const value = input.trim();

    if (!value && files.length === 0) {
      return;
    }

    onSubmit(value);

    setInput("");
    setFiles([]);
  };

  return (
    <div
      className={[
        "w-full shrink-0 md:px-4",
        "transition-[padding] duration-300",
        hasMessages ? "pb-0" : "pb-0",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto w-full max-w-3xl flex flex-col items-center gap-2",
          hasMessages
            ? "p-0 px-2"
            : "flex min-h-[calc(100dvh-120px)] items-center justify-center",
        ].join(" ")}
      >
        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className="w-full rounded-xl p-0 pt-2 shadow-sm"
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

          <PromptInputTextarea
            className="custom-scrollbar rounded-none bg-transparent!"
            placeholder="Ask anything"
          />

          <PromptInputActions className="flex items-center justify-between p-2">
            <FileUpload onFilesAdded={handleFilesAdded}>
              <FileMenu />
              <FileUploadContent />
            </FileUpload>

            <div className="flex items-center gap-2.5">
              <ModelPopover />

              <PromptInputAction
                tooltip="Dictate"
                render={<Button variant="ghost" className="rounded-full" />}
              >
                <Mic className="size-4.5" />
              </PromptInputAction>

              <PromptInputAction
                tooltip="Send"
                render={<Button variant="outline" className="rounded-full" />}
              >
                <ArrowUp className="size-4.5" />
              </PromptInputAction>
            </div>
          </PromptInputActions>
        </PromptInput>
        <span className="text-sm text-gray-300">{t("disclaimer")}</span>
      </div>
    </div>
  );
}
