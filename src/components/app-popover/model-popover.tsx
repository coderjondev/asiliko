"use client";

import { useEffect, useMemo, useState } from "react";

import { ChevronDown } from "@/icons/icon";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Model = {
  id: string;
  object: string;
  brandName: string;
  description?: string;
};

type ModelsResponse = {
  data: Model[];
};

type ModelPopoverProps = {
  value?: string;
  onChange?: (model: Model) => void;
  disabled?: boolean;
};

const ModelPopover = ({ value, onChange }: ModelPopoverProps) => {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadModels = async () => {
      try {
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }

        const data: ModelsResponse = await response.json();

        if (!cancelled) {
          setModels(data.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load models:", err);
        if (!cancelled) {
          setError("Modellarni yuklab bo'lmadi");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadModels();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedModel = useMemo(() => {
    if (!models.length) return null;
    return (
      (value ? models.find((item) => item.id === value) : models[0]) ?? null
    );
  }, [models, value]);

  const modelName = selectedModel?.brandName ?? "Select model";

  const handleSelect = (model: Model) => {
    onChange?.(model);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" className="rounded-lg" disabled={isLoading}>
            {isLoading ? (
              <span className="h-7 w-30 animate-pulse rounded bg-muted-foreground/20 inline-block" />
            ) : error ? (
              "Error"
            ) : (
              modelName
            )}
            <ChevronDown />
          </Button>
        }
      />

      <PopoverContent
        side="bottom"
        align="end"
        className="w-68 max-h-72 gap-1 overflow-y-scroll custom-scrollbar p-1"
      >
        {error && <div className="p-2 text-sm text-destructive">{error}</div>}

        {!isLoading && !error && models.length === 0 && (
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
              <div className="flex flex-col items-start">
                <span>{model.brandName}</span>
                {model.description && (
                  <span className="text-xs text-muted-foreground font-normal">
                    {model.description}
                  </span>
                )}
              </div>
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default ModelPopover;
