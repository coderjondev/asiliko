"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { ChevronDown } from "@/icons/icon";
import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useStickToBottomContext } from "use-stick-to-bottom";

export type ScrollButtonProps = {
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
} & ButtonHTMLAttributes<HTMLButtonElement>;

function ScrollButton({
  className,
  variant = "outline",
  size = "sm",
  onClick,
  ...props
}: ScrollButtonProps) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    scrollToBottom();
    onClick?.(event);
  };

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      className={cn(
        "h-10 w-10 rounded-full transition-all duration-150 ease-out",
        {
          "translate-y-0 scale-100 opacity-100": !isAtBottom,
          "pointer-events-none translate-y-4 scale-95 opacity-0": isAtBottom,
        },
        className,
      )}
      onClick={handleClick}
      aria-label="Scroll to bottom"
      disabled={isAtBottom}
    >
      <ChevronDown className="h-4.5 w-4.5" />
    </Button>
  );
}

export { ScrollButton };
