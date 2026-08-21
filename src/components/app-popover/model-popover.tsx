"use client";

import { useMemo, useState } from "react";

import { ChevronDown } from "@/icons/icon";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Model = {
  id: string;
  object: string;
  brandName: string;
};

const MOCK_MODELS: Model[] = [
  { id: "gpt-4o", object: "model", brandName: "Fable 5" },
  { id: "gpt-4o-mini", object: "model", brandName: "Opus 5" },
  { id: "claude-5-sonnet", object: "model", brandName: "Sonnet 5" },
  { id: "claude-4.5-haiku", object: "model", brandName: "Haiku 4.5" },
];

type ModelPopoverProps = {
  value?: string;
  onChange?: (model: Model) => void;
  disabled?: boolean;
};

const ModelPopover = ({ value, onChange, disabled }: ModelPopoverProps) => {
  const [models] = useState<Model[]>(MOCK_MODELS);
  const [open, setOpen] = useState(false);

  const selectedModel = useMemo(() => {
    if (!models.length) return null;
    return (
      (value ? models.find((item) => item.id === value) : models[0]) ?? null
    );
  }, [models, value]);

  const modelName = selectedModel?.brandName ?? "Select model";

  const handleSelect = (model: Model) => {
    onChange?.(model);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="ghost" className="rounded-lg" disabled={disabled} />
        }
      >
        {modelName}
        <ChevronDown />
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        className="w-50 max-h-72 gap-1 overflow-y-scroll custom-scrollbar p-1"
      >
        {models.length === 0 && (
          <div className="p-2 text-sm text-muted-foreground">
            Modellar topilmadi
          </div>
        )}

        {models.map((model) => {
          const isSelected = selectedModel?.id === model.id;

          return (
            <Button
              key={model.id}
              variant={isSelected ? "secondary" : "ghost"}
              className="w-full justify-start h-auto py-2"
              onClick={() => handleSelect(model)}
            >
              <span>{model.brandName}</span>
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default ModelPopover;
