import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Classic } from "@theme-toggles/react";
import "@theme-toggles/react/css/Classic.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Classic
      reversed
      toggled={isDark}
      toggle={toggleTheme}
      className={`text-3xl md:text-4xl ${isDark ? "text-[color:var(--accent-yellow)]" : "text-[color:var(--accent-orange)]"}`}
    />
  );
};

export default ThemeToggle; 