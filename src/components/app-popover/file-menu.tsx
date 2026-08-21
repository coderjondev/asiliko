"use client";

import { CheckIcon, Globe, Paperclip, Plus } from "@/icons/icon";
import { useFileUpload } from "@/components/ui/file-upload";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";

export default function FileMenu() {
  const { openFilePicker } = useFileUpload();

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant={"ghost"} className={"rounded-full"} />}
      >
        <Plus className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className={"w-64 flex flex-col gap-1 p-1 "}
      >
        <Button variant={"ghost"} onClick={openFilePicker}>
          <Paperclip className="size-4" />
          Add files or photos
          <Kbd className="ml-auto">Ctrl + U</Kbd>
        </Button>

        <Button variant={"ghost"}>
          <Globe className="size-4" />
          <span>Web search</span>

          <CheckIcon className="ml-auto size-4" />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
