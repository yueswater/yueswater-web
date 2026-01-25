"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-9 w-9" />;

  const isDim = theme === "dim";

  return (
    <button
      onClick={() => setTheme(isDim ? "emerald" : "dim")}
      className="relative rounded-md p-2 text-foreground/80 hover:text-primary transition-colors"
      aria-label="Toggle Theme"
    >
      <Sun
        className={`h-5 w-5 transition-all ${
          isDim ? "scale-0 rotate-90" : "scale-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute top-2 left-2 h-5 w-5 transition-all ${
          isDim ? "scale-100 rotate-0" : "scale-0 -rotate-90"
        }`}
      />
    </button>
  );
}

