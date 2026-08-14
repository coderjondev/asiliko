"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { LargeTextChoice } from "../../types/prompt-input.type";

interface PromptLargeTextDialogProps {
  open: boolean;
  characterCount: number;
  onChoice: (choice: LargeTextChoice) => void;
}

export function PromptLargeTextDialog({
  open,
  characterCount,
  onChoice,
}: PromptLargeTextDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onChoice("cancel")}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Large paste detected</DialogTitle>
          <DialogDescription>
            You pasted {characterCount.toLocaleString()} characters. That&apos;s a lot for the
            message box — attach it as a file instead so it stays readable.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button className="w-full justify-start" onClick={() => onChoice("attach-txt")}>
            Convert to a .txt attachment
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => onChoice("attach-pasted")}
          >
            Attach as pasted text file
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onChoice("cancel")}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
