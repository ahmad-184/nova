"use client";

import { useRef } from "react";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/shared/components/ui/input";

interface SearchInputProps {
  className?: string;
  inputClassName?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function SearchInput({
  className,
  inputClassName,
  onChange,
  value,
  defaultValue,
  placeholder,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn("max-w-md flex-1 rounded-sm", className)}
      onClick={handleFocus}
    >
      <div className="focus-within:ring-2 rounded-sm focus-within:ring-blue-500/50 transition-[color,box-shadow] px-2 overflow-hidden flex items-center h-fit border gap-2">
        <SearchIcon className="w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder ?? "Search..."}
          className={cn(
            "flex-1 !bg-transparent border-none py-1.5 !ring-0 !px-0 text-muted-foreground",
            inputClassName
          )}
        />
      </div>
    </div>
  );
}
