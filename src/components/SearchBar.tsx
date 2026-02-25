import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <Search size={16} className="absolute left-3 text-[hsl(var(--news-meta))] pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search any topic..."
        className="pl-9 pr-10 h-10 bg-[hsl(var(--muted))] border-transparent focus:border-[hsl(var(--primary))] font-body text-sm w-64 rounded-full"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-[hsl(var(--news-meta))] hover:text-foreground"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
