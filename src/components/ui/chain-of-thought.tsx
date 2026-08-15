"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown, Circle } from "@/icons/icon";
import {
  Children,
  cloneElement,
  ComponentProps,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";

export type ChainOfThoughtItemProps = ComponentProps<"div">;

export const ChainOfThoughtItem = ({
  children,
  className,
  ...props
}: ChainOfThoughtItemProps) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props}>
    {children}
  </div>
);

export type ChainOfThoughtTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
> & {
  leftIcon?: ReactNode;
  swapIconOnHover?: boolean;
};

export const ChainOfThoughtTrigger = ({
  children,
  className,
  leftIcon,
  swapIconOnHover = true,
  ...props
}: ChainOfThoughtTriggerProps) => (
  <CollapsibleTrigger
    className={cn(
      "group text-muted-foreground hover:text-foreground flex cursor-pointer items-center justify-start gap-1 text-left text-sm transition-colors",
      className,
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      {leftIcon ? (
        <span className="relative inline-flex size-4 items-center justify-center">
          <span
            className={cn(
              "transition-opacity",
              swapIconOnHover && "group-hover:opacity-0",
            )}
          >
            {leftIcon}
          </span>

          {swapIconOnHover && (
            <ChevronDown className="absolute size-4 opacity-0 transition-opacity group-hover:opacity-100 group-data-[state=open]:rotate-180" />
          )}
        </span>
      ) : (
        <span className="relative inline-flex size-4 items-center justify-center">
          <Circle className="size-2 fill-current" />
        </span>
      )}

      <span>{children}</span>
    </div>

    {!leftIcon && (
      <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
    )}
  </CollapsibleTrigger>
);

export type ChainOfThoughtContentProps = ComponentProps<
  typeof CollapsibleContent
>;

export const ChainOfThoughtContent = ({
  children,
  className,
  ...props
}: ChainOfThoughtContentProps) => (
  <CollapsibleContent
    className={cn(
      "text-popover-foreground data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden",
      className,
    )}
    {...props}
  >
    <div className="grid grid-cols-[min-content_minmax(0,1fr)] gap-x-4">
      <div className="bg-primary/20 ml-1.75 h-full w-px group-data-[last=true]:bg-transparent" />

      <div className="mt-2 space-y-2">{children}</div>
    </div>
  </CollapsibleContent>
);

export type ChainOfThoughtProps = ComponentProps<"div">;

export function ChainOfThought({
  children,
  className,
  ...props
}: ChainOfThoughtProps) {
  const childrenArray = Children.toArray(children);

  const lastStepIndex = childrenArray.reduce<number>(
    (lastIndex, child, index) =>
      isValidElement(child) && child.type === ChainOfThoughtStep
        ? index
        : lastIndex,
    -1,
  );

  return (
    <div className={cn("space-y-0", className)} {...props}>
      {childrenArray.map((child, index) => {
        if (isValidElement(child) && child.type === ChainOfThoughtStep) {
          return cloneElement(child as ReactElement<ChainOfThoughtStepProps>, {
            isLast: index === lastStepIndex,
          });
        }

        return <Fragment key={index}>{child}</Fragment>;
      })}
    </div>
  );
}

export type ChainOfThoughtStepProps = Omit<
  ComponentProps<typeof Collapsible>,
  "children" | "className"
> & {
  children: ReactNode;
  className?: string;
  isLast?: boolean;
};

export const ChainOfThoughtStep = ({
  children,
  className,
  isLast = false,
  ...props
}: ChainOfThoughtStepProps) => (
  <Collapsible {...props} className={cn("group", className)} data-last={isLast}>
    {children}

    <div className="flex justify-start group-data-[last=true]:hidden">
      <div className="bg-primary/20 ml-1.75 h-4 w-px" />
    </div>
  </Collapsible>
);
