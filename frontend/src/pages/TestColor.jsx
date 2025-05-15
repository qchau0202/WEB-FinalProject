import { useTheme } from "../contexts/ThemeContext";
import { Button, Input, Select, Switch, notification } from "antd";
import { useState } from "react";

const TestColor = () => {
  const {
    theme,
    fontSize,
    toggleTheme,
    setFontSize,
    currentThemeColors,
    currentStatusColors,
    currentUiColors,
    getFontSizeClass,
  } = useTheme();

  const [inputValue, setInputValue] = useState("");

  const showNotification = (type) => {
    notification[type]({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
      description: `This is a ${type} notification example`,
      duration: 3,
    });
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Theme Controls */}
        <div
          className={`p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Theme Controls
          </h2>
          <div className="flex items-center gap-4">
            <span
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            >
              Theme:
            </span>
            <Switch
              checked={theme === "dark"}
              onChange={toggleTheme}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            >
              Font Size:
            </span>
            <Select
              value={fontSize}
              onChange={setFontSize}
              options={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
              ]}
            />
          </div>
        </div>

        {/* Color Palette Display */}
        <div
          className={`p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(currentThemeColors.primary).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-lg shadow-md"
                  style={{ backgroundColor: value }}
                />
                <span
                  className={`mt-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {key}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* UI Components */}
        <div
          className={`p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            UI Components
          </h2>

          {/* Buttons */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-700"
              }`}
            >
              Buttons
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button type="primary">Primary Button</Button>
              <Button>Default Button</Button>
              <Button type="dashed">Dashed Button</Button>
              <Button type="text">Text Button</Button>
              <Button type="link">Link Button</Button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="mt-8 space-y-4">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-700"
              }`}
            >
              Input Fields
            </h3>
            <div className="space-y-4">
              <Input
                placeholder="Default Input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input.Password placeholder="Password Input" />
              <Input.TextArea placeholder="Text Area" rows={4} />
            </div>
          </div>

          {/* Status Colors */}
          <div className="mt-8 space-y-4">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-700"
              }`}
            >
              Status Colors
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button
                type="primary"
                style={{ backgroundColor: currentStatusColors.success.light }}
                onClick={() => showNotification("success")}
              >
                Success
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: currentStatusColors.error.light }}
                onClick={() => showNotification("error")}
              >
                Error
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: currentStatusColors.warning.light }}
                onClick={() => showNotification("warning")}
              >
                Warning
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: currentStatusColors.info.light }}
                onClick={() => showNotification("info")}
              >
                Info
              </Button>
            </div>
          </div>

          {/* Text Examples */}
          <div className="mt-8 space-y-4">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-700"
              }`}
            >
              Text Examples
            </h3>
            <div className={`space-y-2 ${getFontSizeClass()}`}>
              <p className={theme === "dark" ? "text-white" : "text-gray-800"}>
                This is a sample text with {fontSize} font size.
              </p>
              <p
                className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                This is secondary text with {fontSize} font size.
              </p>
              <p className="text-blue-500">
                This is a link text with {fontSize} font size.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestColor;
