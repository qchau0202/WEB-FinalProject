/**
 * Color palette for the Notelit application
 * This file documents all colors used throughout the application and their purposes
 */

// Theme Colors
export const themeColors = {
  // Light Theme
  light: {
    primary: {
      50: "#eff6ff", // Lightest blue - Used for hover states and subtle backgrounds
      100: "#dbeafe", // Very light blue - Used for hover states
      200: "#bfdbfe", // Light blue - Used for borders and dividers
      300: "#93c5fd", // Medium light blue - Used for icons and secondary elements
      400: "#60a5fa", // Medium blue - Used for secondary buttons
      500: "#3b82f6", // Primary blue - Main brand color, primary buttons
      600: "#2563eb", // Dark blue - Hover states for primary elements
      700: "#1d4ed8", // Darker blue - Active states
      800: "#1e40af", // Very dark blue - Text on light backgrounds
      900: "#1e3a8a", // Darkest blue - Used sparingly for emphasis
    },
    secondary: {
      50: "#f9fafb", // Lightest gray - Background colors
      100: "#f3f4f6", // Very light gray - Card backgrounds
      200: "#e5e7eb", // Light gray - Borders and dividers
      300: "#d1d5db", // Medium light gray - Disabled states
      400: "#9ca3af", // Medium gray - Secondary text
      500: "#6b7280", // Gray - Body text
      600: "#4b5563", // Dark gray - Headings
      700: "#374151", // Darker gray - Emphasis text
      800: "#1f2937", // Very dark gray - Strong emphasis
      900: "#111827", // Darkest gray - Used sparingly
    },
  },
  // Dark Theme
  dark: {
    primary: {
      50: "#eef2ff", // Lightest indigo - Used for hover states in dark mode
      100: "#e0e7ff", // Very light indigo - Subtle backgrounds in dark mode
      200: "#c7d2fe", // Light indigo - Borders in dark mode
      300: "#a5b4fc", // Medium light indigo - Icons in dark mode
      400: "#818cf8", // Medium indigo - Secondary buttons in dark mode
      500: "#6366f1", // Primary indigo - Main brand color in dark mode
      600: "#4f46e5", // Dark indigo - Hover states in dark mode
      700: "#4338ca", // Darker indigo - Active states in dark mode
      800: "#3730a3", // Very dark indigo - Text on dark backgrounds
      900: "#312e81", // Darkest indigo - Used sparingly in dark mode
    },
    secondary: {
      50: "#f8fafc", // Lightest slate - Background colors in dark mode
      100: "#f1f5f9", // Very light slate - Card backgrounds in dark mode
      200: "#e2e8f0", // Light slate - Borders in dark mode
      300: "#cbd5e1", // Medium light slate - Disabled states in dark mode
      400: "#94a3b8", // Medium slate - Secondary text in dark mode
      500: "#64748b", // Slate - Body text in dark mode
      600: "#475569", // Dark slate - Headings in dark mode
      700: "#334155", // Darker slate - Emphasis text in dark mode
      800: "#1e293b", // Very dark slate - Strong emphasis in dark mode
      900: "#0f172a", // Darkest slate - Used sparingly in dark mode
    },
  },
};

// Status Colors
export const statusColors = {
  success: {
    light: "#10b981", // Green - Success states, confirmations
    dark: "#059669", // Dark green - Success states in dark mode
  },
  error: {
    light: "#ef4444", // Red - Error states, warnings
    dark: "#dc2626", // Dark red - Error states in dark mode
  },
  warning: {
    light: "#f59e0b", // Amber - Warning states
    dark: "#d97706", // Dark amber - Warning states in dark mode
  },
  info: {
    light: "#3b82f6", // Blue - Information states
    dark: "#2563eb", // Dark blue - Information states in dark mode
  },
};

// Label Colors
export const labelColors = {
  work: "#000000", // Black - Work related labels
  study: "#1890ff", // Blue - Study related labels
  exam: "#722ed1", // Purple - Exam related labels
  urgent: "#f5222d", // Red - Urgent related labels
  personal: "#52c41a", // Green - Personal related labels
  ideas: "#2f54eb", // Indigo - Ideas related labels
  relax: "#eb2f96", // Pink - Relax related labels
};

// UI Element Colors
export const uiColors = {
  background: {
    light: "#faf9f6", // Off-white - Main background
    dark: "#121212", // Dark gray - Dark mode background
  },
  text: {
    primary: {
      light: "#161618", // Near black - Primary text
      dark: "#f9fafb", // Off-white - Primary text in dark mode
    },
    secondary: {
      light: "#6b7280", // Gray - Secondary text
      dark: "#94a3b8", // Light gray - Secondary text in dark mode
    },
  },
  border: {
    light: "#d1d5db", // Light gray - Border color
    dark: "#374151", // Dark gray - Border color in dark mode
  },
};

// Toast Notification Colors
export const toastColors = {
  background: "#363636", // Dark gray - Toast background
  success: "#4aed88", // Green - Success toast
  error: "#ff4b4b", // Red - Error toast
  text: "#ffffff", // White - Toast text
};

// Default Colors for Color Picker
export const defaultPickerColors = [
  "#3b82f6", // Blue - Primary brand color
  "#10b981", // Green - Success color
  "#ef4444", // Red - Error color
  "#f59e0b", // Amber - Warning color
  "#6366f1", // Indigo - Secondary brand color
  "#8b5cf6", // Purple - Accent color
  "#ec4899", // Pink - Accent color
  "#14b8a6", // Teal - Accent color
  "#f97316", // Orange - Accent color
  "#84cc16", // Lime - Accent color
  "#06b6d4", // Cyan - Accent color
  "#a855f7", // Violet - Accent color
];
