import { ChevronDown } from "@/icons/icon";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const ModelPopover = () => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant={"outline"} className={"rounded-full"}>
            Sonnet 5 <span className="text-gray-400 font-normal!">Medium</span>
            <ChevronDown />
          </Button>
        }
      />
      <PopoverContent
        side="bottom"
        className={"w-44 max-h-44 overflow-y-scroll custom-scrollbar"}
      >
        <p>ChatGPT</p>
        <p>ChatGPT</p>
        <p>ChatGPT</p>
        <p>ChatGPT</p>
        <p>Claude</p>
        <p>Claude</p>
        <p>Claude</p>
        <p>Claude</p>
        <p>Gemini</p>
        <p>Gemini</p>
        <p>Gemini</p>
        <p>Gemini</p>
        <p>DeepSeek</p>
        <p>DeepSeek</p>
      </PopoverContent>
    </Popover>
  );
};

export default ModelPopover;
