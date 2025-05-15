import { createContext, useContext, useState, useEffect } from "react";
import { theme as antTheme } from "antd";
import { colors } from "../configs/colors";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    return savedFontSize || "medium";
  });

  const [noteColors, setNoteColors] = useState(() => {
    const savedColors = localStorage.getItem("noteColors");
    return savedColors ? JSON.parse(savedColors) : [colors[theme].primary[500]];
  });

  const currentThemeColors = colors[theme];

  // Ant Design theme configuration
  const antdTheme = {
    algorithm:
      theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: currentThemeColors.primary[600],
      colorBgContainer: currentThemeColors.background.default,
      colorText: currentThemeColors.text.primary,
      colorTextSecondary: currentThemeColors.text.secondary,
      colorBorder:
        theme === "dark"
          ? currentThemeColors.gray[700]
          : currentThemeColors.gray[200],
      borderRadius: 8,
    },
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("noteColors", JSON.stringify(noteColors));
  }, [noteColors]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Theme-aware class utilities
  const themeClasses = {
    text: {
      primary: theme === "dark" ? "text-gray-100" : "text-gray-800",
      secondary: theme === "dark" ? "text-gray-300" : "text-gray-700",
      muted: theme === "dark" ? "text-gray-400" : "text-gray-500",
      light: theme === "dark" ? "text-gray-300" : "text-gray-600",
    },
    bg: {
      primary: theme === "dark" ? "bg-gray-900" : "bg-gray-50",
      secondary: theme === "dark" ? "bg-gray-800" : "bg-white",
      hover: theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100",
    },
    border: {
      primary: theme === "dark" ? "border-gray-700" : "border-gray-200",
      secondary: theme === "dark" ? "border-gray-600" : "border-gray-300",
    },
  };

  const value = {
    theme,
    fontSize,
    noteColors,
    toggleTheme,
    setFontSize,
    setNoteColors,
    currentThemeColors,
    antdTheme,
    themeClasses,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
