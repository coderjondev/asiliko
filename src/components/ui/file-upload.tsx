"use client";

import {
  ChangeEvent,
  Children,
  cloneElement,
  ComponentPropsWithoutRef,
  createContext,
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import { Button } from "./button";

type FileUploadContextValue = {
  isDragging: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  multiple: boolean;
  disabled: boolean;
  openFilePicker: () => void;
};

const FileUploadContext = createContext<FileUploadContextValue | null>(null);

export type FileUploadProps = {
  onFilesAdded: (files: File[]) => void;
  children: ReactNode;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  className?: string;
};

export function useFileUpload() {
  const context = useContext(FileUploadContext);

  if (!context) {
    throw new Error("useFileUpload must be used inside FileUpload");
  }

  return context;
}

function FileUpload({
  onFilesAdded,
  children,
  multiple = true,
  accept,
  disabled = false,
  className,
}: FileUploadProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList) => {
      const newFiles = Array.from(files);

      onFilesAdded(multiple ? newFiles : newFiles.slice(0, 1));
    },
    [multiple, onFilesAdded],
  );

  useEffect(() => {
    const node = rootRef.current;

    if (!node || disabled) {
      return;
    }

    const handleDrag = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDragEnter = (event: DragEvent) => {
      handleDrag(event);

      dragCounter.current += 1;

      if (event.dataTransfer?.items.length) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (event: DragEvent) => {
      handleDrag(event);

      dragCounter.current = Math.max(0, dragCounter.current - 1);

      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDrop = (event: DragEvent) => {
      handleDrag(event);

      dragCounter.current = 0;
      setIsDragging(false);

      if (event.dataTransfer?.files.length) {
        handleFiles(event.dataTransfer.files);
      }
    };

    node.addEventListener("dragenter", handleDragEnter);
    node.addEventListener("dragleave", handleDragLeave);
    node.addEventListener("dragover", handleDrag);
    node.addEventListener("drop", handleDrop);

    return () => {
      node.removeEventListener("dragenter", handleDragEnter);
      node.removeEventListener("dragleave", handleDragLeave);
      node.removeEventListener("dragover", handleDrag);
      node.removeEventListener("drop", handleDrop);
    };
  }, [disabled, handleFiles]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    handleFiles(event.target.files);

    event.target.value = "";
  };

  return (
    <FileUploadContext.Provider
      value={{
        isDragging,
        inputRef,
        multiple,
        disabled,
        openFilePicker: () => {
          if (!disabled) {
            inputRef.current?.click();
          }
        },
      }}
    >
      <div ref={rootRef} className={cn("contents", className)}>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          aria-hidden="true"
          onChange={handleFileSelect}
        />

        {children}
      </div>
    </FileUploadContext.Provider>
  );
}

export type FileUploadTriggerProps = ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

function FileUploadTrigger({
  asChild = false,
  className,
  children,
  ...props
}: FileUploadTriggerProps) {
  const context = useContext(FileUploadContext);

  const isDisabled = context?.disabled ?? false;

  const handleClick = () => {
    if (isDisabled) {
      return;
    }

    context?.inputRef.current?.click();
  };

  if (asChild) {
    const child = Children.only(children) as ReactElement<
      HTMLAttributes<HTMLElement>
    >;

    const childOnClick = child.props.onClick;

    return cloneElement(child, {
      ...props,
      role: "button",
      "aria-disabled": isDisabled,
      className: cn(className, child.props.className),
      onClick: (event: MouseEvent<HTMLElement>) => {
        if (!isDisabled) {
          handleClick();
        }

        childOnClick?.(event);
      },
    });
  }

  return (
    <Button
      {...props}
      type="button"
      className={className}
      disabled={isDisabled}
      onClick={handleClick}
      variant={"ghost"}
    >
      {children}
    </Button>
  );
}

export type FileUploadContentProps = HTMLAttributes<HTMLDivElement>;

function FileUploadContent({ className, ...props }: FileUploadContentProps) {
  const context = useContext(FileUploadContext);

  if (!context?.isDragging || context.disabled) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      {...props}
      className={cn(
        "bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm",
        "animate-in fade-in-0 slide-in-from-bottom-10 zoom-in-90 duration-150",
        className,
      )}
    />,
    document.body,
  );
}

export { FileUpload, FileUploadTrigger, FileUploadContent };
