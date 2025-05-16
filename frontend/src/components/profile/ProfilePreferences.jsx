import { Button, Form, Select, Switch } from "antd";
import CustomColorPicker from "../ui/CustomColorPicker";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";

const ProfilePreferences = () => {
  const {
    theme,
    fontSize,
    noteColors,
    toggleTheme,
    setFontSize,
    setNoteColors,
    currentThemeColors,
    themeClasses,
  } = useTheme();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState(currentThemeColors.primary[500]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [tempNoteColors, setTempNoteColors] = useState([...noteColors]);

  const addNewColor = (color) => {
    if (tempNoteColors.length >= 12) {
      toast(
        "Color Limit Reached: You can have a maximum of 12 colors. Please remove some colors before adding new ones",
        { icon: "ℹ️" }
      );
      return;
    }
    if (!tempNoteColors.includes(color)) {
      setTempNoteColors([...tempNoteColors, color]);
    }
    setShowColorPicker(false);
  };

  const removeColor = (colorToRemove) => {
    setTempNoteColors(
      tempNoteColors.filter((color) => color !== colorToRemove)
    );
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Simulate API call or any async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFontSize(tempFontSize);
      setNoteColors(tempNoteColors);
      setIsEditing(false);
      toast.success(
        "Preferences saved"
      );
    } catch {
      toast.error("Failed to save preferences. Please try again");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setTempFontSize("medium");
    setTempNoteColors([currentThemeColors.primary[500]]);
    toast.success(
      "Preferences have been reset to default"
    );
  };

  return (
    <div>
      <Form layout="vertical" className="space-y-6 max-w-md">
        <div>
          <h3
            className={`text-lg font-medium mb-4 ${themeClasses.text.primary}`}
          >
            Note Preferences
          </h3>
          <Form.Item
            label={
              <span className={themeClasses.text.secondary}>Font Size</span>
            }
          >
            <Select
              className="rounded-lg"
              value={tempFontSize}
              onChange={setTempFontSize}
              disabled={!isEditing}
            >
              <Select.Option value="small">Small</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="large">Large</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className={themeClasses.text.secondary}>Theme</span>}
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm ${themeClasses.text.light}`}>
                Light
              </span>
              <Switch
                checked={theme === "dark"}
                onChange={toggleTheme}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
              <span className={`text-sm ${themeClasses.text.light}`}>Dark</span>
            </div>
          </Form.Item>

          <Form.Item
            label={
              <span className={themeClasses.text.secondary}>Note Colors</span>
            }
          >
            <div className="flex flex-wrap items-center gap-3 mb-2 py-2">
              {tempNoteColors.map((color, index) => (
                <div key={index} className="relative group">
                  <div
                    role="button"
                    aria-label={`Select color ${color}`}
                    tabIndex={0}
                    className={`w-10 h-10 rounded-full border shadow-sm hover:scale-110 transition-transform cursor-pointer ${
                      color === newColor
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : themeClasses.border.secondary
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewColor(color)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setNewColor(color);
                      }
                    }}
                  />
                  <button
                    aria-label={`Remove color ${color}`}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    onClick={() => removeColor(color)}
                    disabled={!isEditing}
                  >
                    ×
                  </button>
                </div>
              ))}
              {showColorPicker ? (
                <CustomColorPicker
                  value={newColor}
                  onChange={setNewColor}
                  onAdd={addNewColor}
                  onCancel={() => setShowColorPicker(false)}
                  openByDefault
                />
              ) : (
                <button
                  type="button"
                  aria-label="Add new color"
                  className={`w-10 h-10 rounded-full ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } border flex items-center justify-center hover:bg-gray-100 transition-colors`}
                  onClick={() => setShowColorPicker(true)}
                  disabled={!isEditing}
                >
                  <span className={themeClasses.text.light}>+</span>
                </button>
              )}
            </div>
            <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
              {tempNoteColors.length}/12 colors used
              {tempNoteColors.length >= 10 && (
                <span className="text-yellow-600">
                  {" "}
                  (Only {12 - tempNoteColors.length} more can be added)
                </span>
              )}
            </p>
          </Form.Item>
        </div>

        <div
          className={`flex gap-2 pt-6 border-t ${themeClasses.border.primary}`}
        >
          {isEditing ? (
            <>
              <Button
                type="primary"
                onClick={handleSavePreferences}
                loading={isSaving}
              >
                Save Preferences
              </Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Preferences</Button>
          )}
          <Button onClick={handleResetToDefault}>Reset to Default</Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfilePreferences;
