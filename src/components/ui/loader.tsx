"use client";

import { cn } from "@/lib/utils";

export interface LoaderProps {
  variant?:
    | "circular"
    | "classic"
    | "pulse"
    | "pulse-dot"
    | "dots"
    | "typing"
    | "wave"
    | "bars"
    | "terminal"
    | "text-blink"
    | "text-shimmer"
    | "loading-dots";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

type LoaderSize = "sm" | "md" | "lg";

const ICON_SIZE_CLASSES: Record<LoaderSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const CONTAINER_SIZE_CLASSES: Record<LoaderSize, string> = {
  sm: "h-4",
  md: "h-5",
  lg: "h-6",
};

const TEXT_SIZE_CLASSES: Record<LoaderSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function CircularLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      className={cn(
        "border-primary animate-spin rounded-full border-2 border-t-transparent",
        ICON_SIZE_CLASSES[size],
        className,
      )}
    >
      <span className="sr-only">Loading</span>
    </div>
  );
}

const CLASSIC_BAR_SIZES: Record<LoaderSize, { height: string; width: string }> =
  {
    sm: { height: "6px", width: "1.5px" },
    md: { height: "8px", width: "2px" },
    lg: { height: "10px", width: "2.5px" },
  };

const CLASSIC_CONTAINER_PX: Record<LoaderSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const CLASSIC_BAR_GEOMETRY: Record<
  LoaderSize,
  {
    marginLeft: string;
    originX: string;
  }
> = {
  sm: { marginLeft: "-0.75px", originX: "0.75px" },
  md: { marginLeft: "-1px", originX: "1px" },
  lg: { marginLeft: "-1.25px", originX: "1.25px" },
};

export function ClassicLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: LoaderSize;
}) {
  const geometry = CLASSIC_BAR_GEOMETRY[size];
  const bar = CLASSIC_BAR_SIZES[size];
  const originY = CLASSIC_CONTAINER_PX[size] / 2;

  return (
    <div className={cn("relative", ICON_SIZE_CLASSES[size], className)}>
      <div className="absolute h-full w-full">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-primary absolute animate-[spinner-fade_1.2s_linear_infinite] rounded-full"
            style={{
              top: "0",
              left: "50%",
              marginLeft: geometry.marginLeft,
              transformOrigin: `${geometry.originX} ${originY}px`,
              transform: `rotate(${i * 30}deg)`,
              opacity: 0,
              animationDelay: `${i * 0.1}s`,
              height: bar.height,
              width: bar.width,
            }}
          />
        ))}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function PulseLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div className={cn("relative", ICON_SIZE_CLASSES[size], className)}>
      <div className="border-primary absolute inset-0 animate-[thin-pulse_1.5s_ease-in-out_infinite] rounded-full border-2" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

const PULSE_DOT_SIZES: Record<LoaderSize, string> = {
  sm: "size-1",
  md: "size-2",
  lg: "size-3",
};

export function PulseDotLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      role="status"
      className={cn(
        "bg-primary animate-[pulse-dot_1.2s_ease-in-out_infinite] rounded-full",
        PULSE_DOT_SIZES[size],
        className,
      )}
    >
      <span className="sr-only">Loading</span>
    </div>
  );
}

const DOT_SIZES: Record<LoaderSize, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

export function DotsLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center space-x-1",
        CONTAINER_SIZE_CLASSES[size],
        className,
      )}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary animate-[bounce-dots_1.4s_ease-in-out_infinite] rounded-full",
            DOT_SIZES[size],
          )}
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

const TYPING_DOT_SIZES: Record<LoaderSize, string> = {
  sm: "h-1 w-1",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
};

export function TypingLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center space-x-1",
        CONTAINER_SIZE_CLASSES[size],
        className,
      )}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary animate-[typing_1s_infinite] rounded-full",
            TYPING_DOT_SIZES[size],
          )}
          style={{ animationDelay: `${i * 250}ms` }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

const WAVE_BAR_WIDTHS: Record<LoaderSize, string> = {
  sm: "w-0.5",
  md: "w-0.5",
  lg: "w-1",
};

const WAVE_HEIGHTS: Record<LoaderSize, string[]> = {
  sm: ["6px", "9px", "12px", "9px", "6px"],
  md: ["8px", "12px", "16px", "12px", "8px"],
  lg: ["10px", "15px", "20px", "15px", "10px"],
};

export function WaveLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-0.5",
        CONTAINER_SIZE_CLASSES[size],
        className,
      )}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary animate-[wave_1s_ease-in-out_infinite] rounded-full",
            WAVE_BAR_WIDTHS[size],
          )}
          style={{
            animationDelay: `${i * 100}ms`,
            height: WAVE_HEIGHTS[size][i],
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

const BARS_WIDTHS: Record<LoaderSize, string> = {
  sm: "w-1",
  md: "w-1.5",
  lg: "w-2",
};

const BARS_CONTAINER_SIZES: Record<LoaderSize, string> = {
  sm: "h-4 gap-1",
  md: "h-5 gap-1.5",
  lg: "h-6 gap-2",
};

export function BarsLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      role="status"
      className={cn("flex", BARS_CONTAINER_SIZES[size], className)}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary h-full animate-[wave-bars_1.2s_ease-in-out_infinite]",
            BARS_WIDTHS[size],
          )}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

const TERMINAL_CURSOR_SIZES: Record<LoaderSize, string> = {
  sm: "h-3 w-1.5",
  md: "h-4 w-2",
  lg: "h-5 w-2.5",
};

export function TerminalLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center space-x-1",
        CONTAINER_SIZE_CLASSES[size],
        className,
      )}
    >
      <span className={cn("text-primary font-mono", TEXT_SIZE_CLASSES[size])}>
        {">"}
      </span>
      <div
        className={cn(
          "bg-primary animate-[blink_1s_step-end_infinite]",
          TERMINAL_CURSOR_SIZES[size],
        )}
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TextBlinkLoader({
  text = "Thinking",
  className,
  size = "md",
}: {
  text?: string;
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      role="status"
      className={cn(
        "animate-[text-blink_2s_ease-in-out_infinite] font-medium",
        TEXT_SIZE_CLASSES[size],
        className,
      )}
    >
      {text}
    </div>
  );
}

export function TextShimmerLoader({
  text = "Thinking",
  className,
  size = "md",
}: {
  text?: string;
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      role="status"
      className={cn(
        "bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)]",
        "bg-size-[200%_auto] bg-clip-text font-medium text-transparent",
        "animate-[shimmer_4s_infinite_linear]",
        TEXT_SIZE_CLASSES[size],
        className,
      )}
    >
      {text}
    </div>
  );
}

export function TextDotsLoader({
  className,
  text = "Thinking",
  size = "md",
}: {
  className?: string;
  text?: string;
  size?: LoaderSize;
}) {
  return (
    <div role="status" className={cn("inline-flex items-center", className)}>
      <span className={cn("text-primary font-medium", TEXT_SIZE_CLASSES[size])}>
        {text}
      </span>
      <span className="inline-flex">
        <span
          className={cn(
            "text-primary animate-[loading-dots_1.4s_infinite_0.2s]",
            TEXT_SIZE_CLASSES[size],
          )}
        >
          .
        </span>
        <span
          className={cn(
            "text-primary animate-[loading-dots_1.4s_infinite_0.4s]",
            TEXT_SIZE_CLASSES[size],
          )}
        >
          .
        </span>
        <span
          className={cn(
            "text-primary animate-[loading-dots_1.4s_infinite_0.6s]",
            TEXT_SIZE_CLASSES[size],
          )}
        >
          .
        </span>
      </span>
    </div>
  );
}

function Loader({
  variant = "circular",
  size = "md",
  text,
  className,
}: LoaderProps) {
  switch (variant) {
    case "circular":
      return <CircularLoader size={size} className={className} />;
    case "classic":
      return <ClassicLoader size={size} className={className} />;
    case "pulse":
      return <PulseLoader size={size} className={className} />;
    case "pulse-dot":
      return <PulseDotLoader size={size} className={className} />;
    case "dots":
      return <DotsLoader size={size} className={className} />;
    case "typing":
      return <TypingLoader size={size} className={className} />;
    case "wave":
      return <WaveLoader size={size} className={className} />;
    case "bars":
      return <BarsLoader size={size} className={className} />;
    case "terminal":
      return <TerminalLoader size={size} className={className} />;
    case "text-blink":
      return <TextBlinkLoader text={text} size={size} className={className} />;
    case "text-shimmer":
      return (
        <TextShimmerLoader text={text} size={size} className={className} />
      );
    case "loading-dots":
      return <TextDotsLoader text={text} size={size} className={className} />;
    default: {
      const _exhaustiveCheck: never = variant;
      return _exhaustiveCheck;
    }
  }
}

export { Loader };
