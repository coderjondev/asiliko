"use client";

import {
  CheckIcon,
  ChevronRight,
  FolderGit,
  Globe,
  Plug,
  Plus,
} from "@/icons/icon";
import { useFileUpload } from "@/components/ui/file-upload";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

export default function FileMenu() {
  const { openFilePicker } = useFileUpload();

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant={"ghost"} className={"rounded-lg"} />}
      >
        <Plus className="size-4.5" />
      </PopoverTrigger>
      <PopoverContent align="start" side="top">
        <Button onClick={openFilePicker}></Button>
        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent"
        >
          <FolderGit className="size-4" />
          <span>Add to project</span>

          <ChevronRight className="ml-auto size-4" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent"
        >
          <span>Skills</span>
          <ChevronRight className="ml-auto size-4" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent"
        >
          <span>Connectors</span>
          <ChevronRight className="ml-auto size-4" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent"
        >
          <Plug className="size-4" />
          <span>Add plugins...</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent"
        >
          <Globe className="size-4" />
          <span>Web search</span>

          <CheckIcon className="ml-auto size-4" />
        </button>
      </PopoverContent>
    </Popover>
  );
}
