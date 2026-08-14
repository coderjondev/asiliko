"use client";

import { useCallback, useMemo, useState } from "react";

import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";

import { PromptActions } from "./prompt-actions";
import { PromptToolbar } from "./prompt-toolbar";

import type { PromptMode, PromptModel } from "./index";

const MODELS: PromptModel[] = [];

function AppPromptInput() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [mode, setMode] = useState<PromptMode>("normal");
  const [files, setFiles] = useState<File[]>([]);

  const [selectedModelId, setSelectedModelId] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const canSend = useMemo(
    () => prompt.trim().length > 0 && !isLoading,
    [prompt, isLoading],
  );

  const handleSubmit = useCallback(() => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    console.log({
      prompt,
      mode,
      files,
    });

    setTimeout(() => {
      setPrompt("");
      setFiles([]);
      setIsLoading(false);
    }, 1500);
  }, [prompt, mode, files]);

  const handleToggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev);
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-3 pb-3 md:px-5 md:pb-5">
      <PromptInput
        value={prompt}
        isLoading={isLoading}
        onValueChange={setPrompt}
        onSubmit={handleSubmit}
        className="border-input bg-popover relative z-10 w-full overflow-hidden rounded-lg border p-0 shadow-xs"
      >
        <div className="flex flex-col">
          <PromptInputTextarea
            placeholder="Ask anything"
            className="custom-scrollbar min-h-13 rounded-none bg-transparent! pt-3 pl-4 text-[15px]! leading-[1.3]"
          />

          <PromptInputActions className="mt-5 flex items-center justify-between gap-2 px-3 pb-3">
            <PromptToolbar
              mode={mode}
              disabled={isLoading}
              onModeChange={setMode}
              onFilesSelected={setFiles}
            />

            <PromptActions
              models={MODELS}
              selectedModelId={selectedModelId}
              onModelSelect={setSelectedModelId}
              isRecording={isRecording}
              onToggleRecording={handleToggleRecording}
              canSend={canSend}
              onSend={handleSubmit}
            />
          </PromptInputActions>
        </div>
      </PromptInput>
    </div>
  );
}

export { AppPromptInput };
