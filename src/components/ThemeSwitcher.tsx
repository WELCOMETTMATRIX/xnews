import { Palette, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, THEMES, ThemeId } from "./ThemeProvider";

const SWATCHES: Record<ThemeId, string> = {
  crystal: "linear-gradient(135deg, #22d3ee, #2563eb)",
  midnight: "linear-gradient(135deg, #0f2027, #22d3ee)",
  aurora: "linear-gradient(135deg, #14b8a6, #2563eb, #22c55e)",
  classic: "linear-gradient(135deg, #dc2626, #f59e0b)",
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          title="Change theme"
          aria-label="Change theme"
        >
          <Palette size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-display">Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="gap-3 cursor-pointer"
          >
            <span
              className="h-5 w-5 rounded-full ring-1 ring-border flex-shrink-0"
              style={{ background: SWATCHES[t.id] }}
            />
            <span className="flex-1">
              <span className="block text-sm font-medium leading-none">{t.label}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">{t.hint}</span>
            </span>
            {theme === t.id && <Check size={15} className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
