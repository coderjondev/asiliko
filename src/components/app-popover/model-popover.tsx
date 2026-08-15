import { ChevronDown } from "@/icons/icon";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const ModelPopover = () => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant={"outline"} className={"rounded-full"}>
            Sonnet 5
            <ChevronDown />
          </Button>
        }
      />
      <PopoverContent
        side="bottom"
        className={"w-44 max-h-46 gap-1 overflow-y-scroll custom-scrollbar p-1"}
      >
        <Button variant={"ghost"}>ChatGPT</Button>
      </PopoverContent>
    </Popover>
  );
};

export default ModelPopover;
