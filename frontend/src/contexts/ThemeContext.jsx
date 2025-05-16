import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { theme as antTheme } from "antd";
import { colors } from "../configs/colors";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uuid || "guest";
  const themeKey = `theme-${userId}`;

  // Track if theme is initialized
  const [isThemeReady, setIsThemeReady] = useState(false);

  // Always initialize theme from localStorage for the current user
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(themeKey);
    // Set DOM class synchronously
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
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

  // When userId changes, update theme state and DOM class synchronously
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem(themeKey);
    setTheme(savedTheme || "light");
    document.documentElement.classList.toggle(
      "dark",
      (savedTheme || "light") === "dark"
    );
    setIsThemeReady(true);
  }, [userId, themeKey]);

  // When theme changes, update DOM class and localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(themeKey, theme);
  }, [theme, themeKey]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    // Set CSS variable globally for Tailwind, Antd, and icons
    document.documentElement.style.setProperty(
      "--font-size-base",
      fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px" // medium/default
    );
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
    font: {
      base: "text-base",
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
      xlarge: "text-2xl",
      xxlarge: "text-4xl",
      xxl: "text-3xl",
      xl: "text-xl",
    },
  };

  // Function to get the title font size class (one step larger than content)
  const getTitleFontSizeClass = (contentFontSize) => {
    if (contentFontSize === "small") return themeClasses.font.xl; // text-xl
    if (contentFontSize === "medium") return themeClasses.font.xlarge; // text-2xl
    if (contentFontSize === "large") return themeClasses.font.xxl; // text-3xl
    return themeClasses.font.xl;
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
    getTitleFontSizeClass,
  };

  if (!isThemeReady) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
